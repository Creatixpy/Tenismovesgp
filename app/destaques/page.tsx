'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { CarrinhoFlutuante } from "@/app/components/CarrinhoFlutuante"
import { EstrelasAvaliacao } from "@/app/components/EstrelasAvaliacao"
import { useProdutosDestaques, useCarrinho, useFavoritos } from '@/lib/hooks'
import type { Database } from '@/lib/supabase'

type Produto = Database['public']['Tables']['produtos']['Row'] & {
  categorias?: {
    nome: string
    slug: string
  }
  mediaAvaliacoes?: number
  quantidadeAvaliacoes?: number
}

export default function Destaques() {
  const { produtos, loading } = useProdutosDestaques(20) // Mostrar mais produtos na página de destaques
  const { adicionarItem } = useCarrinho()
  const { isFavorito, toggleFavorito } = useFavoritos()
  const [adicionandoProduto, setAdicionandoProduto] = useState<string | null>(null)
  const [erroCarrinho, setErroCarrinho] = useState<string | null>(null)
  const [produtoAtual, setProdutoAtual] = useState<number>(0)

  // Filtrar apenas produtos com boa avaliação (4.0 ou mais)
  const produtosDestaque = produtos.filter(produto =>
    produto.mediaAvaliacoes && produto.mediaAvaliacoes >= 4.0
  ).sort((a, b) => (b.mediaAvaliacoes || 0) - (a.mediaAvaliacoes || 0))

  // Auto-rotacionar produtos a cada 5 segundos
  useEffect(() => {
    if (produtosDestaque.length > 1) {
      const interval = setInterval(() => {
        setProdutoAtual((prev) => (prev + 1) % produtosDestaque.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [produtosDestaque.length])

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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 hover:scale-105 transition-all duration-300 cursor-default">
              Produtos em Destaque
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
              Descubra os produtos mais bem avaliados pelos nossos clientes. Qualidade e satisfação garantidas.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-6 sm:py-8 lg:py-12 xl:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-8 sm:py-10 lg:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 border-b-2 border-blue-600 mx-auto hover:scale-110 transition-transform duration-300"></div>
              <p className="text-gray-500 mt-4 text-sm sm:text-base lg:text-lg hover:text-gray-600 transition-colors duration-300 cursor-pointer">Carregando produtos em destaque...</p>
            </div>
          ) : produtosDestaque.length === 0 ? (
            <div className="text-center py-8 sm:py-10 lg:py-12">
              <p className="text-gray-500 text-base sm:text-lg lg:text-xl hover:text-gray-600 transition-colors duration-300 cursor-pointer">Nenhum produto em destaque encontrado.</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Card Principal de Destaque */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {(() => {
                  const produto: Produto = produtosDestaque[produtoAtual]
                  return (
                    <div className="relative h-96 sm:h-[450px] lg:h-[500px] xl:h-[550px]">
                      {/* Imagem de Fundo */}
                      <div className="relative h-96 sm:h-[450px] lg:h-[500px] xl:h-[550px] bg-gradient-to-br from-gray-100 to-gray-200">
                        {produto.imagens && produto.imagens.length > 0 ? (
                          <Image
                            src={produto.imagens[0]}
                            alt={produto.nome}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-400 text-xl sm:text-2xl lg:text-3xl">Sem imagem</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Badge de Destaque */}
                        <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 z-10">
                          <span className="bg-yellow-400 text-yellow-900 text-xs sm:text-sm lg:text-base font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg">
                            ⭐ Produto Destaque
                          </span>
                        </div>

                        {/* Botão Favorito */}
                        <div className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 z-10">
                          <button
                            onClick={() => toggleFavorito(produto.id)}
                            className={`p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
                              isFavorito(produto.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white hover:text-gray-900'
                            }`}
                          >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill={isFavorito(produto.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>

                        {/* Conteúdo sobreposto na imagem */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 xl:p-10 text-white">
                          <div className="max-w-2xl">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 hover:text-yellow-300 transition-colors duration-300 cursor-pointer leading-tight">
                              {produto.nome}
                            </h2>
                            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl opacity-90 mb-4 sm:mb-6 lg:mb-8 hover:opacity-100 transition-opacity duration-300 cursor-pointer leading-relaxed max-w-3xl">
                              {produto.descricao || 'Produto de alta qualidade com as melhores avaliações'}
                            </p>

                            {/* Avaliação */}
                            {produto.mediaAvaliacoes && produto.mediaAvaliacoes > 0 && (
                              <div className="flex items-center mb-4 sm:mb-6 lg:mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <EstrelasAvaliacao nota={produto.mediaAvaliacoes} tamanho={20} />
                                <span className="text-lg sm:text-xl lg:text-2xl font-medium ml-4">
                                  {produto.mediaAvaliacoes.toFixed(1)} ({produto.quantidadeAvaliacoes} avaliações)
                                </span>
                              </div>
                            )}

                            {/* Preço */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
                              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
                                R$ {produto.preco.toFixed(2)}
                              </span>
                              {produto.preco_promocional && (
                                <span className="text-xl sm:text-2xl lg:text-3xl opacity-75 line-through hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                  R$ {produto.preco_promocional.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                              <button
                                onClick={() => handleAdicionarItem(produto.id)}
                                disabled={adicionandoProduto === produto.id}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl hover:scale-105 disabled:bg-blue-400 transition-all duration-300 font-bold text-base sm:text-lg lg:text-xl shadow-lg"
                              >
                                {adicionandoProduto === produto.id ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                              </button>
                              <Link
                                href={`/produtos/${produto.id}`}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl hover:scale-105 transition-all duration-300 font-bold text-base sm:text-lg lg:text-xl text-center border-2 border-white/30 hover:border-white/50"
                              >
                                Ver Detalhes
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Indicadores de produtos */}
                      {produtosDestaque.length > 1 && (
                        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
                          {produtosDestaque.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setProdutoAtual(index)}
                              className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full transition-all duration-300 hover:scale-125 ${
                                index === produtoAtual
                                  ? 'bg-white shadow-lg scale-110'
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                    </div>
                  )
                })()}
              </div>

              {/* Contador de produtos */}
              {produtosDestaque.length > 1 && (
                <div className="text-center mt-6 sm:mt-8 lg:mt-10">
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg hover:text-gray-700 transition-colors duration-300 cursor-pointer">
                    Produto {produtoAtual + 1} de {produtosDestaque.length} em destaque
                  </p>
                </div>
              )}

              {erroCarrinho && (
                <div className="text-center mt-4 sm:mt-6 lg:mt-8">
                  <p className="text-red-500 text-sm sm:text-base lg:text-lg hover:text-red-600 transition-colors duration-300 cursor-pointer">{erroCarrinho}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CarrinhoFlutuante />
    </div>
  )
}
