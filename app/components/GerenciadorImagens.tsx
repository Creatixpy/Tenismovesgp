'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useImagensProduto } from '@/lib/hooks/useImagensProduto'
import { verificarConfiguracaoSupabase } from '@/lib/test-supabase'

interface ImagemProduto {
  id: string
  produto_id: string
  nome_arquivo: string
  caminho_supabase: string
  url_publica: string
  tamanho_bytes: number | null
  tipo_mime: string | null
  largura: number | null
  altura: number | null
  ordem: number
  principal: boolean
  criado_em: string
  atualizado_em: string
}

interface GerenciadorImagensProps {
  produtoId: string
  onChange?: (imagens: ImagemProduto[]) => void
}

export default function GerenciadorImagens({ produtoId, onChange }: GerenciadorImagensProps) {
  const { imagens, loading, error, uploadImagem, deleteImagem, setImagemPrincipal, refreshImagens } = useImagensProduto()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (produtoId) {
      console.log('🔄 Carregando imagens para produto:', produtoId)
      refreshImagens(produtoId)

      // Verificar configuração do Supabase em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        verificarConfiguracaoSupabase()
      }
    }
  }, [produtoId, refreshImagens])

  useEffect(() => {
    if (onChange) {
      onChange(imagens)
    }
  }, [imagens, onChange])

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !produtoId) return

    setUploading(true)
    const uploadPromises = Array.from(files).map(file => uploadImagem(produtoId, file))

    try {
      await Promise.all(uploadPromises)
    } catch (err) {
      console.error('Erro no upload:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDelete = async (imagemId: string) => {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
      await deleteImagem(imagemId)
    }
  }

  const handleSetPrincipal = async (imagemId: string) => {
    await setImagemPrincipal(imagemId)
  }

  if (loading && imagens.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando imagens...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Imagens do Produto</h3>
        <span className="text-sm text-gray-500">{imagens.length} imagem(ns)</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Área de Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <p className="text-gray-600">
              Arraste e solte imagens aqui, ou{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                selecione arquivos
              </button>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF até 5MB cada
            </p>
          </div>

          {uploading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Enviando...</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={uploading}
        />
      </div>

      {/* Grid de Imagens */}
      {imagens.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagens.map((imagem) => (
            <div key={imagem.id} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={imagem.url_publica}
                  alt={imagem.nome_arquivo}
                  fill
                  className="object-cover"
                />

                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {!imagem.principal && (
                      <button
                        onClick={() => handleSetPrincipal(imagem.id)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-yellow-600 transition-colors"
                        title="Definir como principal"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(imagem.id)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                      title="Excluir imagem"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Badge de imagem principal */}
                {imagem.principal && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-lg">
                    Principal
                  </div>
                )}

                {/* Informações da imagem */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-xs truncate">{imagem.nome_arquivo}</p>
                  <p className="text-xs">
                    {imagem.largura}x{imagem.altura}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {imagens.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma imagem cadastrada para este produto.</p>
        </div>
      )}
    </div>
  )
}
