import { NextResponse } from 'next/server';
import { testConnection } from '@/database';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Testa a conexão com o Supabase
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Falha na conexão com o Supabase' },
        { status: 500 }
      );
    }
    
    // Obtém a lista de tabelas do Supabase
    try {
      // Usando o RPC para obter tabelas no Supabase
      const { data, error } = await supabase.rpc('get_tables');
      
      // Se o RPC não existe, tenta um método alternativo
      if (error && error.code === 'PGRST301') {
        // Tentar listar pelo menos as tabelas que sabemos que existem
        const { data: tables } = await supabase.from('usuarios').select('id').limit(0).then(() => {
          return { data: [{ name: 'usuarios' }] };
        }).catch(() => {
          return { data: [] };
        });
        
        return NextResponse.json({
          status: 'success',
          message: 'Conexão com o Supabase está funcionando',
          tables
        });
      }
      
      if (error) {
        return NextResponse.json({
          status: 'warning',
          message: 'Conexão estabelecida, mas ocorreu um erro ao listar tabelas',
          error: error.message
        });
      }
      
      const tables = Array.isArray(data) ? data : [];
      
      return NextResponse.json({
        status: 'success',
        message: 'Conexão com o Supabase está funcionando',
        tables
      });
    } catch (error: any) {
      // Se ocorrer um erro ao listar tabelas, ainda assim a conexão foi bem-sucedida
      return NextResponse.json({
        status: 'partial_success',
        message: 'Conexão com o Supabase estabelecida, mas não foi possível listar tabelas',
        error: error.message
      });
    }
  } catch (error: any) {
    console.error('Erro ao testar conexão:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Erro ao conectar ao Supabase',
        error: error.message
      },
      { status: 500 }
    );
  }
} 