'use client'

import { PlayerNameModal } from '@/components/game/PlayerNameModal'
import { RoundTimer } from '@/components/game/RoundTimer'
import { useAuth } from '@/hooks/useAuth'
import { useGameRound } from '@/hooks/useGameRound'

export default function Home() {
  const { state: authState, signIn } = useAuth()
  const roundState = useGameRound()

  if (authState.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {authState.status === 'unauthenticated' && <PlayerNameModal onSubmit={signIn} />}

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            TypeRace
          </h1>
          {authState.status === 'authenticated' && (
            <p className="text-sm text-zinc-500">
              Playing as{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {authState.player.name}
              </span>
            </p>
          )}
        </div>

        {roundState.status === 'loading' && (
          <p className="text-zinc-400">Loading round...</p>
        )}

        {roundState.status === 'error' && (
          <p className="text-zinc-400">{roundState.message}</p>
        )}

        {roundState.status === 'finished' && (
          <p className="text-zinc-400">Round finished. Waiting for next round...</p>
        )}

        {roundState.status === 'active' && (
          <div className="space-y-4">
            <RoundTimer secondsLeft={roundState.secondsLeft} />
            <p className="text-zinc-500 text-sm">
              Sentence:{' '}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {roundState.round.sentence}
              </span>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
