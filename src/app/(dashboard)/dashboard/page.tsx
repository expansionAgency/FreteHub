"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EmbarcadorDashboard } from "@/components/dashboard/EmbarcadorDashboard"
import { TransportadorDashboard } from "@/components/dashboard/TransportadorDashboard"
import Link from "next/link"

type PerfilUsuario = {
  nome: string
  email: string
  tipo: 'embarcador' | 'transportador'
  empresa: string
  avaliacao: number
  cadastroCompleto: boolean
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || 'overview')
  
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilUsuario>({
    nome: 'Maria Silva',
    email: 'maria@empresa.com.br',
    tipo: 'embarcador',
    empresa: 'Transportes Silva',
    avaliacao: 4.8,
    cadastroCompleto: true
  })

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 768)
  }

  useEffect(() => {
    // Verificar se é mobile na montagem e adicionar listener para resize
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    // Carregar dados do perfil aqui
    // simulação de diferentes tipos de usuário
    if (Math.random() > 0.5) {
      setPerfilUsuario({
        nome: 'João Transportes',
        email: 'joao@transportes.com.br',
        tipo: 'transportador',
        empresa: 'Transportes João LTDA',
        avaliacao: 4.9,
        cadastroCompleto: true
      })
    }

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/dashboard?tab=${value}`)
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#292929] text-[#ebebeb] pb-16">
        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#f28c28]">Dashboard</h1>
            <p className="text-[#ebebeb]/70">Bem-vindo(a), {perfilUsuario.nome}</p>
          </div>

          <div>
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="cargas" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                  Cargas
                </TabsTrigger>
                <TabsTrigger value="transacoes" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                  Financeiro
                </TabsTrigger>
                <TabsTrigger value="perfil" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                  Perfil
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
              
              <TabsContent value="cargas">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
              
              <TabsContent value="transacoes">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
              
              <TabsContent value="perfil">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#292929] text-[#ebebeb]">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <div className="bg-[#333333] rounded-lg shadow-md p-4 border border-[#444444] text-[#ebebeb] mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#f28c28]/20 flex items-center justify-center text-[#f28c28] font-bold text-lg">
                  {perfilUsuario.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{perfilUsuario.nome}</p>
                  <p className="text-sm text-[#ebebeb]/70">{perfilUsuario.empresa}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-[#ebebeb]/70 mb-1">Avaliação</div>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(perfilUsuario.avaliacao) ? 'text-yellow-400' : 'text-[#444444]'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium">{perfilUsuario.avaliacao}/5</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full py-2 px-4 rounded-md bg-[#f28c28] text-[#292929] font-medium hover:bg-[#f28c28]/90 transition-colors">
                  {perfilUsuario.tipo === 'embarcador' ? 'Publicar Carga' : 'Procurar Cargas'}
                </button>
                
                <button className="w-full py-2 px-4 rounded-md border border-[#444444] text-[#ebebeb] font-medium hover:bg-[#3a3a3a] transition-colors">
                  {perfilUsuario.tipo === 'embarcador' ? 'Minhas Cargas' : 'Meus Fretes'}
                </button>
              </div>
            </div>
            
            <div className="bg-[#333333] rounded-lg shadow-md p-4 border border-[#444444] text-[#ebebeb]">
              <h2 className="font-medium mb-3 text-[#f28c28]">Menu Rápido</h2>
              <nav className="space-y-1">
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-[#3a3a3a] transition-colors">Dashboard</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-[#3a3a3a] transition-colors">Mensagens</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-[#3a3a3a] transition-colors">Financeiro</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-[#3a3a3a] transition-colors">Configurações</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-[#3a3a3a] transition-colors">Ajuda</a>
                <a href="#" className="block py-2 px-3 rounded-md text-red-400 hover:bg-[#3a3a3a] transition-colors">Sair</a>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <div className="bg-[#333333] rounded-lg shadow-md p-4 border border-[#444444] text-[#ebebeb] mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-[#f28c28]">Dashboard</h1>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-[#ebebeb]/70">Online</span>
                  </div>
                </div>
                
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger value="cargas" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                    {perfilUsuario.tipo === 'embarcador' ? 'Minhas Cargas' : 'Encontrar Cargas'}
                  </TabsTrigger>
                  <TabsTrigger value="transacoes" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                    Financeiro
                  </TabsTrigger>
                  <TabsTrigger value="perfil" className="data-[state=active]:bg-[#f28c28] data-[state=active]:text-[#292929]">
                    Meu Perfil
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
              
              <TabsContent value="cargas">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
              
              <TabsContent value="transacoes">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
              
              <TabsContent value="perfil">
                {perfilUsuario.tipo === 'embarcador' ? (
                  <EmbarcadorDashboard />
                ) : (
                  <TransportadorDashboard />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
} 