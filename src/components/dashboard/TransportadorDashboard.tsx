"use client"

import { useState } from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { formatarPreco, formatarData, formatarDistancia, obterStatusFrete } from "@/lib/utils"
import Link from 'next/link'

// Dados simulados
const cargasDisponiveis = [
  {
    id: '1',
    titulo: 'Mudança residencial',
    origem: 'São Paulo, SP',
    destino: 'Rio de Janeiro, RJ',
    data: '2025-04-15',
    distancia: 430.5,
    valor: 2500
  },
  {
    id: '2',
    titulo: 'Carga de eletrônicos',
    origem: 'Curitiba, PR',
    destino: 'Florianópolis, SC',
    data: '2025-04-10',
    distancia: 300.2,
    valor: 1800
  },
  {
    id: '3',
    titulo: 'Materiais de construção',
    origem: 'Belo Horizonte, MG',
    destino: 'Brasília, DF',
    data: '2025-04-05',
    distancia: 716.3,
    valor: 3200
  },
  {
    id: '4',
    titulo: 'Produtos alimentícios',
    origem: 'Salvador, BA',
    destino: 'Recife, PE',
    data: '2025-03-25',
    distancia: 675.8,
    valor: 2100
  }
]

const meusFretes = [
  {
    id: '1',
    titulo: 'Transporte de móveis',
    origem: 'Porto Alegre, RS',
    destino: 'Caxias do Sul, RS',
    data: '2025-04-02',
    distancia: 127.8,
    status: 'confirmado',
    valor: 950
  },
  {
    id: '2',
    titulo: 'Carga de roupas',
    origem: 'São Paulo, SP',
    destino: 'Campinas, SP',
    data: '2025-03-28',
    distancia: 99.4,
    status: 'em_andamento',
    valor: 750
  },
  {
    id: '3',
    titulo: 'Produtos de informática',
    origem: 'Rio de Janeiro, RJ',
    destino: 'Niterói, RJ',
    data: '2025-03-20',
    distancia: 13.2,
    status: 'finalizado',
    valor: 350
  }
]

const transacoes = [
  {
    id: '1',
    data: '2025-03-20',
    tipo: 'recebimento',
    valor: 350,
    descricao: 'Pagamento pelo frete #1220',
    status: 'concluido'
  },
  {
    id: '2',
    data: '2025-03-15',
    tipo: 'taxa',
    valor: 35,
    descricao: 'Taxa de serviço - frete #1220',
    status: 'concluido'
  },
  {
    id: '3',
    data: '2025-03-10',
    tipo: 'recebimento',
    valor: 750,
    descricao: 'Pagamento adiantado pelo frete #1235',
    status: 'concluido'
  },
  {
    id: '4',
    data: '2025-03-05',
    tipo: 'taxa',
    valor: 75,
    descricao: 'Taxa de serviço - frete #1235',
    status: 'concluido'
  }
]

export function TransportadorDashboard() {
  const [filtroDistancia, setFiltroDistancia] = useState('todos')
  const [filtroValor, setFiltroValor] = useState('todos')

  const filtrarCargas = () => {
    let cargasFiltradas = [...cargasDisponiveis]
    
    if (filtroDistancia !== 'todos') {
      if (filtroDistancia === 'menos-100') {
        cargasFiltradas = cargasFiltradas.filter(carga => carga.distancia < 100)
      } else if (filtroDistancia === '100-300') {
        cargasFiltradas = cargasFiltradas.filter(carga => carga.distancia >= 100 && carga.distancia <= 300)
      } else if (filtroDistancia === '300-600') {
        cargasFiltradas = cargasFiltradas.filter(carga => carga.distancia > 300 && carga.distancia <= 600)
      } else if (filtroDistancia === 'mais-600') {
        cargasFiltradas = cargasFiltradas.filter(carga => carga.distancia > 600)
      }
    }
    
    if (filtroValor !== 'todos') {
      if (filtroValor === 'menos-1000') {
        cargasFiltradas = cargasFiltradas.filter(carga => carga.valor < 1000)
      } else if (filtroValor === '1000-2000') {
        cargasFiltradas = cargasFiltradas.filter(carga => carga.valor >= 1000 && carga.valor <= 2000)
      } else if (filtroValor === 'mais-2000') {
        cargasFiltradas = cargasFiltradas.filter(carga => carga.valor > 2000)
      }
    }
    
    return cargasFiltradas
  }

  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Fretes Ativos</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">2</div>
            <p className="text-sm text-[#ebebeb]/80">+1 desde a semana passada</p>
          </div>
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Cargas Disponíveis</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">{cargasDisponiveis.length}</div>
            <p className="text-sm text-[#ebebeb]/80">Atualizadas agora</p>
          </div>
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Receita do Mês</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">R$ 2.050</div>
            <p className="text-sm text-[#ebebeb]/80">+15% comparado ao mês anterior</p>
          </div>
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Avaliação</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">4.8/5</div>
            <p className="text-sm text-[#ebebeb]/80">Baseado em 24 avaliações</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <div className="md:col-span-4 bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#f28c28]">Meus Fretes</h3>
              <Link href="/dashboard/cargas" className="text-sm text-[#f28c28] hover:text-[#f28c28]/80 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#444444] bg-[#3a3a3a]/50">
                    <th className="text-left py-3 px-2 text-sm font-medium text-[#f28c28]">Título</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[#f28c28]">Origem/Destino</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[#f28c28]">Data</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[#f28c28]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meusFretes.map((frete) => {
                    const { label, color } = obterStatusFrete(frete.status)
                    return (
                      <tr key={frete.id} className="border-b border-[#444444] hover:bg-[#3a3a3a] transition-colors">
                        <td className="py-3 px-2">
                          <Link href={`/dashboard/fretes/${frete.id}`} className="font-medium text-[#f28c28] hover:text-[#f28c28]/80 hover:underline">
                            {frete.titulo}
                          </Link>
                          <div className="text-xs text-[#f28c28]/60">{formatarDistancia(frete.distancia)}</div>
                        </td>
                        <td className="py-3 px-2 text-sm">
                          <div className="text-[#ebebeb]">{frete.origem}</div>
                          <div className="text-[#f28c28]/60">para</div>
                          <div className="text-[#ebebeb]">{frete.destino}</div>
                        </td>
                        <td className="py-3 px-2 text-sm text-[#ebebeb]">{formatarData(frete.data)}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:col-span-3 bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#f28c28]">Transações Recentes</h3>
              <Link href="/dashboard/financeiro" className="text-sm text-[#f28c28] hover:text-[#f28c28]/80 hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {transacoes.slice(0, 4).map((transacao) => (
                <div key={transacao.id} className="flex items-center justify-between p-3 border border-[#444444] rounded-md hover:bg-[#3a3a3a] transition-colors">
                  <div>
                    <div className="font-medium text-[#ebebeb]">{transacao.descricao}</div>
                    <div className="text-sm text-[#f28c28]/80">{formatarData(transacao.data)}</div>
                  </div>
                  <div className={`font-medium ${transacao.tipo === 'taxa' ? 'text-red-500' : 'text-green-500'}`}>
                    {transacao.tipo === 'taxa' ? '-' : '+'}{formatarPreco(transacao.valor)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cargas" className="space-y-6">
        <div className="bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] text-[#ebebeb]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-[#f28c28]">Cargas Disponíveis</h3>
            <div className="flex space-x-4">
              <div>
                <select
                  value={filtroDistancia}
                  onChange={(e) => setFiltroDistancia(e.target.value)}
                  className="px-3 py-1 border border-[#444444] rounded-md text-sm bg-[#3a3a3a] text-[#ebebeb]"
                >
                  <option value="todos">Todas distâncias</option>
                  <option value="menos-100">Menos de 100 km</option>
                  <option value="100-300">Entre 100 e 300 km</option>
                  <option value="300-600">Entre 300 e 600 km</option>
                  <option value="mais-600">Mais de 600 km</option>
                </select>
              </div>
              <div>
                <select
                  value={filtroValor}
                  onChange={(e) => setFiltroValor(e.target.value)}
                  className="px-3 py-1 border border-[#444444] rounded-md text-sm bg-[#3a3a3a] text-[#ebebeb]"
                >
                  <option value="todos">Todos valores</option>
                  <option value="menos-1000">Menos de R$ 1.000</option>
                  <option value="1000-2000">R$ 1.000 a R$ 2.000</option>
                  <option value="mais-2000">Mais de R$ 2.000</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtrarCargas().map((carga) => (
              <div key={carga.id} className="border border-[#444444] rounded-lg p-4 bg-[#3a3a3a] hover:bg-[#444444] transition-colors">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-[#ebebeb]">{carga.titulo}</h4>
                  <span className="text-[#f28c28] font-medium">{formatarPreco(carga.valor)}</span>
                </div>
                <div className="mb-3 text-sm">
                  <div className="flex items-center mb-1">
                    <svg className="h-4 w-4 text-[#f28c28] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[#ebebeb]">{carga.origem}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <svg className="h-4 w-4 text-[#f28c28] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[#ebebeb]">{carga.destino}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-[#f28c28] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[#ebebeb]">{formatarData(carga.data)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-[#f28c28] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-[#ebebeb]">{formatarDistancia(carga.distancia)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <Link 
                    href={`/dashboard/cargas/${carga.id}`} 
                    className="text-sm text-[#f28c28] hover:text-[#f28c28]/80 hover:underline mr-4"
                  >
                    Ver detalhes
                  </Link>
                  <button className="text-sm bg-[#f28c28] text-[#292929] px-3 py-1 rounded-md hover:bg-[#f28c28]/90 ml-auto">
                    Fazer proposta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="transacoes" className="space-y-6">
        <div className="bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] text-[#ebebeb]">
          <h3 className="text-xl font-medium mb-6 text-[#f28c28]">Histórico Financeiro</h3>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 border border-[#444444] rounded-md bg-gradient-to-b from-[#333333] to-[#3a3a3a]">
              <h4 className="text-sm font-medium text-[#f28c28]">Total Recebido</h4>
              <div className="mt-1 text-2xl font-bold text-[#ebebeb]">{formatarPreco(12350)}</div>
            </div>
            <div className="p-4 border border-[#444444] rounded-md bg-gradient-to-b from-[#333333] to-[#3a3a3a]">
              <h4 className="text-sm font-medium text-[#f28c28]">Taxas do Serviço</h4>
              <div className="mt-1 text-2xl font-bold text-[#ebebeb]">{formatarPreco(1235)}</div>
            </div>
            <div className="p-4 border border-[#444444] rounded-md bg-gradient-to-b from-[#333333] to-[#3a3a3a]">
              <h4 className="text-sm font-medium text-[#f28c28]">Fretes Realizados</h4>
              <div className="mt-1 text-2xl font-bold text-[#ebebeb]">8</div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#444444] bg-[#3a3a3a]/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Descrição</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Status</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="border-b border-[#444444] hover:bg-[#3a3a3a] transition-colors">
                    <td className="py-4 px-4 text-sm text-[#ebebeb]">{formatarData(transacao.data)}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#ebebeb]">{transacao.descricao}</div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transacao.tipo === 'recebimento' 
                          ? 'bg-[#f28c28]/20 text-[#f28c28]' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {transacao.tipo === 'recebimento' ? 'Recebimento' : 'Taxa de serviço'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span className={transacao.tipo === 'recebimento' ? 'text-[#f28c28]' : 'text-red-500'}>
                        {formatarPreco(transacao.valor)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                        Concluído
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="perfil" className="space-y-6">
        <div className="bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] text-[#ebebeb]">
          <h3 className="text-xl font-medium mb-6 text-[#f28c28]">Meu Perfil</h3>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 bg-[#3a3a3a] rounded-full overflow-hidden mb-4">
                  <img 
                    src="/placeholder-user.jpg" 
                    alt="Foto de perfil" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/150?text=Usuário';
                    }}
                  />
                </div>
                <button className="px-4 py-2 border border-[#444444] rounded-md text-sm font-medium text-[#ebebeb] hover:bg-[#3a3a3a] mb-4">
                  Alterar foto
                </button>
                
                <div className="w-full p-4 border border-[#444444] rounded-md bg-[#3a3a3a]">
                  <h4 className="font-medium text-center mb-2 text-[#ebebeb]">Status da Conta</h4>
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Verificado</span>
                  </div>
                </div>
                
                <div className="w-full p-4 border border-[#444444] rounded-md bg-[#3a3a3a] mt-4">
                  <h4 className="font-medium text-center mb-2 text-[#ebebeb]">Avaliações</h4>
                  <div className="flex justify-center">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-sm mt-2 text-[#ebebeb]">4.8/5 (24 avaliações)</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="nome"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]"
                      defaultValue="Pedro Oliveira"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]"
                      defaultValue="pedro.oliveira@exemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]"
                      defaultValue="(11) 98888-7777"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="documento" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="documento"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]/50"
                      defaultValue="123.456.789-00"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cnh" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      CNH
                    </label>
                    <input
                      type="text"
                      id="cnh"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]/50"
                      defaultValue="12345678900"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Categoria da CNH
                    </label>
                    <input
                      type="text"
                      id="categoria"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]/50"
                      defaultValue="E"
                      disabled
                    />
                  </div>
                </div>
                
                <h4 className="text-lg font-medium mt-6 mb-4 text-[#f28c28]">Dados do Veículo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="placa" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Placa
                    </label>
                    <input
                      type="text"
                      id="placa"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]"
                      defaultValue="ABC-1234"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="modelo" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Modelo
                    </label>
                    <input
                      type="text"
                      id="modelo"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]"
                      defaultValue="Volvo FH 540"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ano" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Ano
                    </label>
                    <input
                      type="text"
                      id="ano"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]"
                      defaultValue="2020"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="capacidade" className="block text-sm font-medium text-[#ebebeb] mb-1">
                      Capacidade (kg)
                    </label>
                    <input
                      type="text"
                      id="capacidade"
                      className="w-full px-3 py-2 border border-[#444444] rounded-md bg-[#3a3a3a] text-[#ebebeb]"
                      defaultValue="40000"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-[#444444] rounded-md text-sm font-medium text-[#ebebeb] hover:bg-[#3a3a3a]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#f28c28] text-[#292929] rounded-md text-sm font-medium hover:bg-[#f28c28]/90"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
              
              <div className="mt-8 pt-8 border-t border-[#444444]">
                <h4 className="text-lg font-medium mb-4 text-[#f28c28]">Segurança</h4>
                <div className="space-y-4">
                  <button className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline text-sm">
                    Alterar senha
                  </button>
                  <button className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline text-sm">
                    Configurar autenticação em dois fatores
                  </button>
                  <button className="text-red-500 hover:text-red-500/80 hover:underline text-sm">
                    Desativar conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  )
} 