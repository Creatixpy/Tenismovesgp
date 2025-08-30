'use client'

import { Star } from 'lucide-react'

interface EstrelasAvaliacaoProps {
  nota: number
  tamanho?: number
  interativo?: boolean
  onChange?: (nota: number) => void
}

export function EstrelasAvaliacao({
  nota,
  tamanho = 20,
  interativo = false,
  onChange
}: EstrelasAvaliacaoProps) {
  const handleClick = (index: number) => {
    if (interativo && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star - 1)}
          disabled={!interativo}
          className={`${
            interativo ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          } transition-transform`}
        >
          <Star
            size={tamanho}
            className={`${
              star <= nota
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interativo ? 'hover:text-yellow-400' : ''} transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}
