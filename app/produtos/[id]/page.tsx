'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { CarrinhoFlutuante } from "@/app/components/CarrinhoFlutuante"
import { ListaAvaliacoes } from "@/app/components/ListaAvaliacoes"
import { FormularioAvaliacao } from "@/app/components/FormularioAvaliacao"
import { useProduto, useCarrinho, useFavoritos, useAvaliacoes } from '@/lib/hooks'

export default function ProdutoDetalhes() {
  const params = useParams()
  const produtoId = params.id as string
  const { produto, loading, error } = useProduto(produtoId)
  const { adicionarItem } = useCarrinho()
  const { isFavorito, toggleFavorito } = useFavoritos()
  const { avaliacoes, loading: loadingAvaliacoes, fetchAvaliacoes, verificarAvaliacaoUsuario } = useAvaliacoes(produtoId)
  const [quantidade, setQuantidade] = useState(1)
  const [imagemSelecionada, setImagemSelecionada] = useState(0)
  const [avaliacaoUsuario, setAvaliacaoUsuario] = useState(null)
  const [adicionandoProduto, setAdicionandoProduto] = useState(false)
  const [erroCarrinho, setErroCarrinho] = useState<string | null>(null)

  useEffect(() => {
    if (produtoId) {
      verificarAvaliacaoUsuario(produtoId).then(setAvaliacaoUsuario)
    }
  }, [produtoId, verificarAvaliacaoUsuario])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Carregando produto...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !produto) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
            <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
            <Link
              href="/produtos"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar aos Produtos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAdicionarCarrinho = async () => {
    try {
      setAdicionandoProduto(true)
      setErroCarrinho(null)
      await adicionarItem(produto.id, quantidade)
      // Feedback visual poderia ser adicionado aqui
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error)
      setErroCarrinho(error instanceof Error ? error.message : 'Erro ao adicionar item ao carrinho')
    } finally {
      setAdicionandoProduto(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Início
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href="/produtos" className="text-gray-400 hover:text-gray-500">
                  Produtos
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-500">{produto.nome}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Produto Detalhes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagens do Produto */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {produto.imagens && produto.imagens.length > 0 ? (
                <Image
                  src={produto.imagens[imagemSelecionada].url_publica}
                  alt={produto.nome}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Sem imagem</span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {produto.imagens && produto.imagens.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {produto.imagens.map((imagem: {id: string, url_publica: string}, index: number) => (
                  <button
                    key={imagem.id}
                    onClick={() => setImagemSelecionada(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      imagemSelecionada === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={imagem.url_publica}
                      alt={`${produto.nome} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{produto.nome}</h1>
              <p className="text-gray-600">{produto.categorias?.nome || 'Sem categoria'}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                R$ {produto.preco.toFixed(2)}
              </span>
              {produto.preco_promocional && (
                <span className="text-xl text-gray-500 line-through">
                  R$ {produto.preco_promocional.toFixed(2)}
                </span>
              )}
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">{produto.descricao || 'Sem descrição disponível.'}</p>
            </div>

            {/* Especificações */}
            <div className="space-y-4">
              {produto.cor && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Cor</h3>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                      style={{backgroundColor: produto.cor.toLowerCase()}}
                    ></div>
                    <span className="text-sm text-gray-600 capitalize">{produto.cor}</span>
                  </div>
                </div>
              )}

              {produto.tamanho && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tamanho</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {produto.tamanho}
                  </span>
                </div>
              )}
            </div>

            {/* Quantidade e Adicionar ao Carrinho */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantidade</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantidade}</span>
                  <button
                    onClick={() => setQuantidade(quantidade + 1)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdicionarCarrinho}
                disabled={adicionandoProduto}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
              >
                {adicionandoProduto ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </button>
              {erroCarrinho && (
                <p className="text-red-500 text-sm mt-2">{erroCarrinho}</p>
              )}
            </div>

            {/* Ações Adicionais */}
            <div className="flex space-x-4">
              <button
                onClick={() => toggleFavorito(produto.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  isFavorito(produto.id)
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isFavorito(produto.id) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isFavorito(produto.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Avaliações */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Avaliações dos Clientes</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Avaliações */}
            <div className="lg:col-span-2">
              <ListaAvaliacoes
                avaliacoes={avaliacoes}
                loading={loadingAvaliacoes}
              />
            </div>

            {/* Formulário de Avaliação */}
            <div className="lg:col-span-1">
              <FormularioAvaliacao
                produtoId={produtoId}
                onAvaliacaoCriada={() => {
                  fetchAvaliacoes()
                  verificarAvaliacaoUsuario(produtoId).then(setAvaliacaoUsuario)
                }}
                avaliacaoExistente={avaliacaoUsuario}
              />
            </div>
          </div>
        </div>
      </div>

      <CarrinhoFlutuante />
      <Footer />
    </div>
  )
}
