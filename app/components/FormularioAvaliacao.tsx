'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks'
import { supabase } from '@/lib/supabase'
import { EstrelasAvaliacao } from './EstrelasAvaliacao'
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react'

interface FormularioAvaliacaoProps {
  produtoId: string
  onAvaliacaoCriada: () => void
  avaliacaoExistente?: {
    id: string
    nota: number | null
    titulo: string | null
    comentario: string | null
    recomendado: boolean | null
  } | null
}

export function FormularioAvaliacao({
  produtoId,
  onAvaliacaoCriada,
  avaliacaoExistente
}: FormularioAvaliacaoProps) {
  const { user } = useAuth()
  const [nota, setNota] = useState(avaliacaoExistente?.nota || 0)
  const [titulo, setTitulo] = useState(avaliacaoExistente?.titulo || '')
  const [comentario, setComentario] = useState(avaliacaoExistente?.comentario || '')
  const [recomendado, setRecomendado] = useState<boolean | null>(avaliacaoExistente?.recomendado || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Você precisa estar logado para avaliar')
      return
    }

    if (nota === 0) {
      setError('Por favor, selecione uma nota')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Obter o token de autenticação atual
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) {
        setError('Sessão expirada. Faça login novamente.')
        return
      }

      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          produto_id: produtoId,
          nota,
          titulo: titulo.trim() || null,
          comentario: comentario.trim() || null,
          recomendado
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar avaliação')
      }

      // Limpar formulário
      setNota(0)
      setTitulo('')
      setComentario('')
      setRecomendado(null)

      onAvaliacaoCriada()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar avaliação')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="text-blue-800 mb-4">
          <p className="font-medium">Faça login para avaliar este produto</p>
          <p className="text-sm mt-1">Sua opinião é importante para outros compradores!</p>
        </div>
        <a
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Fazer Login
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {avaliacaoExistente ? 'Editar sua avaliação' : 'Avalie este produto'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nota */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sua nota *
          </label>
          <div className="flex items-center space-x-4">
            <EstrelasAvaliacao
              nota={nota}
              tamanho={32}
              interativo={true}
              onChange={setNota}
            />
            <span className="text-sm text-gray-600">
              {nota > 0 ? `${nota} de 5 estrelas` : 'Clique para avaliar'}
            </span>
          </div>
        </div>

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
            Título da avaliação
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Produto excelente!"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{titulo.length}/100 caracteres</p>
        </div>

        {/* Comentário */}
        <div>
          <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
            Seu comentário
          </label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Conte sua experiência com este produto..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">{comentario.length}/1000 caracteres</p>
        </div>

        {/* Recomendação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Você recomenda este produto?
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setRecomendado(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                recomendado === true
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Sim</span>
            </button>
            <button
              type="button"
              onClick={() => setRecomendado(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                recomendado === false
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Não</span>
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Botão de envio */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || nota === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{avaliacaoExistente ? 'Atualizar avaliação' : 'Enviar avaliação'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
