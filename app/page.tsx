'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { EstrelasAvaliacao } from "@/app/components/EstrelasAvaliacao"
import { useProdutosDestaques } from '@/lib/hooks'
import type { Produto } from '@/lib/hooks'

type ProdutoComAvaliacoes = Produto & {
  mediaAvaliacoes?: number
  quantidadeAvaliacoes?: number
}

export default function Home() {
  const { produtos, loading } = useProdutosDestaques(6) // Buscar 6 produtos em destaque

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 hover:scale-105 transition-all duration-300 cursor-default">
              Estilo que
              <span className="text-blue-600 hover:text-blue-700 transition-colors duration-300"> Move</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto hover:text-gray-700 transition-colors duration-300 cursor-pointer">
              Descubra nossa coleção exclusiva de tênis premium. Performance excepcional,
              design inovador e conforto incomparável para o seu dia a dia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produtos" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium">
                Explorar Coleção
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Destaques Animados Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        {/* Elementos de fundo animados - Otimizados para mobile */}
        <div className="absolute inset-0">
          <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-16 right-10 sm:top-32 sm:right-20 w-8 h-8 sm:w-16 sm:h-16 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 left-1/4 sm:bottom-20 w-6 h-6 sm:w-12 sm:h-12 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-16 right-1/3 sm:bottom-32 w-10 h-10 sm:w-24 sm:h-24 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 sm:w-8 sm:h-8 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 hover:scale-105 transition-all duration-300 cursor-default animate-pulse">
              Destaques em Movimento
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-2 sm:px-0 hover:text-white transition-colors duration-300 cursor-pointer">
              Produtos premium que combinam performance, estilo e inovação
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-3 sm:mt-4 text-sm sm:text-base">Carregando destaques...</p>
            </div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-white text-base sm:text-lg">Nenhum produto em destaque encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {produtos.slice(0, 3).map((produto: ProdutoComAvaliacoes, index: number) => (
                <div
                  key={produto.id}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    transform: `translateY(${index * 20}px)`,
                  }}
                >
                  <div className="relative mb-3 sm:mb-4">
                    <div className="aspect-square bg-gradient-to-br from-white/20 to-white/10 rounded-lg sm:rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      {produto.imagens && produto.imagens.length > 0 ? (
                        <Image
                          src={produto.imagens[0].url_publica}
                          alt={produto.nome}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-xs sm:text-sm">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Badge animado - Otimizado para mobile */}
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg animate-bounce">
                      ⭐ Destaque
                    </div>

                    {/* Ícone de favorito animado - Otimizado para mobile */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-red-500/20 hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="text-white">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 hover:text-yellow-300 transition-colors duration-300 cursor-pointer line-clamp-2">
                      {produto.nome}
                    </h3>

                    <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-3 hover:text-white transition-colors duration-300 cursor-pointer line-clamp-2">
                      {produto.descricao || 'Produto premium com qualidade excepcional'}
                    </p>

                    {produto.mediaAvaliacoes && produto.mediaAvaliacoes > 0 && (
                      <div className="flex items-center mb-2 sm:mb-3 hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <EstrelasAvaliacao nota={produto.mediaAvaliacoes} tamanho={14} />
                        <span className="text-white/90 text-xs sm:text-sm ml-2 hover:text-white transition-colors duration-300">
                          {produto.mediaAvaliacoes.toFixed(1)} ({produto.quantidadeAvaliacoes})
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-bold hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        {produto.preco_promocional && (
                          <span className="text-white/70 text-xs sm:text-sm line-through hover:text-white/90 transition-colors duration-300 cursor-pointer">
                            R$ {produto.preco_promocional.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition-colors duration-300 cursor-pointer self-start sm:self-auto">
                        {produto.categorias?.nome || 'Premium'}
                      </span>
                    </div>

                    <Link
                      href={`/produtos/${produto.id}`}
                      className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-center py-2.5 sm:py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 border border-white/30 hover:border-white/50 text-sm sm:text-base"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Ondas animadas no fundo - Otimizadas para mobile */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 lg:h-20 xl:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1200,40 1200,60 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.1)"
              className="animate-pulse"
            />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 hover:scale-105 transition-all duration-300 cursor-default">Sobre a TenisMoveSGP</h3>
              <p className="text-gray-600 mb-6 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
                Somos apaixonados por tênis e acreditamos que o calçado perfeito pode transformar
                sua experiência, seja nos treinos intensos ou no dia a dia corrido da cidade.
              </p>
              <p className="text-gray-600 mb-8 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
                Nossa missão é oferecer produtos de alta qualidade, com curadoria especializada
                e atendimento personalizado para que você encontre exatamente o que precisa.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">500+</div>
                  <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Produtos</div>
                </div>
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">10k+</div>
                  <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Clientes</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 hover:bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">Qualidade Garantida</h4>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">Produtos originais com garantia oficial</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 hover:bg-green-50 p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors duration-300">Entrega Rápida</h4>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">Envio gratuito para todo o Brasil</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 hover:bg-purple-50 p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors duration-300">Suporte Especializado</h4>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">Equipe pronta para ajudar você</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
