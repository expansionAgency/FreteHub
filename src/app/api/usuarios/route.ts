import { NextResponse } from 'next/server';
import { query } from '@/database';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Tenta obter a lista de usuários do Supabase
    try {
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .limit(10);
      
      if (error) {
        // Verifica se o erro é relacionado à tabela não existente
        if (error.code === 'PGRST116') {
          return NextResponse.json({
            status: 'warning',
            message: 'A tabela de usuários não existe. Você precisa criá-la no Supabase.',
            error: error.message
          });
        }
        
        // Outros erros
        return NextResponse.json({
          status: 'error',
          message: 'Erro ao consultar usuários',
          error: error.message
        }, { status: 500 });
      }
      
      return NextResponse.json({
        status: 'success',
        usuarios
      });
    } catch (error: any) {
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao consultar usuários',
        error: error.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erro ao acessar Supabase:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Erro interno do servidor',
        error: error.message
      },
      { status: 500 }
    );
  }
} 