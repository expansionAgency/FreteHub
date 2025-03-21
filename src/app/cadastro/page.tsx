'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Definindo o schema de validação para o formulário
const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string(),
  tipoUsuario: z.enum(['embarcador', 'transportador']),
  telefone: z.string().min(10, 'Telefone inválido'),
  documento: z.string().min(11, 'Documento inválido'),
  concordaTermos: z.boolean().refine(val => val === true, {
    message: 'Você deve concordar com os termos de uso',
  }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type FormValues = z.infer<typeof cadastroSchema>;

export default function Cadastro() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Obter o tipo de usuário da URL e definir como padrão
  const tipoUsuarioParam = searchParams.get('tipo');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      tipoUsuario: (tipoUsuarioParam === 'embarcador' || tipoUsuarioParam === 'transportador') 
        ? tipoUsuarioParam 
        : 'embarcador',
    }
  });

  // Definir o tipo de usuário com base no parâmetro da URL
  useEffect(() => {
    if (tipoUsuarioParam === 'embarcador' || tipoUsuarioParam === 'transportador') {
      setValue('tipoUsuario', tipoUsuarioParam);
    }
  }, [tipoUsuarioParam, setValue]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      // Aqui seria a chamada para a API de cadastro
      console.log('Dados para cadastro:', data);
      
      // Simulando um atraso na resposta da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirecionar para a página de sucesso ou dashboard
      router.push('/cadastro/sucesso');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
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
              <h1 className="text-2xl font-bold text-primary">Crie sua conta</h1>
              <p className="mt-2 text-secondary">
                Comece a usar o FreteHub gratuitamente
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Seleção de tipo de usuário */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Eu sou:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="embarcador"
                      {...register('tipoUsuario')}
                      className="h-4 w-4 text-primary border-secondary/30 focus:ring-primary"
                    />
                    <span className="ml-2 text-secondary">Embarcador</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="transportador"
                      {...register('tipoUsuario')}
                      className="h-4 w-4 text-primary border-secondary/30 focus:ring-primary"
                    />
                    <span className="ml-2 text-secondary">Transportador</span>
                  </label>
                </div>
              </div>
              
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-secondary mb-1">
                  Nome completo
                </label>
                <input
                  id="nome"
                  {...register('nome')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-secondary ${
                    errors.nome ? 'border-red-500' : 'border-secondary/30'
                  }`}
                />
                {errors.nome && (
                  <p className="mt-1 text-xs text-red-500">{errors.nome.message}</p>
                )}
              </div>

              {/* Email */}
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
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-secondary mb-1">
                  Telefone
                </label>
                <input
                  id="telefone"
                  {...register('telefone')}
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-secondary ${
                    errors.telefone ? 'border-red-500' : 'border-secondary/30'
                  }`}
                  placeholder="(00) 00000-0000"
                />
                {errors.telefone && (
                  <p className="mt-1 text-xs text-red-500">{errors.telefone.message}</p>
                )}
              </div>

              {/* Documento (CPF/CNPJ) */}
              <div>
                <label htmlFor="documento" className="block text-sm font-medium text-secondary mb-1">
                  CPF/CNPJ
                </label>
                <input
                  id="documento"
                  {...register('documento')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-secondary ${
                    errors.documento ? 'border-red-500' : 'border-secondary/30'
                  }`}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
                {errors.documento && (
                  <p className="mt-1 text-xs text-red-500">{errors.documento.message}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-secondary mb-1">
                  Senha
                </label>
                <input
                  id="senha"
                  {...register('senha')}
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-secondary ${
                    errors.senha ? 'border-red-500' : 'border-secondary/30'
                  }`}
                />
                {errors.senha && (
                  <p className="mt-1 text-xs text-red-500">{errors.senha.message}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-secondary mb-1">
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  {...register('confirmarSenha')}
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md bg-background text-secondary ${
                    errors.confirmarSenha ? 'border-red-500' : 'border-secondary/30'
                  }`}
                />
                {errors.confirmarSenha && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmarSenha.message}</p>
                )}
              </div>

              {/* Termos de uso */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="concordaTermos"
                    {...register('concordaTermos')}
                    type="checkbox"
                    className="h-4 w-4 text-primary border-secondary/30 rounded bg-background"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="concordaTermos" className="text-secondary">
                    Concordo com os <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link> e <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
                  </label>
                  {errors.concordaTermos && (
                    <p className="mt-1 text-xs text-red-500">{errors.concordaTermos.message}</p>
                  )}
                </div>
              </div>

              {/* Botão de cadastro */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? 'Cadastrando...' : 'Criar conta'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                Já tem uma conta?{' '}
                <Link href="/entrar" className="text-primary hover:underline">
                  Entre aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 