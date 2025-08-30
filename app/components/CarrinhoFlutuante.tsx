'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCarrinho } from '@/lib/hooks'
import { ShoppingCart, X, Trash2 } from 'lucide-react'

export function CarrinhoFlutuante() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { itens, loading, removerItem } = useCarrinho()

  const total = itens.reduce((sum, item) => {
    return sum + (item.preco_unitario * item.quantidade)
  }, 0)

  const quantidadeTotal = itens.reduce((sum, item) => sum + item.quantidade, 0)

  const handleOpen = () => {
    setIsAnimating(true)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => setIsOpen(false), 300)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Botão do carrinho flutuante */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-50 group"
      >
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        {quantidadeTotal > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
            {quantidadeTotal > 99 ? '99+' : quantidadeTotal}
          </span>
        )}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
      </button>

      {/* Overlay e Modal */}
      {(isOpen || isAnimating) && (
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-50 flex items-end md:items-center justify-center ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        >
          <div
            className={`bg-white w-full md:w-[480px] md:rounded-2xl shadow-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden transform transition-all duration-300 ${
              isOpen ? 'translate-y-0 scale-100' : 'translate-y-full md:translate-y-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Seu Carrinho</h2>
                  <p className="text-sm text-gray-600">
                    {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-gray-500 mt-4 font-medium">Carregando seu carrinho...</p>
                </div>
              ) : itens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrinho vazio</h3>
                  <p className="text-gray-500 text-center mb-6">
                    Adicione produtos ao seu carrinho para continuar comprando
                  </p>
                  <Link
                    href="/produtos"
                    onClick={handleClose}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Explorar Produtos
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="relative">
                        <Image
                          src={item.produtos?.imagens?.[0] || '/placeholder.jpg'}
                          alt={item.produtos?.nome || 'Produto'}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantidade}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                          {item.produtos?.nome || 'Produto'}
                        </h3>
                        <p className="text-blue-600 font-bold text-lg">
                          R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                        </p>
                        <p className="text-gray-500 text-sm">
                          R$ {item.preco_unitario.toFixed(2)} cada
                        </p>
                      </div>

                      <button
                        onClick={() => removerItem(item.id)}
                        className="p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-full transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer com total e botão */}
            {itens.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-gray-900 font-semibold">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-blue-600 font-bold text-xl">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/carrinho"
                      onClick={handleClose}
                      className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-center block"
                    >
                      Ver Carrinho Completo
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={handleClose}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-center block shadow-lg hover:shadow-xl"
                    >
                      Finalizar Compra
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
