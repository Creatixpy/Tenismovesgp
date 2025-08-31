import { supabase } from '@/lib/supabase'

export async function verificarConfiguracaoSupabase() {
  try {
    console.log('🔍 Verificando configuração do Supabase...')

    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('📋 Variáveis de ambiente:', {
      url: supabaseUrl ? '✅ Definida' : '❌ Ausente',
      anonKey: supabaseAnonKey ? '✅ Definida' : '❌ Ausente',
      serviceKey: supabaseServiceKey ? '✅ Definida' : '❌ Ausente'
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Variáveis de ambiente obrigatórias não encontradas')
      return false
    }

    // Testar conexão básica
    const { error } = await supabase.from('produtos').select('count').limit(1)

    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error)
      return false
    }

    console.log('✅ Conexão com Supabase estabelecida com sucesso')
    return true
  } catch (error) {
    console.error('💥 Erro ao verificar configuração do Supabase:', error)
    return false
  }
}
