import { query } from '../config';

export interface ICarga {
  id?: number;
  embarcador_id: number;
  transportador_id?: number;
  titulo: string;
  descricao: string;
  tipo_mercadoria: string;
  peso: number;
  volume?: number;
  valor_mercadoria?: number;
  valor_frete?: number;
  origem_cep: string;
  origem_cidade: string;
  origem_estado: string;
  destino_cep: string;
  destino_cidade: string;
  destino_estado: string;
  data_coleta: Date;
  data_entrega: Date;
  requisitos_veiculo?: string;
  status: 'aberta' | 'em_negociacao' | 'aceita' | 'em_transporte' | 'entregue' | 'cancelada';
  data_criacao: Date;
  data_atualizacao: Date;
}

export interface ICargaCompleta extends ICarga {
  embarcador: {
    id: number;
    nome: string;
    empresa: string;
  };
  transportador?: {
    id: number;
    nome: string;
    empresa?: string;
  };
  ofertas?: {
    id: number;
    transportador_id: number;
    transportador_nome: string;
    valor: number;
    observacoes?: string;
    data_oferta: Date;
  }[];
}

class CargaModel {
  /**
   * Cria uma nova carga
   */
  async criar(carga: Omit<ICarga, 'id' | 'status' | 'data_criacao' | 'data_atualizacao'>): Promise<number> {
    const sql = `
      INSERT INTO cargas (
        embarcador_id, titulo, descricao, tipo_mercadoria, peso, volume,
        valor_mercadoria, valor_frete, origem_cep, origem_cidade, origem_estado,
        destino_cep, destino_cidade, destino_estado, data_coleta, data_entrega,
        requisitos_veiculo, status, data_criacao, data_atualizacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      carga.embarcador_id,
      carga.titulo,
      carga.descricao,
      carga.tipo_mercadoria,
      carga.peso,
      carga.volume || null,
      carga.valor_mercadoria || null,
      carga.valor_frete || null,
      carga.origem_cep,
      carga.origem_cidade,
      carga.origem_estado,
      carga.destino_cep,
      carga.destino_cidade,
      carga.destino_estado,
      carga.data_coleta,
      carga.data_entrega,
      carga.requisitos_veiculo || null,
      'aberta' // Status inicial
    ];
    
    try {
      const result: any = await query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar carga:', error);
      throw error;
    }
  }
  
  /**
   * Busca uma carga pelo ID
   */
  async buscarPorId(id: number): Promise<ICarga | null> {
    const sql = `SELECT * FROM cargas WHERE id = ?`;
    const result: any = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    return this.formatarDatas(result[0]);
  }
  
  /**
   * Busca uma carga com dados completos (embarcador, transportador e ofertas)
   */
  async buscarCompleta(id: number): Promise<ICargaCompleta | null> {
    // Busca a carga com dados básicos
    const carga = await this.buscarPorId(id);
    if (!carga) return null;
    
    // Busca dados do embarcador
    const sqlEmbarcador = `
      SELECT e.id, u.nome, COALESCE(e.razao_social, e.nome_fantasia) as empresa
      FROM embarcadores e
      JOIN usuarios u ON e.usuario_id = u.id
      WHERE e.id = ?
    `;
    const resultEmbarcador: any = await query(sqlEmbarcador, [carga.embarcador_id]);
    
    // Busca dados do transportador (se existir)
    let transportador = null;
    if (carga.transportador_id) {
      const sqlTransportador = `
        SELECT t.id, u.nome, COALESCE(t.razao_social, t.nome_fantasia) as empresa
        FROM transportadores t
        JOIN usuarios u ON t.usuario_id = u.id
        WHERE t.id = ?
      `;
      const resultTransportador: any = await query(sqlTransportador, [carga.transportador_id]);
      if (resultTransportador.length > 0) {
        transportador = resultTransportador[0];
      }
    }
    
    // Busca ofertas para a carga
    const sqlOfertas = `
      SELECT o.id, o.transportador_id, u.nome as transportador_nome, o.valor, 
        o.observacoes, o.data_oferta
      FROM ofertas o
      JOIN transportadores t ON o.transportador_id = t.id
      JOIN usuarios u ON t.usuario_id = u.id
      WHERE o.carga_id = ?
      ORDER BY o.valor ASC
    `;
    const resultOfertas: any = await query(sqlOfertas, [id]);
    
    // Formata as datas nas ofertas
    const ofertas = resultOfertas.map((o: any) => ({
      ...o,
      data_oferta: o.data_oferta instanceof Date ? o.data_oferta : new Date(o.data_oferta)
    }));
    
    // Retorna o objeto completo
    return {
      ...carga,
      embarcador: resultEmbarcador[0],
      transportador: transportador,
      ofertas: ofertas.length > 0 ? ofertas : undefined
    };
  }
  
  /**
   * Atualiza os dados de uma carga
   */
  async atualizar(id: number, dados: Partial<ICarga>): Promise<boolean> {
    // Não permitir alterar o embarcador
    delete dados.embarcador_id;
    // Atualizar a data
    dados.data_atualizacao = new Date();
    
    if (Object.keys(dados).length === 0) {
      return false; // Nenhum dado para atualizar
    }
    
    const campos = Object.keys(dados)
      .map(campo => `${campo} = ?`)
      .join(', ');
    
    const valores = Object.values(dados);
    valores.push(id);
    
    const sql = `UPDATE cargas SET ${campos} WHERE id = ?`;
    
    const result: any = await query(sql, valores);
    return result.affectedRows > 0;
  }
  
  /**
   * Atualiza o status de uma carga
   */
  async atualizarStatus(id: number, status: ICarga['status'], transportadorId?: number): Promise<boolean> {
    let sql = `UPDATE cargas SET status = ?, data_atualizacao = NOW()`;
    const params: any[] = [status];
    
    // Se o status for "aceita" ou "em_transporte", atualizamos o transportador
    if ((status === 'aceita' || status === 'em_transporte') && transportadorId) {
      sql += `, transportador_id = ?`;
      params.push(transportadorId);
    }
    
    sql += ` WHERE id = ?`;
    params.push(id);
    
    const result: any = await query(sql, params);
    return result.affectedRows > 0;
  }
  
  /**
   * Cancela uma carga
   */
  async cancelar(id: number): Promise<boolean> {
    return this.atualizarStatus(id, 'cancelada');
  }
  
  /**
   * Lista cargas com filtros e paginação
   */
  async listar(
    pagina: number = 1, 
    limite: number = 20, 
    filtros: Partial<{
      embarcador_id: number;
      transportador_id: number;
      status: string;
      origem_estado: string;
      destino_estado: string;
      data_coleta_min: Date;
      data_coleta_max: Date;
      peso_min: number;
      peso_max: number;
    }> = {}
  ): Promise<{ cargas: ICarga[], total: number }> {
    const offset = (pagina - 1) * limite;
    
    let where = '';
    const params: any[] = [];
    
    if (filtros.embarcador_id) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'embarcador_id = ?';
      params.push(filtros.embarcador_id);
    }
    
    if (filtros.transportador_id) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'transportador_id = ?';
      params.push(filtros.transportador_id);
    }
    
    if (filtros.status) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'status = ?';
      params.push(filtros.status);
    } else {
      // Por padrão, não mostrar cargas canceladas
      where += where ? ' AND ' : ' WHERE ';
      where += 'status != "cancelada"';
    }
    
    if (filtros.origem_estado) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'origem_estado = ?';
      params.push(filtros.origem_estado);
    }
    
    if (filtros.destino_estado) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'destino_estado = ?';
      params.push(filtros.destino_estado);
    }
    
    if (filtros.data_coleta_min) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'data_coleta >= ?';
      params.push(filtros.data_coleta_min);
    }
    
    if (filtros.data_coleta_max) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'data_coleta <= ?';
      params.push(filtros.data_coleta_max);
    }
    
    if (filtros.peso_min) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'peso >= ?';
      params.push(filtros.peso_min);
    }
    
    if (filtros.peso_max) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'peso <= ?';
      params.push(filtros.peso_max);
    }
    
    const sqlCount = `SELECT COUNT(*) as total FROM cargas${where}`;
    const sqlQuery = `
      SELECT * FROM cargas${where}
      ORDER BY data_criacao DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limite, offset);
    
    const [countResult, result]: any = await Promise.all([
      query(sqlCount, params.slice(0, -2)), // Remove os parâmetros de LIMIT e OFFSET
      query(sqlQuery, params)
    ]);
    
    const cargas = result.map((carga: any) => this.formatarDatas(carga));
    
    return {
      cargas,
      total: countResult[0].total
    };
  }
  
  /**
   * Lista cargas disponíveis para cotação (status = 'aberta')
   */
  async listarDisponiveisParaCotacao(
    pagina: number = 1, 
    limite: number = 20,
    filtros: Partial<{
      origem_estado: string;
      destino_estado: string;
      data_coleta_min: Date;
    }> = {}
  ): Promise<{ cargas: ICarga[], total: number }> {
    return this.listar(pagina, limite, {
      ...filtros,
      status: 'aberta'
    });
  }
  
  /**
   * Utilitário para formatar as datas vindas do banco
   * @private
   */
  private formatarDatas(carga: any): ICarga {
    return {
      ...carga,
      data_coleta: carga.data_coleta instanceof Date ? carga.data_coleta : new Date(carga.data_coleta),
      data_entrega: carga.data_entrega instanceof Date ? carga.data_entrega : new Date(carga.data_entrega),
      data_criacao: carga.data_criacao instanceof Date ? carga.data_criacao : new Date(carga.data_criacao),
      data_atualizacao: carga.data_atualizacao instanceof Date ? carga.data_atualizacao : new Date(carga.data_atualizacao)
    };
  }
}

export default new CargaModel(); 