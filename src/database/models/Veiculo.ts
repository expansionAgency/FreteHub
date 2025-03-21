import { query } from '../config';

export interface IVeiculo {
  id?: number;
  transportador_id: number;
  placa: string;
  renavam?: string;
  tipo: 'caminhao' | 'carreta' | 'van' | 'outro';
  marca: string;
  modelo: string;
  ano: number;
  capacidade_kg?: number;
  capacidade_m3?: number;
  tipo_carroceria?: string;
  rastreado: boolean;
  seguro_carga: boolean;
  observacoes?: string;
  ativo: boolean;
}

class VeiculoModel {
  /**
   * Cria um novo veículo para um transportador
   */
  async criar(veiculo: IVeiculo): Promise<number> {
    const sql = `
      INSERT INTO veiculos (
        transportador_id, placa, renavam, tipo, marca, modelo, ano,
        capacidade_kg, capacidade_m3, tipo_carroceria, rastreado,
        seguro_carga, observacoes, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      veiculo.transportador_id,
      veiculo.placa,
      veiculo.renavam || null,
      veiculo.tipo,
      veiculo.marca,
      veiculo.modelo,
      veiculo.ano,
      veiculo.capacidade_kg || null,
      veiculo.capacidade_m3 || null,
      veiculo.tipo_carroceria || null,
      veiculo.rastreado || false,
      veiculo.seguro_carga || false,
      veiculo.observacoes || null,
      veiculo.ativo !== undefined ? veiculo.ativo : true
    ];
    
    try {
      const result: any = await query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  }
  
  /**
   * Busca um veículo pelo ID
   */
  async buscarPorId(id: number): Promise<IVeiculo | null> {
    const sql = `SELECT * FROM veiculos WHERE id = ?`;
    const result: any = await query(sql, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0];
  }
  
  /**
   * Busca veículos por transportador
   */
  async buscarPorTransportador(transportadorId: number): Promise<IVeiculo[]> {
    const sql = `SELECT * FROM veiculos WHERE transportador_id = ? AND ativo = true`;
    const result: any = await query(sql, [transportadorId]);
    
    return result;
  }
  
  /**
   * Atualiza os dados de um veículo
   */
  async atualizar(id: number, dados: Partial<IVeiculo>): Promise<boolean> {
    // Remove o ID de transportador para não ser alterado
    delete dados.transportador_id;
    
    if (Object.keys(dados).length === 0) {
      return false; // Nenhum dado para atualizar
    }
    
    const campos = Object.keys(dados)
      .map(campo => `${campo} = ?`)
      .join(', ');
    
    const valores = Object.values(dados);
    valores.push(id);
    
    const sql = `UPDATE veiculos SET ${campos} WHERE id = ?`;
    
    const result: any = await query(sql, valores);
    return result.affectedRows > 0;
  }
  
  /**
   * Desativa um veículo (exclusão lógica)
   */
  async desativar(id: number): Promise<boolean> {
    const sql = `UPDATE veiculos SET ativo = false WHERE id = ?`;
    const result: any = await query(sql, [id]);
    return result.affectedRows > 0;
  }
  
  /**
   * Verifica se a placa já está cadastrada
   */
  async placaExiste(placa: string, excluirId?: number): Promise<boolean> {
    let sql = `SELECT 1 FROM veiculos WHERE placa = ?`;
    const params: any[] = [placa];
    
    if (excluirId) {
      sql += ` AND id != ?`;
      params.push(excluirId);
    }
    
    const result: any = await query(sql, params);
    return result.length > 0;
  }
  
  /**
   * Lista veículos com paginação e filtros
   */
  async listar(
    pagina: number = 1, 
    limite: number = 20, 
    filtros: Partial<{ 
      transportador_id: number, 
      tipo: string, 
      marca: string,
      ano_minimo: number,
      capacidade_minima: number,
      apenas_ativos: boolean 
    }> = {}
  ): Promise<{ veiculos: IVeiculo[], total: number }> {
    const offset = (pagina - 1) * limite;
    
    let where = '';
    const params: any[] = [];
    
    if (filtros.transportador_id) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'transportador_id = ?';
      params.push(filtros.transportador_id);
    }
    
    if (filtros.tipo) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'tipo = ?';
      params.push(filtros.tipo);
    }
    
    if (filtros.marca) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'marca = ?';
      params.push(filtros.marca);
    }
    
    if (filtros.ano_minimo) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'ano >= ?';
      params.push(filtros.ano_minimo);
    }
    
    if (filtros.capacidade_minima) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'capacidade_kg >= ?';
      params.push(filtros.capacidade_minima);
    }
    
    // Por padrão, lista apenas veículos ativos
    if (filtros.apenas_ativos !== false) {
      where += where ? ' AND ' : ' WHERE ';
      where += 'ativo = true';
    }
    
    const sqlCount = `SELECT COUNT(*) as total FROM veiculos${where}`;
    const sqlQuery = `
      SELECT * FROM veiculos${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limite, offset);
    
    const [countResult, veiculos]: any = await Promise.all([
      query(sqlCount, params.slice(0, -2)), // Remove os parâmetros de LIMIT e OFFSET
      query(sqlQuery, params)
    ]);
    
    return {
      veiculos,
      total: countResult[0].total
    };
  }
}

export default new VeiculoModel(); 