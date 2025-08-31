'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// Tipo temporário para imagens_produto até ser adicionado ao Database type
interface ImagemProduto {
  id: string
  produto_id: string
  nome_arquivo: string
  caminho_supabase: string
  url_publica: string
  tamanho_bytes: number | null
  tipo_mime: string | null
  largura: number | null
  altura: number | null
  ordem: number
  principal: boolean
  criado_em: string
  atualizado_em: string
}

interface UploadResult {
  success: boolean
  data?: ImagemProduto
  error?: string
}

interface UseImagensProdutoReturn {
  imagens: ImagemProduto[]
  loading: boolean
  error: string | null
  uploadImagem: (produtoId: string, file: File, principal?: boolean) => Promise<UploadResult>
  deleteImagem: (imagemId: string) => Promise<boolean>
  setImagemPrincipal: (imagemId: string) => Promise<boolean>
  reorderImagens: (produtoId: string, imagemIds: string[]) => Promise<boolean>
  refreshImagens: (produtoId: string) => Promise<void>
}

export function useImagensProduto(produtoId?: string): UseImagensProdutoReturn {
  const [imagens, setImagens] = useState<ImagemProduto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshImagens = useCallback(async (id: string) => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('imagens_produto')
        .select('*')
        .eq('produto_id', id)
        .order('ordem', { ascending: true })

      if (error) throw error

      setImagens(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imagens')
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadImagem = useCallback(async (
    produtoId: string,
    file: File,
    principal: boolean = false
  ): Promise<UploadResult> => {
    try {
      console.log('🚀 Iniciando upload de imagem:', {
        produtoId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        principal
      })

      // Verificar se usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('👤 Status de autenticação:', { user: user?.id, authError })

      if (authError) {
        console.error('❌ Erro de autenticação:', authError)
        return { success: false, error: 'Usuário não autenticado' }
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Arquivo deve ser uma imagem' }
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'Imagem deve ter no máximo 5MB' }
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${produtoId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      console.log('📁 Nome do arquivo gerado:', fileName)

      // Upload para o Supabase Storage
      console.log('📤 Fazendo upload para storage...')
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('produtos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ Erro no upload para storage:', uploadError)
        throw uploadError
      }

      console.log('✅ Upload para storage realizado com sucesso:', uploadData)

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('produtos')
        .getPublicUrl(fileName)

      console.log('🔗 URL pública gerada:', urlData.publicUrl)

      // Obter dimensões da imagem
      console.log('📏 Obtendo dimensões da imagem...')
      const dimensions = await getImageDimensions(file)
      console.log('📐 Dimensões obtidas:', dimensions)

      // Salvar no banco de dados
      console.log('💾 Salvando no banco de dados...')
      const { data, error } = await supabase
        .from('imagens_produto')
        .insert({
          produto_id: produtoId,
          nome_arquivo: file.name,
          caminho_supabase: fileName,
          url_publica: urlData.publicUrl,
          tamanho_bytes: file.size,
          tipo_mime: file.type,
          largura: dimensions.width,
          altura: dimensions.height,
          principal
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao salvar no banco:', error)
        throw error
      }

      console.log('✅ Imagem salva no banco:', data)

      // Se for principal, atualizar outras imagens
      if (principal) {
        console.log('👑 Definindo como imagem principal...')
        // Primeiro, desmarcar todas as outras imagens principais do produto
        const { error: updateError } = await supabase
          .from('imagens_produto')
          .update({ principal: false })
          .eq('produto_id', produtoId)
          .neq('id', data.id)

        if (updateError) {
          console.error('❌ Erro ao desmarcar outras imagens principais:', updateError)
        } else {
          console.log('✅ Outras imagens principais desmarcadas')
        }

        // Depois, marcar esta imagem como principal
        const { error: setPrincipalError } = await supabase
          .from('imagens_produto')
          .update({ principal: true })
          .eq('id', data.id)

        if (setPrincipalError) {
          console.error('❌ Erro ao definir imagem principal:', setPrincipalError)
        } else {
          console.log('✅ Imagem definida como principal')
        }
      }

      // Atualizar lista local
      console.log('🔄 Atualizando lista local...')
      await refreshImagens(produtoId)

      console.log('🎉 Upload concluído com sucesso!')
      return { success: true, data }
    } catch (err) {
      console.error('💥 Erro geral no upload:', err)
      console.error('Stack trace:', err instanceof Error ? err.stack : 'N/A')
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro ao fazer upload da imagem'
      }
    }
  }, [refreshImagens])

  const deleteImagem = useCallback(async (imagemId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Iniciando exclusão de imagem:', imagemId)

      // Verificar se usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('👤 Status de autenticação:', { user: user?.id, authError })

      if (authError) {
        console.error('❌ Erro de autenticação:', authError)
        return false
      }

      // Buscar imagem para obter caminho
      console.log('🔍 Buscando imagem no banco...')
      const { data: imagem, error: fetchError } = await supabase
        .from('imagens_produto')
        .select('caminho_supabase')
        .eq('id', imagemId)
        .single()

      if (fetchError) {
        console.error('❌ Erro ao buscar imagem:', fetchError)
        throw fetchError
      }

      console.log('✅ Imagem encontrada:', imagem)

      // Deletar do storage
      console.log('🗂️ Deletando do storage...')
      const { error: storageError } = await supabase.storage
        .from('produtos')
        .remove([imagem.caminho_supabase])

      if (storageError) {
        console.warn('⚠️ Erro ao deletar do storage (não crítico):', storageError)
        // Não falhar a exclusão por causa do storage
      } else {
        console.log('✅ Arquivo deletado do storage')
      }

      // Deletar do banco
      console.log('💾 Deletando do banco de dados...')
      const { error } = await supabase
        .from('imagens_produto')
        .delete()
        .eq('id', imagemId)

      if (error) {
        console.error('❌ Erro ao deletar do banco:', error)
        throw error
      }

      console.log('✅ Registro deletado do banco')

      // Atualizar lista local
      if (produtoId) {
        console.log('🔄 Atualizando lista local...')
        await refreshImagens(produtoId)
      }

      console.log('🎉 Exclusão concluída com sucesso!')
      return true
    } catch (err) {
      console.error('💥 Erro geral na exclusão:', err)
      console.error('Stack trace:', err instanceof Error ? err.stack : 'N/A')
      setError(err instanceof Error ? err.message : 'Erro ao deletar imagem')
      return false
    }
  }, [produtoId, refreshImagens])

  const setImagemPrincipal = useCallback(async (imagemId: string): Promise<boolean> => {
    try {
      console.log('👑 Definindo imagem como principal:', imagemId)

      // Verificar se usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('👤 Status de autenticação:', { user: user?.id, authError })

      if (authError) {
        console.error('❌ Erro de autenticação:', authError)
        return false
      }

      console.log('⚙️ Executando função RPC set_imagem_principal...')
      const { error } = await supabase.rpc('set_imagem_principal', {
        p_imagem_id: imagemId
      })

      if (error) {
        console.error('❌ Erro na função RPC:', error)
        throw error
      }

      console.log('✅ Função RPC executada com sucesso')

      // Atualizar lista local
      if (produtoId) {
        console.log('🔄 Atualizando lista local...')
        await refreshImagens(produtoId)
      }

      console.log('🎉 Imagem definida como principal!')
      return true
    } catch (err) {
      console.error('💥 Erro ao definir imagem principal:', err)
      console.error('Stack trace:', err instanceof Error ? err.stack : 'N/A')
      setError(err instanceof Error ? err.message : 'Erro ao definir imagem principal')
      return false
    }
  }, [produtoId, refreshImagens])

  const reorderImagens = useCallback(async (produtoId: string, imagemIds: string[]): Promise<boolean> => {
    try {
      console.log('🔄 Reordenando imagens:', { produtoId, imagemIds })

      // Verificar se usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('👤 Status de autenticação:', { user: user?.id, authError })

      if (authError) {
        console.error('❌ Erro de autenticação:', authError)
        return false
      }

      console.log('⚙️ Atualizando ordem das imagens...')
      // Atualizar a ordem de cada imagem
      const updates = imagemIds.map((imagemId, index) =>
        supabase
          .from('imagens_produto')
          .update({ ordem: index })
          .eq('id', imagemId)
          .eq('produto_id', produtoId)
      )

      const results = await Promise.all(updates)

      // Verificar se houve algum erro
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        console.error('❌ Erros ao atualizar ordem:', errors)
        throw new Error('Erro ao reordenar algumas imagens')
      }

      console.log('✅ Ordem das imagens atualizada com sucesso')

      // Atualizar lista local
      console.log('🔄 Atualizando lista local...')
      await refreshImagens(produtoId)

      console.log('🎉 Reordenação concluída!')
      return true
    } catch (err) {
      console.error('💥 Erro ao reordenar imagens:', err)
      console.error('Stack trace:', err instanceof Error ? err.stack : 'N/A')
      setError(err instanceof Error ? err.message : 'Erro ao reordenar imagens')
      return false
    }
  }, [refreshImagens])

  return {
    imagens,
    loading,
    error,
    uploadImagem,
    deleteImagem,
    setImagemPrincipal,
    reorderImagens,
    refreshImagens
  }
}

// Função auxiliar para obter dimensões da imagem
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error('Erro ao obter dimensões da imagem'))
    }
    img.src = URL.createObjectURL(file)
  })
}
