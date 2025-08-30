'use client'

import { useState } from 'react'
import { AvaliacaoItem } from './AvaliacaoItem'
import { EstrelasAvaliacao } from './EstrelasAvaliacao'
import { MessageSquare, TrendingUp } from 'lucide-react'

interface Avaliacao {
  id: string
  nota: number | null
  titulo: string | null
  comentario: string | null
  recomendado: boolean | null
  criado_em: string
  resposta_loja: string | null
  data_resposta: string | null
  perfis?: {
    nome: string
    avatar_url: string | null
  }
}

interface ListaAvaliacoesProps {
  avaliacoes: Avaliacao[]
  loading?: boolean
}

export function ListaAvaliacoes({ avaliacoes, loading }: ListaAvaliacoesProps) {
  const [filtroNota, setFiltroNota] = useState<number | null>(null)

  // Calcular estatísticas
  const totalAvaliacoes = avaliacoes.length
  const mediaNota = totalAvaliacoes > 0
    ? avaliacoes.reduce((sum, av) => sum + (av.nota || 0), 0) / totalAvaliacoes
    : 0

  const distribuicaoNotas = [1, 2, 3, 4, 5].map(nota => ({
    nota,
    quantidade: avaliacoes.filter(av => av.nota === nota).length,
    porcentagem: totalAvaliacoes > 0
      ? (avaliacoes.filter(av => av.nota === nota).length / totalAvaliacoes) * 100
      : 0
  }))

  // Filtrar avaliações
  const avaliacoesFiltradas = filtroNota
    ? avaliacoes.filter(av => av.nota === filtroNota)
    : avaliacoes

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (totalAvaliacoes === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
        <p className="text-gray-500">Seja o primeiro a avaliar este produto!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Média geral */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <EstrelasAvaliacao nota={Math.round(mediaNota)} tamanho={24} />
              <span className="text-2xl font-bold text-gray-900">
                {mediaNota.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Baseado em {totalAvaliacoes} avaliação{totalAvaliacoes !== 1 ? 'ões' : ''}
            </p>
          </div>

          {/* Distribuição de notas */}
          <div className="space-y-2">
            {distribuicaoNotas.reverse().map(({ nota, quantidade, porcentagem }) => (
              <div key={nota} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{nota}</span>
                  <EstrelasAvaliacao nota={nota} tamanho={12} />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${porcentagem}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{quantidade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Filtrar por nota:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFiltroNota(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filtroNota === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          {[5, 4, 3, 2, 1].map(nota => (
            <button
              key={nota}
              onClick={() => setFiltroNota(nota)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filtroNota === nota
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {nota} <span className="hidden sm:inline">estrela{nota !== 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de avaliações */}
      <div className="space-y-6">
        {avaliacoesFiltradas.map(avaliacao => (
          <AvaliacaoItem key={avaliacao.id} avaliacao={avaliacao} />
        ))}
      </div>

      {avaliacoesFiltradas.length === 0 && filtroNota && (
        <div className="text-center py-8">
          <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Nenhuma avaliação com {filtroNota} estrela{filtroNota !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
}
