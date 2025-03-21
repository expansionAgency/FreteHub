import { testConnection } from './supabase';

let isInitialized = false;

export const initializeDatabase = async (): Promise<boolean> => {
  if (!isInitialized) {
    isInitialized = await testConnection();
  }
  return isInitialized;
};

// Exporta a função para verificar se o banco de dados está inicializado
export const isDatabaseInitialized = (): boolean => {
  return isInitialized;
}; 