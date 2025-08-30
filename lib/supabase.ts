import { createClient } from '@supabase/supabase-js'

// Configuração usando variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Cliente para server-side operations (com service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey, // Fallback para anon key se service key não estiver disponível
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: string
          nome: string
          email: string
          telefone: string | null
          data_nascimento: string | null
          genero: string | null
          avatar_url: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id: string
          nome: string
          email: string
          telefone?: string | null
          data_nascimento?: string | null
          genero?: string | null
          avatar_url?: string | null
        }
        Update: {
          nome?: string
          telefone?: string | null
          data_nascimento?: string | null
          genero?: string | null
          avatar_url?: string | null
        }
      }
      produtos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          preco: number
          preco_promocional: number | null
          sku: string | null
          estoque: number
          estoque_minimo: number
          categoria_id: string | null
          imagens: string[] | null
          peso: number | null
          altura: number | null
          largura: number | null
          profundidade: number | null
          marca: string | null
          modelo: string | null
          cor: string | null
          tamanho: string | null
          genero: string | null
          material: string | null
          destaque: boolean
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          nome: string
          descricao?: string | null
          preco: number
          preco_promocional?: number | null
          sku?: string | null
          estoque?: number
          estoque_minimo?: number
          categoria_id?: string | null
          imagens?: string[] | null
          peso?: number | null
          altura?: number | null
          largura?: number | null
          profundidade?: number | null
          marca?: string | null
          modelo?: string | null
          cor?: string | null
          tamanho?: string | null
          genero?: string | null
          material?: string | null
          destaque?: boolean
        }
        Update: {
          nome?: string
          descricao?: string | null
          preco?: number
          preco_promocional?: number | null
          estoque?: number
          estoque_minimo?: number
          imagens?: string[] | null
          destaque?: boolean
          ativo?: boolean
        }
      }
      categorias: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          slug: string
          imagem_url: string | null
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          nome: string
          descricao?: string | null
          slug: string
          imagem_url?: string | null
        }
        Update: {
          nome?: string
          descricao?: string | null
          imagem_url?: string | null
          ativo?: boolean
        }
      }
      favoritos: {
        Row: {
          id: string
          usuario_id: string
          produto_id: string
          criado_em: string
        }
        Insert: {
          usuario_id: string
          produto_id: string
        }
        Update: Record<string, never>
      }
      carrinhos: {
        Row: {
          id: string
          usuario_id: string | null
          sessao_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          usuario_id?: string | null
          sessao_id?: string | null
        }
        Update: Record<string, never>
      }
      itens_carrinho: {
        Row: {
          id: string
          carrinho_id: string
          produto_id: string
          variacao_id: string | null
          quantidade: number
          preco_unitario: number
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          carrinho_id: string
          produto_id: string
          variacao_id?: string | null
          quantidade: number
          preco_unitario: number
        }
        Update: {
          quantidade?: number
        }
      }
      pedidos: {
        Row: {
          id: string
          numero_pedido: string
          usuario_id: string | null
          status: string
          valor_subtotal: number
          valor_frete: number
          valor_desconto: number
          valor_total: number
          forma_pagamento: string | null
          endereco_entrega_id: string | null
          endereco_cobranca_id: string | null
          observacoes: string | null
          data_pedido: string
          data_confirmacao: string | null
          data_envio: string | null
          data_entrega: string | null
          codigo_rastreio: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          numero_pedido: string
          usuario_id?: string | null
          status?: string
          valor_subtotal: number
          valor_frete?: number
          valor_desconto?: number
          valor_total: number
          forma_pagamento?: string | null
          endereco_entrega_id?: string | null
          endereco_cobranca_id?: string | null
          observacoes?: string | null
        }
        Update: {
          status?: string
          valor_frete?: number
          valor_desconto?: number
          valor_total?: number
          forma_pagamento?: string | null
          endereco_entrega_id?: string | null
          endereco_cobranca_id?: string | null
          observacoes?: string | null
          data_confirmacao?: string | null
          data_envio?: string | null
          data_entrega?: string | null
          codigo_rastreio?: string | null
        }
      }
      itens_pedido: {
        Row: {
          id: string
          pedido_id: string
          produto_id: string
          variacao_id: string | null
          nome_produto: string
          sku_produto: string | null
          quantidade: number
          preco_unitario: number
          desconto: number
          criado_em: string
        }
        Insert: {
          pedido_id: string
          produto_id: string
          variacao_id?: string | null
          nome_produto: string
          sku_produto?: string | null
          quantidade: number
          preco_unitario: number
          desconto?: number
        }
        Update: Record<string, never>
      }
      enderecos: {
        Row: {
          id: string
          usuario_id: string
          tipo: string
          nome: string | null
          cep: string
          rua: string
          numero: string
          complemento: string | null
          bairro: string
          cidade: string
          estado: string
          pais: string
          padrao: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          usuario_id: string
          tipo?: string
          nome?: string | null
          cep: string
          rua: string
          numero: string
          complemento?: string | null
          bairro: string
          cidade: string
          estado: string
          pais?: string
          padrao?: boolean
        }
        Update: {
          tipo?: string
          nome?: string | null
          cep?: string
          rua?: string
          numero?: string
          complemento?: string | null
          bairro?: string
          cidade?: string
          estado?: string
          pais?: string
          padrao?: boolean
        }
      }
      cupons: {
        Row: {
          id: string
          codigo: string
          descricao: string | null
          tipo_desconto: string
          valor_desconto: number
          valor_minimo: number
          uso_maximo: number | null
          uso_atual: number
          data_inicio: string | null
          data_fim: string | null
          ativo: boolean
          criado_em: string
        }
        Insert: {
          codigo: string
          descricao?: string | null
          tipo_desconto: string
          valor_desconto: number
          valor_minimo?: number
          uso_maximo?: number | null
          uso_atual?: number
          data_inicio?: string | null
          data_fim?: string | null
          ativo?: boolean
        }
        Update: {
          descricao?: string | null
          uso_maximo?: number | null
          uso_atual?: number
          data_inicio?: string | null
          data_fim?: string | null
          ativo?: boolean
        }
      }
      newsletter: {
        Row: {
          id: string
          email: string
          nome: string | null
          ativo: boolean
          criado_em: string
        }
        Insert: {
          email: string
          nome?: string | null
          ativo?: boolean
        }
        Update: {
          nome?: string | null
          ativo?: boolean
        }
      }
      variacoes_produto: {
        Row: {
          id: string
          produto_id: string
          nome: string
          valor: string
          sku: string | null
          preco_adicional: number
          estoque: number
          ativo: boolean
          criado_em: string
        }
        Insert: {
          produto_id: string
          nome: string
          valor: string
          sku?: string | null
          preco_adicional?: number
          estoque?: number
          ativo?: boolean
        }
        Update: {
          nome?: string
          valor?: string
          sku?: string | null
          preco_adicional?: number
          estoque?: number
          ativo?: boolean
        }
      }
      avaliacoes: {
        Row: {
          id: string
          produto_id: string | null
          usuario_id: string | null
          pedido_id: string | null
          nota: number | null
          titulo: string | null
          comentario: string | null
          resposta_loja: string | null
          data_resposta: string | null
          recomendado: boolean | null
          util: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          produto_id?: string | null
          usuario_id?: string | null
          pedido_id?: string | null
          nota?: number | null
          titulo?: string | null
          comentario?: string | null
          resposta_loja?: string | null
          data_resposta?: string | null
          recomendado?: boolean | null
          util?: boolean
        }
        Update: {
          nota?: number | null
          titulo?: string | null
          comentario?: string | null
          resposta_loja?: string | null
          data_resposta?: string | null
          recomendado?: boolean | null
          util?: boolean
        }
      }
    }
  }
}
