import { query } from '../config';

export interface IEndereco {
  id?: number;
  usuario_id: number;
  tipo: 'residencial' | 'comercial' | 'entrega' | 'cobranca' | 'outro';
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
  observacoes?: string;
}

class EnderecoModel {
  /**
   * Cria um novo endereço
   */
  async criar(endereco: IEndereco): Promise<number> {
    // Se for o endereço principal, desmarcar outros endereços principais
    if (endereco.principal) {
      await this.desmarcarPrincipal(endereco.usuario_id);
    }
    
    const sql = `
      INSERT INTO enderecos (
        usuario_id, tipo, cep, logradouro, numero, 
        complemento, bairro, cidade, estado, principal, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      endereco.usuario_id,
      endereco.tipo,
      endereco.cep.replace(/\D/g, ''), // Remove caracteres não numéricos
      endereco.logradouro,
      endereco.numero,
      endereco.complemento || null,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.principal || false,
      endereco.observacoes || null
    ];
    
    try {
      const result: any = await query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      throw error;
    }
  }
  
  /**
   * Busca um endereço pelo ID
   */
  async buscarPorId(id: number): Promise<IEndereco | null> {
    const sql = `SELECT * FROM enderecos WHERE id = ?`;
    const result: any = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Busca endereços por usuário
   */
  async buscarPorUsuario(usuarioId: number): Promise<IEndereco[]> {
    const sql = `SELECT * FROM enderecos WHERE usuario_id = ? ORDER BY principal DESC, id ASC`;
    const result: any = await query(sql, [usuarioId]);
    
    return result;
  }
  
  /**
   * Busca o endereço principal de um usuário
   */
  async buscarPrincipal(usuarioId: number): Promise<IEndereco | null> {
    const sql = `SELECT * FROM enderecos WHERE usuario_id = ? AND principal = true LIMIT 1`;
    const result: any = await query(sql, [usuarioId]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Atualiza os dados de um endereço
   */
  async atualizar(id: number, dados: Partial<IEndereco>): Promise<boolean> {
    // Não permitir alterar o usuário
    delete dados.usuario_id;
    
    // Se for marcar como principal, desmarcar outros endereços principais
    if (dados.principal) {
      const endereco = await this.buscarPorId(id);
      if (endereco) {
        await this.desmarcarPrincipal(endereco.usuario_id);
      }
    }
    
    if (Object.keys(dados).length === 0) {
      return false; // Nenhum dado para atualizar
    }
    
    // Se o CEP for fornecido, limpar caracteres não numéricos
    if (dados.cep) {
      dados.cep = dados.cep.replace(/\D/g, '');
    }
    
    const campos = Object.keys(dados)
      .map(campo => `${campo} = ?`)
      .join(', ');
    
    const valores = Object.values(dados);
    valores.push(id);
    
    const sql = `UPDATE enderecos SET ${campos} WHERE id = ?`;
    
    const result: any = await query(sql, valores);
    return result.affectedRows > 0;
  }
  
  /**
   * Define um endereço como principal
   */
  async definirComoPrincipal(id: number): Promise<boolean> {
    const endereco = await this.buscarPorId(id);
    if (!endereco) return false;
    
    await this.desmarcarPrincipal(endereco.usuario_id);
    
    const sql = `UPDATE enderecos SET principal = true WHERE id = ?`;
    const result: any = await query(sql, [id]);
    return result.affectedRows > 0;
  }
  
  /**
   * Desmarca todos os endereços principais de um usuário
   * @private
   */
  private async desmarcarPrincipal(usuarioId: number): Promise<void> {
    const sql = `UPDATE enderecos SET principal = false WHERE usuario_id = ? AND principal = true`;
    await query(sql, [usuarioId]);
  }
  
  /**
   * Exclui um endereço
   */
  async excluir(id: number): Promise<boolean> {
    const sql = `DELETE FROM enderecos WHERE id = ?`;
    
    try {
      // Verificar se o endereço existe e se é o principal
      const endereco = await this.buscarPorId(id);
      if (!endereco) return false;
      
      const result: any = await query(sql, [id]);
      
      // Se o endereço excluído era o principal, definir outro endereço como principal
      if (endereco.principal) {
        const enderecos = await this.buscarPorUsuario(endereco.usuario_id);
        if (enderecos.length > 0) {
          await this.definirComoPrincipal(enderecos[0].id!);
        }
      }
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      throw error;
    }
  }
  
  /**
   * Formata um endereço como string
   */
  formatarEndereco(endereco: IEndereco): string {
    let formatado = `${endereco.logradouro}, ${endereco.numero}`;
    
    if (endereco.complemento) {
      formatado += ` - ${endereco.complemento}`;
    }
    
    formatado += ` - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}, ${this.formatarCEP(endereco.cep)}`;
    
    return formatado;
  }
  
  /**
   * Formata um CEP (00000-000)
   */
  formatarCEP(cep: string): string {
    const cepNumerico = cep.replace(/\D/g, '');
    if (cepNumerico.length !== 8) return cep;
    return `${cepNumerico.substring(0, 5)}-${cepNumerico.substring(5)}`;
  }
}

export default new EnderecoModel(); 