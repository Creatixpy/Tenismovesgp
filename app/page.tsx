'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { EstrelasAvaliacao } from "@/app/components/EstrelasAvaliacao"
import { useProdutosDestaques } from '@/lib/hooks'
import type { Database } from '@/lib/supabase'

type Produto = Database['public']['Tables']['produtos']['Row'] & {
  categorias?: {
    nome: string
    slug: string
  }
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
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 hover:scale-105 transition-all duration-300 font-medium">
                <Link href="/destaques">Ver Destaques</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produtos" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 hover:scale-105 transition-all duration-300 cursor-default">
              Produtos em Destaque
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
              Nossa seleção curada dos melhores tênis do mercado, escolhidos por qualidade e estilo.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Carregando produtos...</p>
            </div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                        <span className="text-gray-400 text-sm">Sem imagem</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <button className="p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-50 hover:scale-110 transition-all duration-300 group">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-red-500 group-hover:fill-red-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-300 cursor-pointer">{produto.nome}</h3>
                      <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded self-start sm:self-auto hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 cursor-pointer">
                        {produto.categorias?.nome || 'Sem categoria'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 hover:text-gray-700 transition-colors duration-300 cursor-pointer">{produto.descricao || 'Sem descrição'}</p>

                    {produto.mediaAvaliacoes && produto.mediaAvaliacoes > 0 && (
                      <div className="flex items-center mb-3 sm:mb-4">
                        <EstrelasAvaliacao nota={produto.mediaAvaliacoes} tamanho={14} />
                        <span className="text-xs sm:text-sm text-gray-600 ml-2 hover:text-gray-700 transition-colors duration-300 cursor-pointer">
                          {produto.mediaAvaliacoes.toFixed(1)} ({produto.quantidadeAvaliacoes})
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        {produto.preco_promocional && (
                          <span className="text-sm text-gray-500 line-through hover:text-red-500 transition-colors duration-300 cursor-pointer">
                            R$ {produto.preco_promocional.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/produtos/${produto.id}`}
                        className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base text-center w-full"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/produtos"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
            >
              Ver Todos os Produtos
            </Link>
          </div>
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
