import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Extrair token do cabeçalho Authorization
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      )
    }

    // Criar cliente Supabase com o token do usuário
    const supabaseWithAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    // Verificar o usuário com o token
    const { data: { user }, error: authError } = await supabaseWithAuth.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { produto_id, nota, titulo, comentario, recomendado } = body

    // Validações
    if (!produto_id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    if (!nota || nota < 1 || nota > 5) {
      return NextResponse.json(
        { error: 'Nota deve ser entre 1 e 5' },
        { status: 400 }
      )
    }

    // Verificar se o produto existe
    const { data: produto, error: produtoError } = await supabaseWithAuth
      .from('produtos')
      .select('id')
      .eq('id', produto_id)
      .eq('ativo', true)
      .single()

    if (produtoError || !produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se usuário já avaliou este produto
    const { data: avaliacaoExistente } = await supabaseWithAuth
      .from('avaliacoes')
      .select('id')
      .eq('produto_id', produto_id)
      .eq('usuario_id', user.id)
      .single()

    let result

    if (avaliacaoExistente) {
      // Atualizar avaliação existente
      const { data, error } = await supabaseWithAuth
        .from('avaliacoes')
        .update({
          nota,
          titulo,
          comentario,
          recomendado,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', avaliacaoExistente.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Criar nova avaliação
      const { data, error } = await supabaseWithAuth
        .from('avaliacoes')
        .insert({
          produto_id,
          usuario_id: user.id,
          nota,
          titulo,
          comentario,
          recomendado
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const produtoId = searchParams.get('produto_id')

    if (!produtoId) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('avaliacoes')
      .select(`
        *,
        perfis (
          nome,
          avatar_url
        )
      `)
      .eq('produto_id', produtoId)
      .order('criado_em', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
