import { query } from '../config';
import UsuarioModel, { IUsuario } from './Usuario';

export interface IEmbarcador {
  id?: number;
  usuario_id: number;
  razao_social?: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  segmento?: string;
  site?: string;
  quantidade_funcionarios?: number;
  volume_medio_cargas?: number;
}

export interface IEmbarcadorCompleto extends IEmbarcador {
  usuario: IUsuario;
}

class EmbarcadorModel {
  /**
   * Cria um novo embarcador associado a um usuário existente
   */
  async criar(dados: IEmbarcador): Promise<number> {
    const sql = `
      INSERT INTO embarcadores (
        usuario_id, razao_social, nome_fantasia, inscricao_estadual,
        segmento, site, quantidade_funcionarios, volume_medio_cargas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      dados.usuario_id,
      dados.razao_social || null,
      dados.nome_fantasia || null,
      dados.inscricao_estadual || null,
      dados.segmento || null,
      dados.site || null,
      dados.quantidade_funcionarios || null,
      dados.volume_medio_cargas || null
    ];
    
    try {
      const result: any = await query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar embarcador:', error);
      throw error;
    }
  }
  
  /**
   * Cadastro completo de embarcador (cria usuário + perfil de embarcador)
   */
  async cadastroCompleto(usuario: IUsuario, dadosEmbarcador: Partial<IEmbarcador>): Promise<number> {
    try {
      // Garante que o tipo de usuário é embarcador
      usuario.tipo_usuario = 'embarcador';
      
      // Cria o usuário
      const usuarioId = await UsuarioModel.criar(usuario);
      
      // Cria o perfil de embarcador
      const dadosCompletos: IEmbarcador = {
        usuario_id: usuarioId,
        ...dadosEmbarcador
      };
      
      const embarcadorId = await this.criar(dadosCompletos);
      return embarcadorId;
    } catch (error) {
      console.error('Erro no cadastro completo de embarcador:', error);
      throw error;
    }
  }
  
  /**
   * Busca um embarcador pelo ID do usuário
   */
  async buscarPorUsuarioId(usuarioId: number): Promise<IEmbarcador | null> {
    const sql = `SELECT * FROM embarcadores WHERE usuario_id = ?`;
    const result: any = await query(sql, [usuarioId]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Busca um embarcador pelo seu ID
   */
  async buscarPorId(id: number): Promise<IEmbarcador | null> {
    const sql = `SELECT * FROM embarcadores WHERE id = ?`;
    const result: any = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Busca um embarcador com seus dados completos de usuário
   */
  async buscarCompleto(id: number): Promise<IEmbarcadorCompleto | null> {
    const embarcador = await this.buscarPorId(id);
    
    if (!embarcador) {
      return null;
    }
    
    const usuario = await UsuarioModel.buscarPorId(embarcador.usuario_id);
    
    if (!usuario) {
      return null;
    }
    
    return {
      ...embarcador,
      usuario
    };
  }
  
  /**
   * Atualiza os dados de um embarcador
   */
  async atualizar(id: number, dados: Partial<IEmbarcador>): Promise<boolean> {
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
    
    const sql = `UPDATE embarcadores SET ${campos} WHERE id = ?`;
    
    const result: any = await query(sql, valores);
    return result.affectedRows > 0;
  }
  
  /**
   * Lista embarcadores com paginação e filtros
   */
  async listar(pagina: number = 1, limite: number = 20, filtros: any = {}): Promise<{ embarcadores: IEmbarcador[], total: number }> {
    const offset = (pagina - 1) * limite;
    
    let where = '';
    const params: any[] = [];
    
    if (filtros.segmento) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'segmento = ?';
      params.push(filtros.segmento);
    }
    
    // Adicione mais filtros conforme necessário
    
    const sqlCount = `SELECT COUNT(*) as total FROM embarcadores${where}`;
    const sqlQuery = `
      SELECT * FROM embarcadores${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limite, offset);
    
    const [countResult, embarcadores]: any = await Promise.all([
      query(sqlCount, params.slice(0, -2)), // Remove os parâmetros de LIMIT e OFFSET
      query(sqlQuery, params)
    ]);
    
    return {
      embarcadores,
      total: countResult[0].total
    };
  }
}

export default new EmbarcadorModel(); 