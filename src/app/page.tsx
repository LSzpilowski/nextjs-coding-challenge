'use client'

import { PlayerNameModal } from '@/components/game/PlayerNameModal'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { state, signIn } = useAuth()

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {state.status === 'unauthenticated' && <PlayerNameModal onSubmit={signIn} />}

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {state.status === 'authenticated' && (
          <p className="text-sm text-zinc-500">
            Playing as <span className="font-semibold text-zinc-900 dark:text-zinc-100">{state.player.name}</span>
          </p>
        )}
        {/* Will setup in next branches */}
      </main>
    </div>
  )
}
