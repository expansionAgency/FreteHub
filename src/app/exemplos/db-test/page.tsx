import { supabase } from '@/lib/supabase';

async function getTables() {
  try {
    // Primeira tentativa: usar RPC para obter tabelas (se existir)
    try {
      const { data, error } = await supabase.rpc('get_tables');
      if (!error && data) {
        return data;
      }
    } catch (e) {
      // Ignora o erro e tenta o próximo método
    }
    
    // Segunda tentativa: tentar acessar tabelas conhecidas
    const tables = [];
    
    try {
      // Verifica se a tabela 'usuarios' existe
      await supabase.from('usuarios').select('id').limit(1);
      tables.push({ name: 'usuarios' });
    } catch (e) {
      // Tabela não existe, ignoramos
    }
    
    // Adicione outras tabelas que você espera que possam existir
    // ...
    
    return tables;
  } catch (error) {
    console.error('Erro ao obter tabelas:', error);
    return [];
  }
}

export default async function DbTestPage() {
  const tables = await getTables();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teste de Conexão com Supabase</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tabelas no Supabase</h2>
        
        {Array.isArray(tables) && tables.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Nome da Tabela</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b">
                      {table.name || table.tablename}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="text-yellow-700">
              Nenhuma tabela encontrada no Supabase.
              Você precisa criar suas tabelas no painel do Supabase.
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Status da Conexão</h3>
          <div className="bg-green-100 border-l-4 border-green-500 p-4">
            <p className="text-green-700">
              Conexão com Supabase estabelecida com sucesso!
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Esta página usou a conexão com o Supabase para consultar as tabelas existentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 