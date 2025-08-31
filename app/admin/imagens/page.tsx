'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import GerenciadorImagens from '@/app/components/GerenciadorImagens'
import DebugSupabase from '@/app/components/DebugSupabase'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

interface Produto {
  id: string
  nome: string
  sku: string | null
  ativo: boolean
}

export default function AdminImagens() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProdutos()
  }, [])

  const loadProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome, sku, ativo')
        .order('nome')

      if (error) throw error

      setProdutos(data || [])
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (produto.sku && produto.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando produtos...</span>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Imagens dos Produtos
          </h1>
          <p className="text-gray-600">
            Faça upload, organize e gerencie as imagens dos seus produtos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Produtos ({filteredProdutos.length})
                </h2>

                {/* Campo de busca */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Debug Component */}
              <div className="p-4 border-b border-gray-200">
                <DebugSupabase />
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredProdutos.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum produto encontrado
                  </div>
                ) : (
                  filteredProdutos.map((produto) => (
                    <div
                      key={produto.id}
                      onClick={() => setSelectedProduto(produto)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedProduto?.id === produto.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {produto.nome}
                          </h3>
                          {produto.sku && (
                            <p className="text-xs text-gray-500 truncate">
                              SKU: {produto.sku}
                            </p>
                          )}
                        </div>
                        <div className="ml-3 flex items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            produto.ativo ? 'bg-green-400' : 'bg-red-400'
                          }`} title={produto.ativo ? 'Ativo' : 'Inativo'} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Gerenciador de Imagens */}
          <div className="lg:col-span-2">
            {selectedProduto ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedProduto.nome}
                      </h2>
                      {selectedProduto.sku && (
                        <p className="text-sm text-gray-500 mt-1">
                          SKU: {selectedProduto.sku}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedProduto(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <GerenciadorImagens
                    produtoId={selectedProduto.id}
                    onChange={(imagens) => {
                      console.log('Imagens atualizadas:', imagens)
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecione um produto
                  </h3>
                  <p className="text-gray-500">
                    Escolha um produto da lista para gerenciar suas imagens
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
