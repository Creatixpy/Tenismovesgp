'use client'

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import { useAuth } from './hooks'

type ItemCarrinho = Database['public']['Tables']['itens_carrinho']['Row'] & {
  produtos: {
    nome: string
    preco: number
    imagens_produto: {
      url_publica: string
    }[]
  } | null
}

interface CarrinhoContextType {
  itens: ItemCarrinho[]
  loading: boolean
  adicionarItem: (produtoId: string, quantidade?: number) => Promise<void>
  removerItem: (itemId: string) => Promise<void>
  fetchCarrinho: () => Promise<void>
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined)

export { CarrinhoContext }

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()

  // Buscar itens do carrinho
  const fetchCarrinho = useCallback(async () => {
    try {
      if (authLoading || !user) {
        setItens([])
        return
      }

      // Verificar se existe um carrinho para este usuário
      const { data: carrinhoExistente, error: buscaError } = await supabase
        .from('carrinhos')
        .select('id')
        .eq('usuario_id', user.id)
        .maybeSingle()

      if (buscaError && buscaError.code !== 'PGRST116') {
        console.error('Erro ao buscar carrinho:', buscaError)
        setItens([])
        return
      }

      if (!carrinhoExistente) {
        setItens([])
        return
      }

      // Buscar itens do carrinho
      const { data: itensCarrinho, error: itensError } = await supabase
        .from('itens_carrinho')
        .select(`
          id,
          carrinho_id,
          produto_id,
          quantidade,
          preco_unitario,
          criado_em,
          produtos!inner (
            nome,
            preco
          ),
          produtos.imagens_produto!inner (
            url_publica
          )
        `)
        .eq('carrinho_id', carrinhoExistente.id)
        .eq('produtos.imagens_produto.principal', true)

      if (itensError) {
        console.error('Erro ao buscar itens do carrinho:', itensError)
        setItens([])
        return
      }

      setItens((itensCarrinho || []) as unknown as ItemCarrinho[])
    } catch (error) {
      console.error('Erro geral ao buscar carrinho:', error)
      setItens([])
    }
  }, [user, authLoading])

  // Adicionar item ao carrinho
  const adicionarItem = useCallback(async (produtoId: string, quantidade: number = 1) => {
    try {
      setLoading(true)

      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar produto para obter preço
      const { data: produto, error: produtoError } = await supabase
        .from('produtos')
        .select('id, preco')
        .eq('id', produtoId)
        .eq('ativo', true)
        .single()

      if (produtoError || !produto) {
        throw new Error('Produto não encontrado ou inativo')
      }

      if (!produto.preco || produto.preco <= 0) {
        throw new Error('Produto sem preço válido')
      }

      // Verificar se existe um carrinho para este usuário
      let carrinhoId: string

      const { data: carrinhoExistente, error: buscaCarrinhoError } = await supabase
        .from('carrinhos')
        .select('id')
        .eq('usuario_id', user.id)
        .maybeSingle()

      if (buscaCarrinhoError && buscaCarrinhoError.code !== 'PGRST116') {
        // PGRST116 é o código para "não encontrado", que é esperado quando não há carrinho
        console.error('Erro ao buscar carrinho:', buscaCarrinhoError)
        throw new Error('Erro ao buscar carrinho existente')
      }

      if (!carrinhoExistente) {
        const { data: novoCarrinho, error: createError } = await supabase
          .from('carrinhos')
          .insert({
            usuario_id: user.id,
            sessao_id: null
          })
          .select('id')
          .single()

        if (createError) {
          throw new Error('Erro ao criar carrinho')
        }

        carrinhoId = novoCarrinho.id
      } else {
        carrinhoId = carrinhoExistente.id
      }

      // Verificar se item já existe no carrinho
      const { data: itemExistente, error: itemError } = await supabase
        .from('itens_carrinho')
        .select('id, quantidade')
        .eq('carrinho_id', carrinhoId)
        .eq('produto_id', produtoId)
        .maybeSingle()

      if (itemError && itemError.code !== 'PGRST116') {
        console.error('Erro ao verificar item existente:', itemError)
        throw new Error('Erro ao verificar item no carrinho')
      }

      if (itemExistente) {
        // Atualizar quantidade
        const { error: updateError } = await supabase
          .from('itens_carrinho')
          .update({ quantidade: itemExistente.quantidade + quantidade })
          .eq('id', itemExistente.id)

        if (updateError) {
          throw new Error('Erro ao atualizar item no carrinho')
        }
      } else {
        // Inserir novo item
        const { error: insertError } = await supabase
          .from('itens_carrinho')
          .insert({
            carrinho_id: carrinhoId,
            produto_id: produtoId,
            quantidade,
            preco_unitario: produto.preco
          })

        if (insertError) {
          throw new Error('Erro ao adicionar item ao carrinho')
        }
      }

      await fetchCarrinho()
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [user, fetchCarrinho])

  // Remover item do carrinho
  const removerItem = useCallback(async (itemId: string) => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from('itens_carrinho')
        .delete()
        .eq('id', itemId)

      if (error) {
        throw new Error('Erro ao remover item do carrinho')
      }

      await fetchCarrinho()
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchCarrinho])

  // Buscar carrinho quando autenticação estiver pronta
  useEffect(() => {
    if (!authLoading && user) {
      fetchCarrinho()
    } else if (!authLoading && !user) {
      setItens([])
    }
  }, [authLoading, user, fetchCarrinho])

  const value = {
    itens,
    loading,
    adicionarItem,
    removerItem,
    fetchCarrinho
  }

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  )
}
