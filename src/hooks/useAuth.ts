'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Player } from '@/lib/supabase/types'

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; player: Player }

export function useAuth() {
  const [state, setState] = useState<AuthState>({ status: 'loading' })
  const supabase = createClient()

  // On mount – check if session already exists
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setState({ status: 'unauthenticated' })
        return
      }

      // Session exists – fetch player record
      const { data: player } = await supabase
        .from('players')
        .select('id, name, created_at, total_races, best_wpm')
        .eq('id', session.user.id)
        .returns<import('@/lib/supabase/types').Player[]>()
        .single()

      if (player) {
        setState({ status: 'authenticated', player })
      } else {
        // Session exists but no player row yet (edge case)
        setState({ status: 'unauthenticated' })
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = useCallback(
    async (name: string, captchaToken: string): Promise<{ error: string | null }> => {
      // 1. Anonymous sign-in with hCaptcha token
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously({
        options: { captchaToken },
      })

      if (authError || !authData.user) {
        return { error: authError?.message ?? 'Sign in failed' }
      }

      // 2. Upsert player record (handles returning users)
      const { data: player, error: playerError } = await supabase
        .from('players')
        .upsert(
          { id: authData.user.id, name },
          { onConflict: 'id', ignoreDuplicates: false }
        )
        .select('id, name, created_at, total_races, best_wpm')
        .returns<import('@/lib/supabase/types').Player[]>()
        .single()

      if (playerError || !player) {
        return { error: playerError?.message ?? 'Failed to save player' }
      }

      setState({ status: 'authenticated', player })
      return { error: null }
    },
    [supabase]
  )

  const updateName = useCallback(
    async (name: string): Promise<{ error: string | null }> => {
      if (state.status !== 'authenticated') return { error: 'Not authenticated' }

      const { error } = await supabase
        .from('players')
        .update({ name })
        .eq('id', state.player.id)

      if (error) return { error: error.message }

      setState({ status: 'authenticated', player: { ...state.player, name } })
      return { error: null }
    },
    [state, supabase]
  )

  return { state, signIn, updateName }
}
