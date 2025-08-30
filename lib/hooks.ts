import { useEffect, useState, useCallback, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { CarrinhoContext } from '@/lib/CarrinhoContext'

// Tipos
type Produto = Database['public']['Tables']['produtos']['Row'] & {
  categorias?: {
    nome: string
    slug: string
  }
}
type ProdutoComAvaliacoes = Produto & {
  mediaAvaliacoes: number
  quantidadeAvaliacoes: number
}
type Categoria = Database['public']['Tables']['categorias']['Row']
type Avaliacao = Database['public']['Tables']['avaliacoes']['Row'] & {
  perfis?: {
    nome: string
    avatar_url: string | null
  }
}

// Hook para buscar produtos
export function useProdutos(categoriaId?: string, limite = 20) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true)
        let query = supabase
          .from('produtos')
          .select(`
            *,
            categorias (
              nome,
              slug
            )
          `)
          .eq('ativo', true)
          .order('criado_em', { ascending: false })
          .limit(limite)

        if (categoriaId) {
          query = query.eq('categoria_id', categoriaId)
        }

        const { data, error } = await query

        if (error) {
          setError(error.message)
        } else {
          setProdutos(data || [])
        }
      } catch {
        setError('Erro ao carregar produtos')
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [categoriaId, limite])

  return { produtos, loading, error }
}

// Hook para buscar produtos em destaque (melhores avaliados)
export function useProdutosDestaques(limite = 6) {
  const [produtos, setProdutos] = useState<ProdutoComAvaliacoes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProdutosDestaques() {
      try {
        setLoading(true)
        
        // Buscar produtos com suas avaliações e calcular média
        const { data, error } = await supabase
          .from('produtos')
          .select(`
            *,
            categorias (
              nome,
              slug
            ),
            avaliacoes (
              nota
            )
          `)
          .eq('ativo', true)
          .limit(limite * 2) // Buscar mais para ter margem de seleção

        if (error) {
          setError(error.message)
          return
        }

        // Calcular média das avaliações para cada produto
        const produtosComMedia = (data || []).map(produto => {
          const notas = produto.avaliacoes?.map((av: { nota: number | null }) => av.nota).filter((nota: number | null): nota is number => nota !== null) || []
          const mediaAvaliacoes = notas.length > 0 ? notas.reduce((sum: number, nota: number) => sum + nota, 0) / notas.length : 0
          const quantidadeAvaliacoes = notas.length
          
          return {
            ...produto,
            mediaAvaliacoes,
            quantidadeAvaliacoes
          }
        })

        // Ordenar por média de avaliações (decrescente) e depois por quantidade de avaliações
        const produtosOrdenados = produtosComMedia
          .sort((a, b) => {
            if (b.mediaAvaliacoes !== a.mediaAvaliacoes) {
              return b.mediaAvaliacoes - a.mediaAvaliacoes
            }
            return b.quantidadeAvaliacoes - a.quantidadeAvaliacoes
          })
          .slice(0, limite)

        setProdutos(produtosOrdenados)
      } catch {
        setError('Erro ao carregar produtos em destaque')
      } finally {
        setLoading(false)
      }
    }

    fetchProdutosDestaques()
  }, [limite])

  return { produtos, loading, error }
}

// Hook para buscar categorias
export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategorias() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('categorias')
          .select('*')
          .order('nome')

        if (error) {
          setError(error.message)
        } else {
          setCategorias(data || [])
        }
      } catch {
        setError('Erro ao carregar categorias')
      } finally {
        setLoading(false)
      }
    }

    fetchCategorias()
  }, [])

  return { categorias, loading, error }
}

// Hook para autenticação centralizada
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar usuário atual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}

// Hook para carrinho usando contexto global
export function useCarrinho() {
  const context = useContext(CarrinhoContext)
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider')
  }
  return context
}

// Hook para favoritos
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()

  // Buscar favoritos
  const fetchFavoritos = useCallback(async () => {
    try {
      if (authLoading || !user) {
        setFavoritos([])
        return
      }

      const { data, error } = await supabase
        .from('favoritos')
        .select('produto_id')
        .eq('usuario_id', user.id)

      if (error) {
        console.error('Erro ao buscar favoritos:', error)
        return
      }

      setFavoritos(data?.map(f => f.produto_id) || [])
    } catch (err) {
      console.error('Erro geral ao buscar favoritos:', err)
    }
  }, [user, authLoading])

  // Buscar favoritos quando autenticação estiver pronta
  useEffect(() => {
    if (!authLoading) {
      fetchFavoritos()
    }
  }, [authLoading, fetchFavoritos])

  // Adicionar aos favoritos
  const adicionarFavorito = useCallback(async (produtoId: string) => {
    try {
      setLoading(true)

      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      // 🔧 CORREÇÃO: Verificar e criar perfil se necessário
      const { error: perfilError } = await supabase
        .from('perfis')
        .select('id')
        .eq('id', user.id)
        .single()

      if (perfilError && perfilError.code === 'PGRST116') {
        const { error: createPerfilError } = await supabase
          .from('perfis')
          .insert({
            id: user.id,
            nome: user.user_metadata?.nome || user.email || 'Usuário',
            email: user.email || ''
          })

        if (createPerfilError) {
          throw new Error('Erro ao criar perfil do usuário')
        }
      }

      const { error } = await supabase
        .from('favoritos')
        .upsert({
          usuario_id: user.id,
          produto_id: produtoId
        }, {
          onConflict: 'usuario_id,produto_id'
        })

      if (error) {
        console.error('Erro ao adicionar favorito:', error)
        throw new Error('Erro ao adicionar aos favoritos')
      }

      await fetchFavoritos()
    } catch (err) {
      console.error('Erro geral ao adicionar favorito:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user, fetchFavoritos])

  // Remover dos favoritos
  const removerFavorito = useCallback(async (produtoId: string) => {
    try {
      setLoading(true)

      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', user.id)
        .eq('produto_id', produtoId)

      if (error) {
        console.error('Erro ao remover favorito:', error)
        throw new Error('Erro ao remover dos favoritos')
      }

      await fetchFavoritos()
    } catch (err) {
      console.error('Erro geral ao remover favorito:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user, fetchFavoritos])

  // Verificar se produto está nos favoritos
  const isFavorito = (produtoId: string) => {
    return favoritos.includes(produtoId)
  }

  // Toggle favorito (adicionar/remover)
  const toggleFavorito = async (produtoId: string) => {
    if (isFavorito(produtoId)) {
      await removerFavorito(produtoId)
    } else {
      await adicionarFavorito(produtoId)
    }
  }

  return {
    favoritos,
    loading,
    adicionarFavorito,
    removerFavorito,
    isFavorito,
    toggleFavorito,
    fetchFavoritos
  }
}

// Hook para avaliações
export function useAvaliacoes(produtoId?: string) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar avaliações
  const fetchAvaliacoes = useCallback(async (id?: string) => {
    try {
      setLoading(true)
      const produtoIdToUse = id || produtoId
      if (!produtoIdToUse) return

      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          perfis (
            nome,
            avatar_url
          )
        `)
        .eq('produto_id', produtoIdToUse)
        .order('criado_em', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setAvaliacoes(data || [])
      }
    } catch {
      setError('Erro ao carregar avaliações')
    } finally {
      setLoading(false)
    }
  }, [produtoId])

  // Verificar se usuário já avaliou o produto
  const verificarAvaliacaoUsuario = useCallback(async (produtoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('produto_id', produtoId)
        .eq('usuario_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar avaliação:', error)
        return null
      }
      return data || null
    } catch (err) {
      console.error('Erro geral ao verificar avaliação:', err)
      return null
    }
  }, [])

  useEffect(() => {
    if (produtoId) {
      fetchAvaliacoes()
    }
  }, [produtoId, fetchAvaliacoes])

  return {
    avaliacoes,
    loading,
    error,
    fetchAvaliacoes,
    verificarAvaliacaoUsuario
  }
}

// Hook para produto específico
export function useProduto(id: string) {
  const [produto, setProduto] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduto() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('produtos')
          .select(`
            *,
            categorias (
              nome,
              slug
            )
          `)
          .eq('id', id)
          .eq('ativo', true)
          .single()

        if (error) {
          setError(error.message)
        } else {
          setProduto(data)
        }
      } catch {
        setError('Erro ao carregar produto')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduto()
    }
  }, [id])

  return { produto, loading, error }
}
