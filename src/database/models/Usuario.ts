import { query } from '../config';
import bcrypt from 'bcrypt';

export interface IUsuario {
  id?: number;
  email: string;
  senha: string;
  tipo_usuario: 'embarcador' | 'transportador';
  nome: string;
  telefone: string;
  documento: string;
  documento_tipo: 'cpf' | 'cnpj';
  verificado?: boolean;
  token_verificacao?: string;
  data_expiracao_token?: Date;
  ativo?: boolean;
  foto_perfil?: string;
}

class UsuarioModel {
  /**
   * Cria um novo usuário no banco de dados
   */
  async criar(usuario: IUsuario): Promise<number> {
    // Hash da senha antes de salvar
    const senhaHash = await bcrypt.hash(usuario.senha, 10);
    
    const sql = `
      INSERT INTO usuarios (
        email, senha, tipo_usuario, nome, telefone, 
        documento, documento_tipo, token_verificacao, data_expiracao_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Gerar token de verificação
    const token = Math.random().toString(36).substring(2, 15);
    
    // Data de expiração (24 horas a partir de agora)
    const dataExpiracao = new Date();
    dataExpiracao.setHours(dataExpiracao.getHours() + 24);
    
    const params = [
      usuario.email,
      senhaHash,
      usuario.tipo_usuario,
      usuario.nome,
      usuario.telefone,
      usuario.documento,
      usuario.documento_tipo,
      token,
      dataExpiracao
    ];
    
    try {
      const result: any = await query(sql, params);
      return result.insertId;
    } catch (error) {
      // Verificar se o erro é de duplicação de email
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new Error('Este email já está sendo utilizado.');
      }
      throw error;
    }
  }
  
  /**
   * Busca um usuário pelo ID
   */
  async buscarPorId(id: number): Promise<IUsuario | null> {
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    const result: any = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    // Remove a senha do resultado por segurança
    const usuario = result[0];
    delete usuario.senha;
    
    return usuario;
  }
  
  /**
   * Busca um usuário pelo email
   */
  async buscarPorEmail(email: string): Promise<IUsuario | null> {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    const result: any = await query(sql, [email]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Verifica se as credenciais de login são válidas
   */
  async verificarCredenciais(email: string, senha: string): Promise<IUsuario | null> {
    const usuario = await this.buscarPorEmail(email);
    
    if (!usuario) {
      return null;
    }
    
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaCorreta) {
      return null;
    }
    
    // Remove a senha do resultado por segurança
    delete usuario.senha;
    
    return usuario;
  }
  
  /**
   * Atualiza os dados de um usuário
   */
  async atualizar(id: number, dados: Partial<IUsuario>): Promise<boolean> {
    // Não permitir atualizar o email e tipo_usuario por esta função
    delete dados.email;
    delete dados.tipo_usuario;
    
    // Se a senha estiver sendo atualizada, criptografa-a
    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }
    
    const campos = Object.keys(dados)
      .map(campo => `${campo} = ?`)
      .join(', ');
    
    if (!campos) {
      return false; // Nenhum campo para atualizar
    }
    
    const valores = Object.values(dados);
    valores.push(id);
    
    const sql = `UPDATE usuarios SET ${campos} WHERE id = ?`;
    
    const result: any = await query(sql, valores);
    return result.affectedRows > 0;
  }
  
  /**
   * Verifica o e-mail do usuário usando o token
   */
  async verificarEmail(token: string): Promise<boolean> {
    const sql = `
      UPDATE usuarios 
      SET verificado = true, token_verificacao = NULL 
      WHERE token_verificacao = ? AND data_expiracao_token > NOW()
    `;
    
    const result: any = await query(sql, [token]);
    return result.affectedRows > 0;
  }
  
  /**
   * Cria um token para recuperação de senha
   */
  async criarTokenRecuperacaoSenha(email: string): Promise<string | null> {
    const usuario = await this.buscarPorEmail(email);
    
    if (!usuario) {
      return null;
    }
    
    // Gerar token aleatório
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Data de expiração (1 hora a partir de agora)
    const dataExpiracao = new Date();
    dataExpiracao.setHours(dataExpiracao.getHours() + 1);
    
    const sql = `
      INSERT INTO reset_senha (usuario_id, token, data_expiracao)
      VALUES (?, ?, ?)
    `;
    
    await query(sql, [usuario.id, token, dataExpiracao]);
    return token;
  }
  
  /**
   * Altera a senha usando o token de recuperação
   */
  async alterarSenhaPorToken(token: string, novaSenha: string): Promise<boolean> {
    // Primeiro, busca o token válido
    const sqlBusca = `
      SELECT usuario_id 
      FROM reset_senha 
      WHERE token = ? AND data_expiracao > NOW() AND utilizado = false
    `;
    
    const resultToken: any = await query(sqlBusca, [token]);
    
    if (resultToken.length === 0) {
      return false;
    }
    
    const usuarioId = resultToken[0].usuario_id;
    
    // Criptografa a nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    
    // Atualiza a senha do usuário
    const sqlUpdate = `UPDATE usuarios SET senha = ? WHERE id = ?`;
    await query(sqlUpdate, [senhaHash, usuarioId]);
    
    // Marca o token como utilizado
    const sqlToken = `UPDATE reset_senha SET utilizado = true WHERE token = ?`;
    await query(sqlToken, [token]);
    
    return true;
  }
  
  /**
   * Registra o acesso do usuário
   */
  async registrarAcesso(usuarioId: number, ip: string, dispositivo?: string, navegador?: string): Promise<void> {
    const sql = `
      INSERT INTO logs_acesso (usuario_id, ip, dispositivo, navegador)
      VALUES (?, ?, ?, ?)
    `;
    
    await query(sql, [usuarioId, ip, dispositivo, navegador]);
  }
  
  /**
   * Criar uma sessão para o usuário
   */
  async criarSessao(usuarioId: number, ip?: string, dispositivo?: string): Promise<string> {
    // Gerar token de sessão
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Definir data de expiração (30 dias)
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 30);
    
    const sql = `
      INSERT INTO sessoes (usuario_id, token, data_expiracao, ip, dispositivo)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await query(sql, [usuarioId, token, dataExpiracao, ip, dispositivo]);
    return token;
  }
  
  /**
   * Verifica se uma sessão é válida
   */
  async verificarSessao(token: string): Promise<number | null> {
    const sql = `
      SELECT usuario_id 
      FROM sessoes 
      WHERE token = ? AND data_expiracao > NOW()
    `;
    
    const result: any = await query(sql, [token]);
    
    if (result.length === 0) {
      return null;
    }
    
    // Atualiza o último acesso
    await query(`UPDATE sessoes SET ultimo_acesso = NOW() WHERE token = ?`, [token]);
    
    return result[0].usuario_id;
  }
  
  /**
   * Encerra uma sessão
   */
  async encerrarSessao(token: string): Promise<boolean> {
    const sql = `DELETE FROM sessoes WHERE token = ?`;
    const result: any = await query(sql, [token]);
    return result.affectedRows > 0;
  }
}

export default new UsuarioModel(); 