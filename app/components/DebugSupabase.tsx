'use client'

import { useState } from 'react'
import { verificarConfiguracaoSupabase } from '@/lib/test-supabase'

export default function DebugSupabase() {
  const [resultado, setResultado] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleVerificar = async () => {
    setLoading(true)
    setResultado('🔍 Verificando configuração...\n')

    try {
      const sucesso = await verificarConfiguracaoSupabase()
      if (sucesso) {
        setResultado(prev => prev + '✅ Configuração OK! O upload deve funcionar.\n')
      } else {
        setResultado(prev => prev + '❌ Problemas encontrados. Verifique os logs no console.\n')
      }
    } catch (error) {
      setResultado(prev => prev + `💥 Erro: ${error}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🔧 Debug Supabase</h3>
      <button
        onClick={handleVerificar}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loading ? 'Verificando...' : 'Verificar Configuração'}
      </button>

      {resultado && (
        <pre className="mt-4 p-4 bg-white rounded border text-sm whitespace-pre-wrap">
          {resultado}
        </pre>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>📋 Este componente verifica:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Status de autenticação</li>
          <li>Existência da tabela imagens_produto</li>
          <li>Existência do bucket produtos</li>
          <li>Função RPC set_imagem_principal</li>
          <li>Função RPC reorder_imagens_produto</li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          💡 Abra o console do navegador (F12) para ver logs detalhados das operações.
        </p>
      </div>
    </div>
  )
}
