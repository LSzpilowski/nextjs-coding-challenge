'use client'

import { useState, useRef, useCallback } from 'react'
import type { Round } from '@/lib/supabase/types'

type RoundState =
  | { status: 'idle' }
  | { status: 'countdown'; count: 3 | 2 | 1 }
  | { status: 'active'; round: Round; secondsLeft: number }
  | { status: 'finished'; round: Round; secondsLeft: number }

const ROUND_DURATION = 60
const COUNTDOWN_START = 3

export function useGameRound() {
  const [state, setState] = useState<RoundState>({ status: 'idle' })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const finishRound = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState((prev) => {
      if (prev.status !== 'active') return prev
      return { status: 'finished', round: prev.round, secondsLeft: prev.secondsLeft }
    })
  }, [])

  const startRound = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)

    const roundPromise = fetch('/api/rounds').then((r) => (r.ok ? r.json() : null))

    let count = COUNTDOWN_START
    setState({ status: 'countdown', count: count as 3 | 2 | 1 })

    timerRef.current = setInterval(async () => {
      count -= 1
      if (count <= 0) {
        clearInterval(timerRef.current!)
        const round: Round | null = await roundPromise
        if (!round) { setState({ status: 'idle' }); return }

        let secondsLeft = ROUND_DURATION
        setState({ status: 'active', round, secondsLeft })

        timerRef.current = setInterval(() => {
          secondsLeft -= 1
          if (secondsLeft <= 0) {
            clearInterval(timerRef.current!)
            setState({ status: 'finished', round, secondsLeft: 0 })
          } else {
            setState({ status: 'active', round, secondsLeft })
          }
        }, 1000)
      } else {
        setState({ status: 'countdown', count: count as 3 | 2 | 1 })
      }
    }, 1000)
  }, [])

  return { state, startRound, finishRound }
}
