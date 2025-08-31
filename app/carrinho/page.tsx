'use client'

import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { useCarrinho } from '@/lib/hooks'
import type { Database } from '@/lib/supabase'

type ItemCarrinho = Database['public']['Tables']['itens_carrinho']['Row'] & {
  produtos: {
    nome: string
    preco: number
    imagens_produto: {
      url_publica: string
    }[]
  } | null
}

function CarrinhoContent() {
  const { itens, loading, removerItem } = useCarrinho()

  const total = itens.reduce((sum: number, item) => {
    return sum + (item.preco_unitario * item.quantidade)
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando carrinho...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Meu Carrinho</h1>

            {itens.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Seu carrinho está vazio</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Adicione produtos ao seu carrinho para continuar comprando.
                </p>
                <div className="mt-6">
                  <Link
                    href="/produtos"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {itens.map((item: ItemCarrinho) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      {item.produtos?.imagens_produto && item.produtos.imagens_produto.length > 0 ? (
                        <Image
                          src={item.produtos.imagens_produto[0].url_publica}
                          alt={item.produtos.nome || 'Produto'}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Sem imagem</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.produtos?.nome || 'Produto'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        R$ {item.preco_unitario.toFixed(2)} x {item.quantidade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removerItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-800 mt-1"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <Link
                      href="/produtos"
                      className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors text-center"
                    >
                      Continuar Comprando
                    </Link>
                    <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CarrinhoPage() {
  return (
    <ProtectedRoute>
      <CarrinhoContent />
    </ProtectedRoute>
  )
}
