"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, Truck, Wallet, Road, CreditCard } from 'lucide-react'
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api'
import { formatarPreco, formatarData, formatarDistancia } from "@/lib/utils"

// Tipos para o componente
interface DetalhesCargaProps {
  params: {
    id: string
  }
}

// Dados simulados para uma carga
const cargaSimulada = {
  id: '1',
  titulo: 'Mudança residencial',
  descricao: 'Transporte de móveis e eletrodomésticos',
  tipo_mercadoria: 'Móveis',
  peso: 800,
  volume: 12,
  valor_mercadoria: 25000,
  valor_frete: 2500,
  origem_cep: '01310-200',
  origem_cidade: 'São Paulo',
  origem_estado: 'SP',
  origem_endereco: 'Av. Paulista, 1000',
  destino_cep: '22031-000',
  destino_cidade: 'Rio de Janeiro',
  destino_estado: 'RJ',
  destino_endereco: 'Av. Atlântica, 2000',
  data_coleta: new Date('2025-04-15'),
  data_entrega: new Date('2025-04-17'),
  requisitos_veiculo: 'Caminhão baú',
  status: 'aberta',
  data_criacao: new Date('2025-03-10'),
  embarcador: {
    id: 1,
    nome: 'João Silva',
    empresa: 'Mudanças Express'
  }
}

// Componente de página
export default function DetalheCarga({ params }: DetalhesCargaProps) {
  const [carga, setCarga] = useState(cargaSimulada)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [distancia, setDistancia] = useState<string>('')
  const [duracao, setDuracao] = useState<string>('')
  const [pedagios, setPedagios] = useState<number>(0)
  
  // Carregamento da API do Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  })

  // Opções para o mapa
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  }
  
  const center = {
    lat: -23.5505,
    lng: -46.6333
  }

  // Função para obter as direções da rota
  const carregarRota = useCallback(() => {
    if (!isLoaded) return
    
    const directionsService = new google.maps.DirectionsService()
    
    directionsService.route(
      {
        origin: `${carga.origem_cidade}, ${carga.origem_estado}`,
        destination: `${carga.destino_cidade}, ${carga.destino_estado}`,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
          
          // Extrair informações da rota
          const rota = result.routes[0]
          
          // Distância total
          let distanciaTotal = 0
          rota.legs.forEach(leg => {
            distanciaTotal += leg.distance?.value || 0
          })
          setDistancia(formatarDistancia(distanciaTotal / 1000))
          
          // Duração total
          let duracaoTotal = 0
          rota.legs.forEach(leg => {
            duracaoTotal += leg.duration?.value || 0
          })
          // Converter segundos para formato horas:minutos
          const horas = Math.floor(duracaoTotal / 3600)
          const minutos = Math.floor((duracaoTotal % 3600) / 60)
          setDuracao(`${horas}h ${minutos}min`)
          
          // Contagem de pedágios (baseado nas instruções de etapas que mencionam pedágio)
          let contadorPedagios = 0
          rota.legs.forEach(leg => {
            leg.steps.forEach(step => {
              if (step.instructions && step.instructions.toLowerCase().includes('pedágio')) {
                contadorPedagios++
              }
            })
          })
          setPedagios(contadorPedagios)
        }
      }
    )
  }, [isLoaded, carga])

  // Efeito para carregar a rota quando o componente montar
  useEffect(() => {
    if (isLoaded) {
      carregarRota()
    }
  }, [isLoaded, carregarRota])

  // Se a API ainda não carregou, mostrar um indicador de carregamento
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#292929] text-[#ebebeb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f28c28] mx-auto"></div>
          <p className="mt-4">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#292929] text-[#ebebeb]">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link 
            href="/dashboard?tab=cargas" 
            className="inline-flex items-center text-[#f28c28] hover:text-[#f28c28]/80 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para lista de cargas
          </Link>
        </div>
        
        <div className="bg-[#333333] rounded-lg shadow-md border border-[#444444] p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#f28c28] mb-2">{carga.titulo}</h1>
              <p className="text-[#ebebeb]/80">{carga.descricao}</p>
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">
                  {carga.status === 'aberta' ? 'Carga Disponível' : 'Carga em Negociação'}
                </span>
                <span className="ml-3 text-sm text-[#ebebeb]/60">
                  ID: {carga.id}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold text-[#f28c28]">{formatarPreco(carga.valor_frete || 0)}</div>
              <p className="text-sm text-[#ebebeb]/60">Publicado em {formatarData(carga.data_criacao)}</p>
            </div>
          </div>
          
          {/* Mapa com a rota */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#f28c28] mb-4">Rota</h2>
            <div className="overflow-hidden rounded-lg">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={5}
                options={{
                  styles: [
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                  ],
                  disableDefaultUI: false,
                }}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
            
            {/* Detalhes da rota */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-[#3a3a3a] p-4 rounded-lg border border-[#444444]">
                <div className="flex items-center mb-2">
                  <Road className="h-5 w-5 text-[#f28c28] mr-2" />
                  <h3 className="text-lg font-medium text-[#ebebeb]">Distância</h3>
                </div>
                <p className="text-2xl font-semibold text-[#f28c28]">{distancia}</p>
              </div>
              
              <div className="bg-[#3a3a3a] p-4 rounded-lg border border-[#444444]">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-[#f28c28] mr-2" />
                  <h3 className="text-lg font-medium text-[#ebebeb]">Tempo Estimado</h3>
                </div>
                <p className="text-2xl font-semibold text-[#f28c28]">{duracao}</p>
              </div>
              
              <div className="bg-[#3a3a3a] p-4 rounded-lg border border-[#444444]">
                <div className="flex items-center mb-2">
                  <CreditCard className="h-5 w-5 text-[#f28c28] mr-2" />
                  <h3 className="text-lg font-medium text-[#ebebeb]">Pedágios</h3>
                </div>
                <p className="text-2xl font-semibold text-[#f28c28]">{pedagios} no trajeto</p>
              </div>
            </div>
          </div>
          
          {/* Detalhes da carga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-[#f28c28] mb-4">Detalhes da Carga</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#ebebeb]/60">Tipo de Mercadoria</p>
                  <p className="text-[#ebebeb]">{carga.tipo_mercadoria}</p>
                </div>
                <div>
                  <p className="text-sm text-[#ebebeb]/60">Peso</p>
                  <p className="text-[#ebebeb]">{carga.peso} kg</p>
                </div>
                <div>
                  <p className="text-sm text-[#ebebeb]/60">Volume</p>
                  <p className="text-[#ebebeb]">{carga.volume} m³</p>
                </div>
                <div>
                  <p className="text-sm text-[#ebebeb]/60">Valor da Mercadoria</p>
                  <p className="text-[#ebebeb]">{formatarPreco(carga.valor_mercadoria || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#ebebeb]/60">Valor do Frete</p>
                  <p className="text-[#ebebeb]">{formatarPreco(carga.valor_frete || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#ebebeb]/60">Requisitos do Veículo</p>
                  <p className="text-[#ebebeb]">{carga.requisitos_veiculo}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-[#f28c28] mb-4">Datas e Locais</h2>
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-[#f28c28] mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#ebebeb]/60">Origem</p>
                    <p className="font-medium text-[#ebebeb]">{carga.origem_endereco}</p>
                    <p className="text-[#ebebeb]">{carga.origem_cidade}, {carga.origem_estado} - CEP {carga.origem_cep}</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-[#f28c28] mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#ebebeb]/60">Destino</p>
                    <p className="font-medium text-[#ebebeb]">{carga.destino_endereco}</p>
                    <p className="text-[#ebebeb]">{carga.destino_cidade}, {carga.destino_estado} - CEP {carga.destino_cep}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#ebebeb]/60">Data de Coleta</p>
                    <p className="text-[#ebebeb]">{formatarData(carga.data_coleta)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#ebebeb]/60">Data de Entrega</p>
                    <p className="text-[#ebebeb]">{formatarData(carga.data_entrega)}</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-[#f28c28] mb-4">Embarcador</h2>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-[#f28c28]/20 text-[#f28c28] flex items-center justify-center mr-3">
                  {carga.embarcador.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-[#ebebeb]">{carga.embarcador.nome}</p>
                  <p className="text-sm text-[#ebebeb]/60">{carga.embarcador.empresa}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ações */}
        <div className="bg-[#333333] rounded-lg shadow-md border border-[#444444] p-6">
          <h2 className="text-xl font-semibold text-[#f28c28] mb-4">Ações</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-[#f28c28] text-[#292929] font-medium rounded-md hover:bg-[#f28c28]/90 transition-colors">
              Fazer Proposta
            </button>
            <button className="px-6 py-3 border border-[#444444] text-[#ebebeb] font-medium rounded-md hover:bg-[#3a3a3a] transition-colors">
              Entrar em Contato
            </button>
            <button className="px-6 py-3 border border-[#444444] text-[#ebebeb] font-medium rounded-md hover:bg-[#3a3a3a] transition-colors">
              Salvar nos Favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 