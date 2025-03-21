'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Definindo o schema de validação para o formulário
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
  lembrar: z.boolean().optional(),
});

type FormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      lembrar: false,
    }
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setErro(null);
    
    try {
      // Aqui seria a chamada para a API de login
      console.log('Tentativa de login:', data);
      
      // Simulando um atraso na resposta da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando um login bem-sucedido ou com erro
      const loginSucesso = Math.random() > 0.3; // 70% de chance de sucesso
      
      if (loginSucesso) {
        // Login bem-sucedido - redirecionar para dashboard
        router.push('/dashboard');
      } else {
        // Login falhou
        setErro('Email ou senha incorretos. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErro('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="w-full max-w-md">
          <div className="bg-background p-8 rounded-lg shadow-md border border-secondary/20">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-primary">Entrar</h1>
              <p className="mt-2 text-secondary">
                Acesse sua conta no FreteHub
              </p>
            </div>
            
            {erro && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {erro}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo de email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
                  Email
                </label>
                <input
                  id="email"
                  {...register('email')}
                  type="email"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-secondary ${
                    errors.email ? 'border-red-500' : 'border-secondary/30'
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Campo de senha */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="senha" className="block text-sm font-medium text-secondary">
                    Senha
                  </label>
                  <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <input
                  id="senha"
                  {...register('senha')}
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-secondary ${
                    errors.senha ? 'border-red-500' : 'border-secondary/30'
                  }`}
                  placeholder="******"
                />
                {errors.senha && (
                  <p className="mt-1 text-xs text-red-500">{errors.senha.message}</p>
                )}
              </div>

              {/* Lembrar usuário */}
              <div className="flex items-center">
                <input
                  id="lembrar"
                  type="checkbox"
                  {...register('lembrar')}
                  className="h-4 w-4 text-primary border-secondary/30 rounded bg-background"
                />
                <label htmlFor="lembrar" className="ml-2 block text-sm text-secondary">
                  Lembrar de mim
                </label>
              </div>

              {/* Botão de login */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                Não tem uma conta?{' '}
                <Link href="/cadastro" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 