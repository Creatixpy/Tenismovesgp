'use client'

import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { useFavoritos, useProdutos } from '@/lib/hooks'
import type { Produto } from '@/lib/hooks'

function FavoritosContent() {
  const { favoritos } = useFavoritos()
  const { produtos } = useProdutos()

  // Filtrar apenas os produtos que estão nos favoritos
  const produtosFavoritos = produtos.filter((produto: Produto) => favoritos.includes(produto.id))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Meus Favoritos</h1>

            {produtosFavoritos.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum favorito ainda</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece a adicionar produtos aos seus favoritos enquanto navega pela loja.
                </p>
                <div className="mt-6">
                  <Link
                    href="/produtos"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Explorar Produtos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosFavoritos.map((produto: Produto) => (
                  <div key={produto.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {produto.imagens && produto.imagens.length > 0 ? (
                        <Image
                          src={produto.imagens[0].url_publica}
                          alt={produto.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-400">Sem imagem</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <div className="absolute top-4 right-4">
                        <div className="p-2 bg-red-500 text-white backdrop-blur-sm rounded-full">
                          <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{produto.nome}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {produto.categorias?.nome || 'Sem categoria'}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{produto.descricao || 'Sem descrição'}</p>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            R$ {produto.preco.toFixed(2)}
                          </span>
                          {produto.preco_promocional && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              R$ {produto.preco_promocional.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/produtos/${produto.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function FavoritosPage() {
  return (
    <ProtectedRoute>
      <FavoritosContent />
    </ProtectedRoute>
  )
}
