'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EstrelasAvaliacao } from './EstrelasAvaliacao'
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'

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

interface AvaliacaoItemProps {
  avaliacao: Avaliacao
}

export function AvaliacaoItem({ avaliacao }: AvaliacaoItemProps) {
  const formatarData = (data: string) => {
    try {
      return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return data
    }
  }

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-start space-x-4">
        {/* Avatar do usuário */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {avaliacao.perfis?.nome ? avaliacao.perfis.nome.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        {/* Conteúdo da avaliação */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">
                {avaliacao.perfis?.nome || 'Usuário'}
              </span>
              <EstrelasAvaliacao nota={avaliacao.nota || 0} tamanho={16} />
            </div>
            <span className="text-sm text-gray-500">
              {formatarData(avaliacao.criado_em)}
            </span>
          </div>

          {/* Título da avaliação */}
          {avaliacao.titulo && (
            <h4 className="font-medium text-gray-900 mb-2">{avaliacao.titulo}</h4>
          )}

          {/* Comentário */}
          {avaliacao.comentario && (
            <p className="text-gray-700 mb-3 leading-relaxed">{avaliacao.comentario}</p>
          )}

          {/* Recomendação */}
          {avaliacao.recomendado !== null && (
            <div className="flex items-center space-x-2 mb-3">
              {avaliacao.recomendado ? (
                <>
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Recomenda este produto</span>
                </>
              ) : (
                <>
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Não recomenda este produto</span>
                </>
              )}
            </div>
          )}

          {/* Resposta da loja */}
          {avaliacao.resposta_loja && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Resposta da loja</span>
                {avaliacao.data_resposta && (
                  <span className="text-xs text-blue-600">
                    {formatarData(avaliacao.data_resposta)}
                  </span>
                )}
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">{avaliacao.resposta_loja}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
