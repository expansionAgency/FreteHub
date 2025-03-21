import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { testConnection } from '@/lib/supabase';

// Esta função será executada a cada requisição
export async function middleware(request: NextRequest) {
  // O Edge Runtime não suporta operações de logging complexas
  // Vamos simplesmente testar a conexão e continuar
  try {
    await testConnection();
  } catch (error) {
    // Silenciamos o erro para não afetar a experiência do usuário
    console.error('Erro ao conectar ao Supabase no middleware:', error);
  }
  
  // Continua com a requisição normalmente
  return NextResponse.next();
}

// Configuração para executar o middleware em todas as rotas
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}; 