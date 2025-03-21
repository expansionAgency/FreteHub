"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { formatarPreco, formatarData, obterStatusFrete } from "@/lib/utils"
import Link from 'next/link'

// Dados simulados
const cargas = [
  {
    id: '1',
    titulo: 'Equipamentos Eletrônicos',
    origem: 'São Paulo, SP',
    destino: 'Rio de Janeiro, RJ',
    data: '2025-04-15',
    status: 'aguardando',
    propostas: 3,
    valor: 2500
  },
  {
    id: '2',
    titulo: 'Materiais de Construção',
    origem: 'Curitiba, PR',
    destino: 'Florianópolis, SC',
    data: '2025-04-10',
    status: 'confirmado',
    propostas: 5,
    valor: 1800
  },
  {
    id: '3',
    titulo: 'Produtos Alimentícios',
    origem: 'Belo Horizonte, MG',
    destino: 'Brasília, DF',
    data: '2025-04-05',
    status: 'em_andamento',
    propostas: 4,
    valor: 3200
  },
  {
    id: '4',
    titulo: 'Móveis Residenciais',
    origem: 'Salvador, BA',
    destino: 'Recife, PE',
    data: '2025-03-25',
    status: 'finalizado',
    propostas: 6,
    valor: 2100
  }
]

const transacoes = [
  {
    id: '1',
    data: '2025-03-20',
    tipo: 'pagamento',
    valor: 1250,
    descricao: 'Pagamento pelo frete #1220',
    status: 'concluido'
  },
  {
    id: '2',
    data: '2025-03-15',
    tipo: 'taxa',
    valor: 125,
    descricao: 'Taxa de serviço - frete #1220',
    status: 'concluido'
  },
  {
    id: '3',
    data: '2025-03-10',
    tipo: 'pagamento',
    valor: 3500,
    descricao: 'Adiantamento pelo frete #1235',
    status: 'concluido'
  },
  {
    id: '4',
    data: '2025-03-05',
    tipo: 'taxa',
    valor: 350,
    descricao: 'Taxa de serviço - frete #1235',
    status: 'concluido'
  }
]

export function EmbarcadorDashboard() {
  const [formData, setFormData] = useState({
    titulo: '',
    origem: '',
    destino: '',
    data: '',
    tipoCarga: 'geral',
    peso: '',
    volume: '',
    valor: ''
  })
  
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Verificar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
    // Aqui seria feita a chamada à API para publicar a carga
    alert('Carga publicada com sucesso!')
    setFormData({
      titulo: '',
      origem: '',
      destino: '',
      data: '',
      tipoCarga: 'geral',
      peso: '',
      volume: '',
      valor: ''
    })
  }

  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        {/* Cards de métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Cargas Ativas</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">3</div>
            <p className="text-sm text-[#ebebeb]/80">+1 desde o mês passado</p>
          </div>
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Propostas Recebidas</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">12</div>
            <p className="text-sm text-[#ebebeb]/80">3 novas nas últimas 24h</p>
          </div>
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Economia Estimada</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">15%</div>
            <p className="text-sm text-[#ebebeb]/80">Comparado com o mercado</p>
          </div>
          <div className="bg-gradient-to-br from-[#333333] to-[#3a3a3a] p-6 rounded-lg shadow-md border border-[#444444] transition-transform hover:scale-105">
            <h3 className="text-lg font-medium text-[#f28c28]">Transportadoras Parceiras</h3>
            <div className="mt-2 text-3xl font-bold text-[#ebebeb]">8</div>
            <p className="text-sm text-[#ebebeb]/80">+2 desde o mês passado</p>
          </div>
        </div>

        {/* Seção principal - cargas e transações */}
        <div className="grid gap-6 md:grid-cols-7">
          {/* Cargas recentes */}
          <div className="md:col-span-4 bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-[#f28c28] rounded-full"></div>
                <h3 className="text-lg font-medium text-[#f28c28]">Minhas Cargas</h3>
              </div>
              <Link href="/dashboard/cargas" className="text-sm text-[#f28c28] hover:text-[#f28c28]/80 hover:underline flex items-center">
                Ver todas
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#444444] bg-[#3a3a3a]/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Título</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Origem/Destino</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Propostas</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cargas.map((carga) => {
                    const { label, color } = obterStatusFrete(carga.status)
                    return (
                      <tr key={carga.id} className="border-b border-[#444444] hover:bg-[#3a3a3a] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-[#ebebeb]">{carga.titulo}</div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <div className="text-[#ebebeb]">{carga.origem}</div>
                          <div className="text-[#f28c28]/60 text-xs">para</div>
                          <div className="text-[#ebebeb]">{carga.destino}</div>
                        </td>
                        <td className="py-4 px-4 text-sm text-[#ebebeb]">{formatarData(carga.data)}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                            {label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {carga.status === 'aguardando' ? (
                            <Link href={`/dashboard/cargas/${carga.id}/propostas`} className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline">
                              {carga.propostas}
                            </Link>
                          ) : (
                            <span className="text-[#ebebeb]/60">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-medium text-[#ebebeb]">{formatarPreco(carga.valor)}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Link 
                              href={`/dashboard/cargas/${carga.id}`}
                              className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline text-sm"
                            >
                              Detalhes
                            </Link>
                            {carga.status === 'aguardando' && (
                              <button className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline text-sm">
                                Editar
                              </button>
                            )}
                            {carga.status === 'finalizado' && (
                              <button className="text-green-500 hover:text-green-500/80 hover:underline text-sm">
                                Avaliar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transações recentes */}
          <div className="md:col-span-3 bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-[#f28c28] rounded-full"></div>
                <h3 className="text-lg font-medium text-[#f28c28]">Transações Recentes</h3>
              </div>
              <Link href="/dashboard/financeiro" className="text-sm text-[#f28c28] hover:text-[#f28c28]/80 hover:underline flex items-center">
                Ver todas
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="space-y-3 mt-4">
              {transacoes.slice(0, 4).map((transacao) => (
                <div 
                  key={transacao.id} 
                  className="flex items-center justify-between p-4 border border-[#444444] rounded-md hover:bg-[#3a3a3a] transition-colors shadow-sm"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 flex-shrink-0 rounded-full p-2 ${
                      transacao.tipo === 'pagamento' ? 'bg-[#f28c28]/20' : 'bg-red-500/20'
                    }`}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 ${transacao.tipo === 'pagamento' ? 'text-[#f28c28]' : 'text-red-500'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        {transacao.tipo === 'pagamento' 
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        }
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-[#ebebeb]">{transacao.descricao}</div>
                      <div className="text-sm text-[#f28c28]/80">{formatarData(transacao.data)}</div>
                    </div>
                  </div>
                  <div className={`font-medium ${transacao.tipo === 'taxa' ? 'text-red-500' : 'text-[#f28c28]'}`}>
                    {transacao.tipo === 'pagamento' ? '-' : ''}{formatarPreco(transacao.valor)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#444444]">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#f28c28]">Balanço do mês</span>
                <span className="font-bold text-green-500">{formatarPreco(4275)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráfico e informações adicionais */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444]">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-[#f28c28] rounded-full"></div>
              <h3 className="text-lg font-medium text-[#f28c28]">Atividade Mensal</h3>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-[#ebebeb]/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#f28c28]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="mt-2">Gráfico de atividades mensais</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444]">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-[#f28c28] rounded-full"></div>
              <h3 className="text-lg font-medium text-[#f28c28]">Transportadoras Recomendadas</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 border border-[#444444] rounded-md hover:bg-[#3a3a3a] transition-colors">
                <div className="font-medium text-[#ebebeb]">Transportes Rápidos Ltda.</div>
                <div className="text-sm text-[#f28c28] mt-1">Avaliação: 4.8/5</div>
              </div>
              <div className="p-3 border border-[#444444] rounded-md hover:bg-[#3a3a3a] transition-colors">
                <div className="font-medium text-[#ebebeb]">Logística Segura S/A</div>
                <div className="text-sm text-[#f28c28] mt-1">Avaliação: 4.7/5</div>
              </div>
              <div className="p-3 border border-[#444444] rounded-md hover:bg-[#3a3a3a] transition-colors">
                <div className="font-medium text-[#ebebeb]">Express Cargas Brasil</div>
                <div className="text-sm text-[#f28c28] mt-1">Avaliação: 4.6/5</div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cargas" className="space-y-6">
        <div className="bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] text-[#ebebeb]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-[#f28c28] rounded-full"></div>
              <h3 className="text-xl font-medium text-[#f28c28]">Minhas Cargas</h3>
            </div>
            <Link 
              href="/dashboard?tab=nova-carga" 
              className="px-4 py-2 bg-[#f28c28] text-[#292929] rounded-md text-sm font-medium hover:bg-[#f28c28]/90 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nova Carga
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#444444] bg-[#3a3a3a]/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Título</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Origem/Destino</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Propostas</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#f28c28]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {cargas.map((carga) => {
                  const { label, color } = obterStatusFrete(carga.status)
                  return (
                    <tr key={carga.id} className="border-b border-[#444444] hover:bg-[#3a3a3a] transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#ebebeb]">{carga.titulo}</div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="text-[#ebebeb]">{carga.origem}</div>
                        <div className="text-[#f28c28]/60 text-xs">para</div>
                        <div className="text-[#ebebeb]">{carga.destino}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#ebebeb]">{formatarData(carga.data)}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                          {label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {carga.status === 'aguardando' ? (
                          <Link href={`/dashboard/cargas/${carga.id}/propostas`} className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline">
                            {carga.propostas}
                          </Link>
                        ) : (
                          <span className="text-[#ebebeb]/60">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-medium text-[#ebebeb]">{formatarPreco(carga.valor)}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/dashboard/cargas/${carga.id}`}
                            className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline text-sm"
                          >
                            Detalhes
                          </Link>
                          {carga.status === 'aguardando' && (
                            <button className="text-[#f28c28] hover:text-[#f28c28]/80 hover:underline text-sm">
                              Editar
                            </button>
                          )}
                          {carga.status === 'finalizado' && (
                            <button className="text-green-500 hover:text-green-500/80 hover:underline text-sm">
                              Avaliar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="nova-carga" className="space-y-6">
        <div className="bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] text-[#ebebeb]">
          <h3 className="text-xl font-medium mb-6 text-[#f28c28]">Publicar Nova Carga</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Carga
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: Equipamentos Eletrônicos"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="tipoCarga" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Carga
                </label>
                <select
                  id="tipoCarga"
                  name="tipoCarga"
                  value={formData.tipoCarga}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="geral">Carga Geral</option>
                  <option value="granel">Granel</option>
                  <option value="frigorificada">Frigorificada</option>
                  <option value="perigosa">Perigosa</option>
                  <option value="veiculos">Veículos</option>
                  <option value="mudanca">Mudança</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="origem" className="block text-sm font-medium text-gray-700 mb-1">
                  Origem
                </label>
                <input
                  type="text"
                  id="origem"
                  name="origem"
                  value={formData.origem}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: São Paulo, SP"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="destino" className="block text-sm font-medium text-gray-700 mb-1">
                  Destino
                </label>
                <input
                  type="text"
                  id="destino"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: Rio de Janeiro, RJ"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Retirada
                </label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Estimado (R$)
                </label>
                <input
                  type="number"
                  id="valor"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: 2500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: 1500"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                  Volume (m³)
                </label>
                <input
                  type="number"
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: 10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Detalhada
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Descreva detalhes sobre a carga, requisitos especiais, etc."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Publicar Carga
              </button>
            </div>
          </form>
        </div>
      </TabsContent>

      <TabsContent value="transacoes" className="space-y-6">
        <div className="bg-[#333333] p-6 rounded-lg shadow-md border border-[#444444] text-[#ebebeb]">
          <h3 className="text-xl font-medium mb-6 text-[#f28c28]">Histórico Financeiro</h3>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 border border-[#444444] rounded-md bg-gradient-to-b from-[#333333] to-[#3a3a3a]">
              <h4 className="text-sm font-medium text-[#f28c28]">Total Pago</h4>
              <div className="mt-1 text-2xl font-bold text-[#ebebeb]">{formatarPreco(9850)}</div>
            </div>
            <div className="p-4 border border-[#444444] rounded-md bg-gradient-to-b from-[#333333] to-[#3a3a3a]">
              <h4 className="text-sm font-medium text-[#f28c28]">Taxas do Serviço</h4>
              <div className="mt-1 text-2xl font-bold text-[#ebebeb]">{formatarPreco(985)}</div>
            </div>
            <div className="p-4 border border-[#444444] rounded-md bg-gradient-to-b from-[#333333] to-[#3a3a3a]">
              <h4 className="text-sm font-medium text-[#f28c28]">Fretes Realizados</h4>
              <div className="mt-1 text-2xl font-bold text-[#ebebeb]">12</div>
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
                        transacao.tipo === 'pagamento' 
                          ? 'bg-[#f28c28]/20 text-[#f28c28]' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {transacao.tipo === 'pagamento' ? 'Pagamento' : 'Taxa de serviço'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span className={transacao.tipo === 'pagamento' ? 'text-[#f28c28]' : 'text-red-500'}>
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
          <h3 className="text-xl font-medium mb-6 text-[#f28c28]">Perfil da Empresa</h3>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/placeholder-company.jpg" 
                    alt="Logo da empresa" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/150?text=Empresa';
                    }}
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mb-4">
                  Alterar logo
                </button>
                
                <div className="w-full p-4 border rounded-md">
                  <h4 className="font-medium text-center mb-2">Status da Conta</h4>
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Verificado</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      id="nomeEmpresa"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="Empresa ABC Ltda."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      id="cnpj"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="12.345.678/0001-90"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="contato@empresaabc.com.br"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="(11) 3333-4444"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      id="endereco"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="Av. Paulista, 1000"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade/UF
                    </label>
                    <input
                      type="text"
                      id="cidade"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="São Paulo, SP"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="sobre" className="block text-sm font-medium text-gray-700 mb-1">
                      Sobre a Empresa
                    </label>
                    <textarea
                      id="sobre"
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="Empresa especializada no comércio de produtos eletrônicos com sede em São Paulo e atendimento em todo o Brasil."
                    ></textarea>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium mt-6 mb-4">Informações de Contato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      id="responsavel"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="João Silva"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      id="cargo"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="Gerente de Logística"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="emailResponsavel" className="block text-sm font-medium text-gray-700 mb-1">
                      Email do Responsável
                    </label>
                    <input
                      type="email"
                      id="emailResponsavel"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="joao.silva@empresaabc.com.br"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefoneResponsavel" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone do Responsável
                    </label>
                    <input
                      type="tel"
                      id="telefoneResponsavel"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="(11) 98765-4321"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
              
              <div className="mt-8 pt-8 border-t">
                <h4 className="text-lg font-medium mb-4">Segurança</h4>
                <div className="space-y-4">
                  <button className="text-primary hover:underline text-sm">
                    Alterar senha
                  </button>
                  <button className="text-primary hover:underline text-sm">
                    Configurar autenticação em dois fatores
                  </button>
                  <button className="text-red-600 hover:underline text-sm">
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