import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

export function formatarData(dataISO: string): string {
  const data = new Date(dataISO)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data)
}

export function formatarDistancia(distancia: number): string {
  return `${distancia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`
}

type StatusFrete = 'aguardando' | 'confirmado' | 'em_andamento' | 'finalizado' | 'cancelado'

export function obterStatusFrete(status: StatusFrete): { label: string; color: string } {
  switch (status) {
    case 'aguardando':
      return { 
        label: 'Aguardando',
        color: 'bg-yellow-100 text-yellow-800'
      }
    case 'confirmado':
      return { 
        label: 'Confirmado',
        color: 'bg-blue-100 text-blue-800'
      }
    case 'em_andamento':
      return { 
        label: 'Em andamento',
        color: 'bg-indigo-100 text-indigo-800'
      }
    case 'finalizado':
      return { 
        label: 'Finalizado',
        color: 'bg-green-100 text-green-800'
      }
    case 'cancelado':
      return { 
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800'
      }
    default:
      return { 
        label: 'Desconhecido',
        color: 'bg-gray-100 text-gray-800'
      }
  }
} 