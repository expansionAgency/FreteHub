'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CadastroSucesso() {
  const router = useRouter();

  // Redirecionar para login após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/entrar');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="text-2xl font-bold text-primary">
            FreteHub
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-md text-center">
          <div className="bg-background p-8 rounded-lg shadow-md border border-secondary/20">
            <div className="mb-6">
              <svg 
                className="mx-auto h-16 w-16 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-primary mb-4">Cadastro realizado com sucesso!</h1>
            
            <p className="text-secondary mb-8">
              Sua conta foi criada com sucesso e já está pronta para uso.
            </p>
            
            <p className="text-secondary mb-6">
              Você será redirecionado para a página de login em alguns segundos...
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/entrar" 
                className="px-6 py-2 bg-primary text-background rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Ir para Login
              </Link>
              <Link 
                href="/" 
                className="px-6 py-2 border border-secondary/30 text-secondary rounded-md font-medium hover:bg-secondary/10 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 