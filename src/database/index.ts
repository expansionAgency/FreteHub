import { supabase, testConnection } from '@/lib/supabase';
import Models from './models';

// Re-exporta os modelos
export { Models };
export * from './models';

// Re-exporta funções do Supabase
export { testConnection };

/**
 * Executa uma consulta no Supabase
 * @param table Nome da tabela
 * @param queryBuilder Função que recebe um objeto de consulta e modifica-o
 * @returns Resultado da consulta
 */
export async function query(table: string, queryBuilder?: (query: any) => any) {
  let queryObj = supabase.from(table).select();
  
  if (queryBuilder) {
    queryObj = queryBuilder(queryObj);
  }
  
  const { data, error } = await queryObj;
  
  if (error) {
    console.error(`Erro ao consultar tabela ${table}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Insere um ou mais registros em uma tabela
 * @param table Nome da tabela
 * @param values Valores a serem inseridos
 * @returns Registros inseridos
 */
export async function insert(table: string, values: any | any[]) {
  const { data, error } = await supabase.from(table).insert(values).select();
  
  if (error) {
    console.error(`Erro ao inserir na tabela ${table}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Atualiza registros em uma tabela
 * @param table Nome da tabela
 * @param values Valores a serem atualizados
 * @param conditions Objeto com condições para o filtro where
 * @returns Registros atualizados
 */
export async function update(table: string, values: any, conditions: any) {
  let queryObj = supabase.from(table).update(values);
  
  // Aplica as condições
  Object.entries(conditions).forEach(([column, value]) => {
    queryObj = queryObj.eq(column, value);
  });
  
  const { data, error } = await queryObj.select();
  
  if (error) {
    console.error(`Erro ao atualizar tabela ${table}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Remove registros de uma tabela
 * @param table Nome da tabela
 * @param conditions Objeto com condições para o filtro where
 * @returns Resultado da operação
 */
export async function remove(table: string, conditions: any) {
  let queryObj = supabase.from(table).delete();
  
  // Aplica as condições
  Object.entries(conditions).forEach(([column, value]) => {
    queryObj = queryObj.eq(column, value);
  });
  
  const { data, error } = await queryObj.select();
  
  if (error) {
    console.error(`Erro ao remover da tabela ${table}:`, error);
    throw error;
  }
  
  return data;
}

// Função para inicializar a conexão com o banco de dados (mantida para compatibilidade)
export const initDatabase = testConnection;

// Exporta as funções
export default {
  query,
  insert,
  update,
  remove,
  testConnection,
}; 