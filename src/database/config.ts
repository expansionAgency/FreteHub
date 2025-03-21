import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fretehub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Criação do pool de conexões
const pool = mysql.createPool(dbConfig);

/**
 * Executa uma consulta SQL com parâmetros
 * @param sql Consulta SQL a ser executada
 * @param params Parâmetros para a consulta (opcional)
 * @returns Resultado da consulta
 */
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    throw error;
  }
}

/**
 * Verifica a conexão com o banco de dados
 * @returns true se a conexão for bem-sucedida
 */
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
}

export default { query, testConnection }; 