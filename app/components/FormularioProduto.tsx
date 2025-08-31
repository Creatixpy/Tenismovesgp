'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import GerenciadorImagens from '@/app/components/GerenciadorImagens'

interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  sku: string
  ativo: boolean
}

interface FormularioProdutoProps {
  produto?: Produto
  onSave: (produto: Produto) => void
  onCancel: () => void
}

export default function FormularioProduto({ produto, onSave, onCancel }: FormularioProdutoProps) {
  const [formData, setFormData] = useState<Produto>(
    produto || {
      id: '',
      nome: '',
      descricao: '',
      preco: 0,
      sku: '',
      ativo: true
    }
  )
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validações básicas
      const newErrors: Record<string, string> = {}

      if (!formData.nome.trim()) {
        newErrors.nome = 'Nome é obrigatório'
      }

      if (formData.preco <= 0) {
        newErrors.preco = 'Preço deve ser maior que zero'
      }

      if (!formData.sku.trim()) {
        newErrors.sku = 'SKU é obrigatório'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      // Salvar produto
      const produtoData = {
        ...formData,
        preco: Number(formData.preco)
      }

      let savedProduto: Produto

      if (produto?.id) {
        // Atualizar
        const { data, error } = await supabase
          .from('produtos')
          .update(produtoData)
          .eq('id', produto.id)
          .select()
          .single()

        if (error) throw error
        savedProduto = data
      } else {
        // Criar novo
        const { data, error } = await supabase
          .from('produtos')
          .insert(produtoData)
          .select()
          .single()

        if (error) throw error
        savedProduto = data
      }

      onSave(savedProduto)
    } catch (err) {
      console.error('Erro ao salvar produto:', err)
      setErrors({ geral: 'Erro ao salvar produto. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Produto, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {produto ? 'Editar Produto' : 'Novo Produto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nome ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o nome do produto"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.sku ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Código único do produto"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição detalhada do produto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.preco}
                onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.preco ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.preco && (
                <p className="mt-1 text-sm text-red-600">{errors.preco}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => handleInputChange('ativo', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ativo" className="ml-2 text-sm text-gray-700">
                  Produto ativo
                </label>
              </div>
            </div>
          </div>

          {/* Gerenciador de Imagens */}
          {produto?.id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Imagens do Produto
              </label>
              <GerenciadorImagens
                produtoId={produto.id}
              />
            </div>
          )}

          {errors.geral && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{errors.geral}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                produto ? 'Atualizar Produto' : 'Criar Produto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
