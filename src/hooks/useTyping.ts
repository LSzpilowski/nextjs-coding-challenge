'use client'

import { useState, useCallback, useRef } from 'react'
import { calculateWpm } from '@/lib/game/wpm'
import { calculateAccuracy } from '@/lib/game/accuracy'

interface TypingState {
  typedText: string
  wpm: number
  accuracy: number
  isFinished: boolean
  hasStarted: boolean
}

export function useTyping(sentence: string) {
  const [state, setState] = useState<TypingState>({
    typedText: '',
    wpm: 0,
    accuracy: 1,
    isFinished: false,
    hasStarted: false,
  })

  const typingStartedAt = useRef<number | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const typedText = e.target.value

      if (typedText.length > sentence.length) return


      if (typingStartedAt.current === null) {
        typingStartedAt.current = Date.now()
      }

      const elapsedSeconds = (Date.now() - typingStartedAt.current) / 1000
      const wpm = calculateWpm(typedText, sentence, elapsedSeconds)
      const accuracy = calculateAccuracy(typedText, sentence)
      const isFinished = typedText === sentence

      setState({ typedText, wpm, accuracy, isFinished, hasStarted: true })
    },
    [sentence]
  )

  return { ...state, handleChange }
}