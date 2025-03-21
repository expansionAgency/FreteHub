import { query } from '../config';

export interface IOferta {
  id?: number;
  carga_id: number;
  transportador_id: number;
  valor: number;
  observacoes?: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'cancelada';
  data_oferta: Date;
  data_resposta?: Date;
}

export interface IOfertaCompleta extends IOferta {
  carga: {
    id: number;
    titulo: string;
    origem_cidade: string;
    origem_estado: string;
    destino_cidade: string;
    destino_estado: string;
    data_coleta: Date;
    embarcador_id: number;
  };
  transportador: {
    id: number;
    nome: string;
    empresa?: string;
  };
}

class OfertaModel {
  /**
   * Cria uma nova oferta para uma carga
   */
  async criar(oferta: Omit<IOferta, 'id' | 'status' | 'data_oferta' | 'data_resposta'>): Promise<number> {
    const sql = `
      INSERT INTO ofertas (
        carga_id, transportador_id, valor, observacoes,
        status, data_oferta
      ) VALUES (?, ?, ?, ?, 'pendente', NOW())
    `;
    
    const params = [
      oferta.carga_id,
      oferta.transportador_id,
      oferta.valor,
      oferta.observacoes || null
    ];
    
    try {
      // Verificar se já existe uma oferta desse transportador para essa carga
      const ofertaExistente = await this.buscarPorCargaETransportador(
        oferta.carga_id, 
        oferta.transportador_id
      );
      
      if (ofertaExistente) {
        throw new Error('Já existe uma oferta deste transportador para esta carga');
      }
      
      // Atualizar o status da carga para 'em_negociacao'
      await query(
        `UPDATE cargas SET status = 'em_negociacao' WHERE id = ? AND status = 'aberta'`,
        [oferta.carga_id]
      );
      
      const result: any = await query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
      throw error;
    }
  }
  
  /**
   * Busca uma oferta pelo ID
   */
  async buscarPorId(id: number): Promise<IOferta | null> {
    const sql = `SELECT * FROM ofertas WHERE id = ?`;
    const result: any = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    return this.formatarDatas(result[0]);
  }
  
  /**
   * Busca uma oferta com dados completos
   */
  async buscarCompleta(id: number): Promise<IOfertaCompleta | null> {
    const oferta = await this.buscarPorId(id);
    if (!oferta) return null;
    
    const sqlCarga = `
      SELECT id, titulo, origem_cidade, origem_estado, destino_cidade, destino_estado,
        data_coleta, embarcador_id
      FROM cargas 
      WHERE id = ?
    `;
    const resultCarga: any = await query(sqlCarga, [oferta.carga_id]);
    
    const sqlTransportador = `
      SELECT t.id, u.nome, COALESCE(t.razao_social, t.nome_fantasia) as empresa
      FROM transportadores t
      JOIN usuarios u ON t.usuario_id = u.id
      WHERE t.id = ?
    `;
    const resultTransportador: any = await query(sqlTransportador, [oferta.transportador_id]);
    
    if (resultCarga.length === 0 || resultTransportador.length === 0) {
      return null;
    }
    
    return {
      ...oferta,
      carga: {
        ...resultCarga[0],
        data_coleta: resultCarga[0].data_coleta instanceof Date 
          ? resultCarga[0].data_coleta 
          : new Date(resultCarga[0].data_coleta)
      },
      transportador: resultTransportador[0]
    };
  }
  
  /**
   * Busca oferta por carga e transportador
   */
  async buscarPorCargaETransportador(cargaId: number, transportadorId: number): Promise<IOferta | null> {
    const sql = `SELECT * FROM ofertas WHERE carga_id = ? AND transportador_id = ?`;
    const result: any = await query(sql, [cargaId, transportadorId]);
    
    if (result.length === 0) {
      return null;
    }
    
    return this.formatarDatas(result[0]);
  }
  
  /**
   * Atualiza o status de uma oferta
   */
  async atualizarStatus(id: number, status: 'aceita' | 'recusada' | 'cancelada'): Promise<boolean> {
    const sql = `
      UPDATE ofertas 
      SET status = ?, data_resposta = NOW() 
      WHERE id = ?
    `;
    
    try {
      const oferta = await this.buscarPorId(id);
      if (!oferta) return false;
      
      const result: any = await query(sql, [status, id]);
      
      // Se a oferta for aceita, atualizar a carga e recusar as outras ofertas
      if (status === 'aceita') {
        await query(
          `UPDATE cargas SET status = 'aceita', transportador_id = ?, data_atualizacao = NOW() WHERE id = ?`,
          [oferta.transportador_id, oferta.carga_id]
        );
        
        // Recusar outras ofertas para esta carga
        await query(
          `UPDATE ofertas SET status = 'recusada', data_resposta = NOW() WHERE carga_id = ? AND id != ? AND status = 'pendente'`,
          [oferta.carga_id, id]
        );
      }
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar status da oferta:', error);
      throw error;
    }
  }
  
  /**
   * Aceita uma oferta
   */
  async aceitar(id: number): Promise<boolean> {
    return this.atualizarStatus(id, 'aceita');
  }
  
  /**
   * Recusa uma oferta
   */
  async recusar(id: number): Promise<boolean> {
    return this.atualizarStatus(id, 'recusada');
  }
  
  /**
   * Cancela uma oferta (pelo transportador)
   */
  async cancelar(id: number): Promise<boolean> {
    return this.atualizarStatus(id, 'cancelada');
  }
  
  /**
   * Lista ofertas por carga
   */
  async listarPorCarga(cargaId: number): Promise<IOferta[]> {
    const sql = `
      SELECT * FROM ofertas 
      WHERE carga_id = ? 
      ORDER BY valor ASC, data_oferta ASC
    `;
    
    const result: any = await query(sql, [cargaId]);
    return result.map((oferta: any) => this.formatarDatas(oferta));
  }
  
  /**
   * Lista ofertas por transportador
   */
  async listarPorTransportador(
    transportadorId: number,
    pagina: number = 1,
    limite: number = 20,
    filtros: Partial<{
      status: string;
    }> = {}
  ): Promise<{ ofertas: IOferta[], total: number }> {
    const offset = (pagina - 1) * limite;
    
    let where = 'WHERE transportador_id = ?';
    const params: any[] = [transportadorId];
    
    if (filtros.status) {
      where += ' AND status = ?';
      params.push(filtros.status);
    }
    
    const sqlCount = `SELECT COUNT(*) as total FROM ofertas ${where}`;
    const sqlQuery = `
      SELECT * FROM ofertas ${where}
      ORDER BY data_oferta DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limite, offset);
    
    const [countResult, result]: any = await Promise.all([
      query(sqlCount, params.slice(0, -2)), // Remove os parâmetros de LIMIT e OFFSET
      query(sqlQuery, params)
    ]);
    
    const ofertas = result.map((oferta: any) => this.formatarDatas(oferta));
    
    return {
      ofertas,
      total: countResult[0].total
    };
  }
  
  /**
   * Lista ofertas por embarcador
   */
  async listarPorEmbarcador(
    embarcadorId: number,
    pagina: number = 1,
    limite: number = 20,
    filtros: Partial<{
      status: string;
      cargaId: number;
    }> = {}
  ): Promise<{ ofertas: IOferta[], total: number }> {
    const offset = (pagina - 1) * limite;
    
    let where = `
      JOIN cargas c ON o.carga_id = c.id
      WHERE c.embarcador_id = ?
    `;
    const params: any[] = [embarcadorId];
    
    if (filtros.status) {
      where += ' AND o.status = ?';
      params.push(filtros.status);
    }
    
    if (filtros.cargaId) {
      where += ' AND o.carga_id = ?';
      params.push(filtros.cargaId);
    }
    
    const sqlCount = `
      SELECT COUNT(*) as total 
      FROM ofertas o ${where}
    `;
    
    const sqlQuery = `
      SELECT o.* 
      FROM ofertas o ${where}
      ORDER BY o.data_oferta DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limite, offset);
    
    const [countResult, result]: any = await Promise.all([
      query(sqlCount, params.slice(0, -2)), // Remove os parâmetros de LIMIT e OFFSET
      query(sqlQuery, params)
    ]);
    
    const ofertas = result.map((oferta: any) => this.formatarDatas(oferta));
    
    return {
      ofertas,
      total: countResult[0].total
    };
  }
  
  /**
   * Utilitário para formatar as datas vindas do banco
   * @private
   */
  private formatarDatas(oferta: any): IOferta {
    const resultado: IOferta = {
      ...oferta,
      data_oferta: oferta.data_oferta instanceof Date 
        ? oferta.data_oferta 
        : new Date(oferta.data_oferta)
    };
    
    if (oferta.data_resposta) {
      resultado.data_resposta = oferta.data_resposta instanceof Date
        ? oferta.data_resposta
        : new Date(oferta.data_resposta);
    }
    
    return resultado;
  }
}

export default new OfertaModel(); 