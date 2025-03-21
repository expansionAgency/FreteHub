import { query, testConnection } from './config';
import Models from './models';

// Exporta as funções de configuração do banco
export { query, testConnection };

// Exporta os modelos
export { Models };
export * from './models';

// Função para inicializar a conexão com o banco de dados
export const initDatabase = async (): Promise<boolean> => {
  try {
    await testConnection();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    return false;
  }
}; 