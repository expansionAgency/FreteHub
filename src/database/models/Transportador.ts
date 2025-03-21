import { query } from '../config';
import UsuarioModel, { IUsuario } from './Usuario';

export interface ITransportador {
  id?: number;
  usuario_id: number;
  razao_social?: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  antt?: string;
  tipo_transportador: 'autonomo' | 'empresa' | 'cooperativa';
  anos_experiencia?: number;
  possui_frota: boolean;
}

export interface ITransportadorCompleto extends ITransportador {
  usuario: IUsuario;
}

class TransportadorModel {
  /**
   * Cria um novo transportador associado a um usuário existente
   */
  async criar(dados: ITransportador): Promise<number> {
    const sql = `
      INSERT INTO transportadores (
        usuario_id, razao_social, nome_fantasia, inscricao_estadual,
        antt, tipo_transportador, anos_experiencia, possui_frota
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      dados.usuario_id,
      dados.razao_social || null,
      dados.nome_fantasia || null,
      dados.inscricao_estadual || null,
      dados.antt || null,
      dados.tipo_transportador,
      dados.anos_experiencia || null,
      dados.possui_frota || false
    ];
    
    try {
      const result: any = await query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar transportador:', error);
      throw error;
    }
  }
  
  /**
   * Cadastro completo de transportador (cria usuário + perfil de transportador)
   */
  async cadastroCompleto(usuario: IUsuario, dadosTransportador: Partial<ITransportador>): Promise<number> {
    try {
      // Garante que o tipo de usuário é transportador
      usuario.tipo_usuario = 'transportador';
      
      // Cria o usuário
      const usuarioId = await UsuarioModel.criar(usuario);
      
      // Cria o perfil de transportador
      const dadosCompletos: ITransportador = {
        usuario_id: usuarioId,
        tipo_transportador: dadosTransportador.tipo_transportador || 'autonomo',
        possui_frota: dadosTransportador.possui_frota || false,
        ...dadosTransportador
      };
      
      const transportadorId = await this.criar(dadosCompletos);
      return transportadorId;
    } catch (error) {
      console.error('Erro no cadastro completo de transportador:', error);
      throw error;
    }
  }
  
  /**
   * Busca um transportador pelo ID do usuário
   */
  async buscarPorUsuarioId(usuarioId: number): Promise<ITransportador | null> {
    const sql = `SELECT * FROM transportadores WHERE usuario_id = ?`;
    const result: any = await query(sql, [usuarioId]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Busca um transportador pelo seu ID
   */
  async buscarPorId(id: number): Promise<ITransportador | null> {
    const sql = `SELECT * FROM transportadores WHERE id = ?`;
    const result: any = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Busca um transportador com seus dados completos de usuário
   */
  async buscarCompleto(id: number): Promise<ITransportadorCompleto | null> {
    const transportador = await this.buscarPorId(id);
    
    if (!transportador) {
      return null;
    }
    
    const usuario = await UsuarioModel.buscarPorId(transportador.usuario_id);
    
    if (!usuario) {
      return null;
    }
    
    return {
      ...transportador,
      usuario
    };
  }
  
  /**
   * Atualiza os dados de um transportador
   */
  async atualizar(id: number, dados: Partial<ITransportador>): Promise<boolean> {
    // Remove o ID de usuário para não ser alterado
    delete dados.usuario_id;
    
    if (Object.keys(dados).length === 0) {
      return false; // Nenhum dado para atualizar
    }
    
    const campos = Object.keys(dados)
      .map(campo => `${campo} = ?`)
      .join(', ');
    
    const valores = Object.values(dados);
    valores.push(id);
    
    const sql = `UPDATE transportadores SET ${campos} WHERE id = ?`;
    
    const result: any = await query(sql, valores);
    return result.affectedRows > 0;
  }
  
  /**
   * Lista transportadores com paginação e filtros
   */
  async listar(pagina: number = 1, limite: number = 20, filtros: any = {}): Promise<{ transportadores: ITransportador[], total: number }> {
    const offset = (pagina - 1) * limite;
    
    let where = '';
    const params: any[] = [];
    
    if (filtros.tipo_transportador) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'tipo_transportador = ?';
      params.push(filtros.tipo_transportador);
    }
    
    if (filtros.possui_frota !== undefined) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'possui_frota = ?';
      params.push(filtros.possui_frota);
    }
    
    // Adicione mais filtros conforme necessário
    
    const sqlCount = `SELECT COUNT(*) as total FROM transportadores${where}`;
    const sqlQuery = `
      SELECT * FROM transportadores${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limite, offset);
    
    const [countResult, transportadores]: any = await Promise.all([
      query(sqlCount, params.slice(0, -2)), // Remove os parâmetros de LIMIT e OFFSET
      query(sqlQuery, params)
    ]);
    
    return {
      transportadores,
      total: countResult[0].total
    };
  }
  
  /**
   * Busca transportadores disponíveis para determinada rota
   * Esta é uma consulta mais complexa que poderia levar em consideração
   * a localização dos transportadores, tipos de veículos, etc.
   */
  async buscarDisponiveisPorRota(
    origemEstado: string, 
    destinoEstado: string, 
    pagina: number = 1, 
    limite: number = 20
  ): Promise<{ transportadores: ITransportador[], total: number }> {
    const offset = (pagina - 1) * limite;
    
    // Esta é uma implementação simplificada
    // Em um sistema real, teria lógica mais complexa para matching de transportadores
    const sql = `
      SELECT t.* 
      FROM transportadores t
      JOIN usuarios u ON t.usuario_id = u.id
      WHERE u.ativo = true
      ORDER BY t.id DESC
      LIMIT ? OFFSET ?
    `;
    
    const sqlCount = `
      SELECT COUNT(*) as total 
      FROM transportadores t
      JOIN usuarios u ON t.usuario_id = u.id
      WHERE u.ativo = true
    `;
    
    const [countResult, transportadores]: any = await Promise.all([
      query(sqlCount),
      query(sql, [limite, offset])
    ]);
    
    return {
      transportadores,
      total: countResult[0].total
    };
  }
}

export default new TransportadorModel(); 