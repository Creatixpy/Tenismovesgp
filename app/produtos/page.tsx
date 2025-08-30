'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { CarrinhoFlutuante } from "@/app/components/CarrinhoFlutuante"
import { useProdutos, useCategorias, useCarrinho, useFavoritos } from '@/lib/hooks'
import type { Database } from '@/lib/supabase'

type Produto = Database['public']['Tables']['produtos']['Row'] & {
  categorias?: {
    nome: string
    slug: string
  }
}
type Categoria = Database['public']['Tables']['categorias']['Row']

export default function Produtos() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('')
  const { produtos, loading: loadingProdutos } = useProdutos(categoriaSelecionada)
  const { categorias } = useCategorias()
  const { adicionarItem } = useCarrinho()
  const { isFavorito, toggleFavorito } = useFavoritos()
  const [adicionandoProduto, setAdicionandoProduto] = useState<string | null>(null)
  const [erroCarrinho, setErroCarrinho] = useState<string | null>(null)

  const handleAdicionarItem = async (produtoId: string) => {
    try {
      setAdicionandoProduto(produtoId)
      setErroCarrinho(null)
      await adicionarItem(produtoId)
      // Feedback visual poderia ser adicionado aqui
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error)
      setErroCarrinho(error instanceof Error ? error.message : 'Erro ao adicionar item ao carrinho')
    } finally {
      setAdicionandoProduto(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Nossa Coleção
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Explore nossa seleção completa de tênis premium para todos os estilos e necessidades.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-6 sm:py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            <button
              onClick={() => setCategoriaSelecionada('')}
              className={`px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium ${
                categoriaSelecionada === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>
            {categorias.map((categoria: Categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaSelecionada(categoria.id)}
                className={`px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium ${
                  categoriaSelecionada === categoria.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {categoria.nome}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingProdutos ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Carregando produtos...</p>
            </div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {produtos.map((produto: Produto) => (
                <div key={produto.id} className="group bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden flex-shrink-0">
                    {produto.imagens && produto.imagens.length > 0 ? (
                      <Image
                        src={produto.imagens[0]}
                        alt={produto.nome}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400">Sem imagem</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <button
                        onClick={() => toggleFavorito(produto.id)}
                        className={`p-1.5 sm:p-2 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110 ${
                          isFavorito(produto.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-700 hover:bg-white'
                        }`}
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill={isFavorito(produto.id) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{produto.nome}</h3>
                      <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded self-start sm:self-auto">
                        {produto.categorias?.nome || 'Sem categoria'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{produto.descricao || 'Sem descrição'}</p>

                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cores disponíveis:</p>
                        <div className="flex gap-2">
                          {produto.cor ? (
                            <div
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                              style={{backgroundColor: produto.cor.toLowerCase()}}
                            ></div>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tamanhos:</p>
                        <div className="flex gap-1 flex-wrap">
                          {produto.tamanho ? (
                            <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:border-gray-400 transition-colors">
                              {produto.tamanho}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        {produto.preco_promocional && (
                          <span className="text-sm text-gray-500 line-through">
                            R$ {produto.preco_promocional.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <button
                          onClick={() => handleAdicionarItem(produto.id)}
                          disabled={adicionandoProduto === produto.id}
                          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium text-sm flex-1 sm:flex-none"
                        >
                          {adicionandoProduto === produto.id ? 'Adicionando...' : 'Adicionar'}
                        </button>
                        <Link
                          href={`/produtos/${produto.id}`}
                          className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm text-center flex-1 sm:flex-none"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                      {erroCarrinho && (
                        <p className="text-red-500 text-xs mt-1">{erroCarrinho}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CarrinhoFlutuante />

      <Footer />
    </div>
  );
}
