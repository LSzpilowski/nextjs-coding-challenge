'use client'

import { useState, useEffect, useRef } from 'react'
import type { Round } from '@/lib/supabase/types'

type RoundState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'active'; round: Round; secondsLeft: number }
  | { status: 'finished'; round: Round }

export function useGameRound() {
  const [state, setState] = useState<RoundState>({ status: 'loading' })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchRoundRef = useRef<() => Promise<void>>(async () => {})

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (pollRef.current) clearTimeout(pollRef.current)
  }

  useEffect(() => {
    fetchRoundRef.current = async () => {
      try {
        const res = await fetch('/api/rounds')

        if (!res.ok) {
          setState({ status: 'error', message: 'Waiting for next round...' })
          pollRef.current = setTimeout(() => fetchRoundRef.current(), 3000)
          return
        }

        const round: Round = await res.json()
        const endsAt = new Date(round.ends_at).getTime()
        const now = Date.now()
        const secondsLeft = Math.max(0, Math.floor((endsAt - now) / 1000))

        if (secondsLeft <= 0) {
          setState({ status: 'finished', round })
          pollRef.current = setTimeout(() => fetchRoundRef.current(), 3000)
          return
        }

        setState({ status: 'active', round, secondsLeft })

        clearInterval(timerRef.current!)
        timerRef.current = setInterval(() => {
          setState((prev) => {
            if (prev.status !== 'active') return prev

            const newSeconds = prev.secondsLeft - 1

            if (newSeconds <= 0) {
              clearInterval(timerRef.current!)
              pollRef.current = setTimeout(() => fetchRoundRef.current(), 2000)
              return { status: 'finished', round: prev.round }
            }

            return { ...prev, secondsLeft: newSeconds }
          })
        }, 1000)
      } catch {
        setState({ status: 'error', message: 'Failed to connect. Retrying...' })
        pollRef.current = setTimeout(() => fetchRoundRef.current(), 3000)
      }
    }

    fetchRoundRef.current()

    return clearTimers
  }, [])

  return state
}
