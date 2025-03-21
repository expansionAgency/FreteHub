import { createClient } from '@supabase/supabase-js';

// Acesso direto às variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Verificação básica de configuração
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY devem ser configuradas');
}

// Cria o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Testa a conexão com o Supabase
 * @returns true se a conexão for bem-sucedida
 */
export async function testConnection() {
  try {
    // Uma forma mais confiável de testar a conexão é usar a API de health check
    const { data, error } = await supabase.rpc('get_service_status').maybeSingle();
    
    if (error) {
      // Se o RPC não existir, tente uma abordagem alternativa simples
      // Apenas verificar se conseguimos fazer uma consulta qualquer
      const { error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('❌ Erro ao testar conexão com Supabase:', authError);
        return false;
      }
      
      console.log('✅ Conexão com Supabase estabelecida com sucesso (via auth check)');
      return true;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error);
    return false;
  }
}

export default supabase; 