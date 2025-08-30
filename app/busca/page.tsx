'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { useProdutos } from '@/lib/hooks'
import type { Database } from '@/lib/supabase'

type Produto = Database['public']['Tables']['produtos']['Row'] & {
  categorias?: {
    nome: string
    slug: string
  }
}

function BuscaContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const { produtos, loading } = useProdutos()

  const filteredProdutos = produtos.filter((produto: Produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // A busca já é feita em tempo real
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Buscar Produtos</h1>

              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Digite sua busca
                  </label>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: tênis nike, tênis adidas..."
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-3"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Buscar
                  </button>
                  <Link
                    href="/"
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Voltar ao Início
                  </Link>
                </div>
              </form>

              {searchTerm && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Resultados para &quot;{searchTerm}&quot;
                  </h2>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Buscando produtos...</p>
                    </div>
                  ) : filteredProdutos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum produto encontrado para &quot;{searchTerm}&quot;</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProdutos.map((produto) => (
                        <div key={produto.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                            {produto.imagens && produto.imagens.length > 0 ? (
                              <Image
                                src={produto.imagens[0]}
                                alt={produto.nome}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Sem imagem</span>
                              </div>
                            )}
                          </div>

                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {produto.nome}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {produto.descricao}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-gray-900">
                                R$ {produto.preco.toFixed(2)}
                              </span>
                              <Link
                                href={`/produtos/${produto.id}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
              )}

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sugestões de Busca</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/produtos?categoria=esportivos" className="text-blue-600 hover:text-blue-800">
                    Tênis Esportivos
                  </Link>
                  <Link href="/produtos?categoria=casual" className="text-blue-600 hover:text-blue-800">
                    Tênis Casual
                  </Link>
                  <Link href="/produtos?categoria=performance" className="text-blue-600 hover:text-blue-800">
                    Performance
                  </Link>
                  <Link href="/produtos?categoria=lifestyle" className="text-blue-600 hover:text-blue-800">
                    Lifestyle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function BuscaPage() {
  return <BuscaContent />
}
