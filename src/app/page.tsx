'use client'

import { PlayerNameModal } from '@/components/game/PlayerNameModal'
import { RoundTimer } from '@/components/game/RoundTimer'
import { SentenceDisplay } from '@/components/game/SentenceDisplay'
import { TypingInput } from '@/components/game/TypingInput'
import { useAuth } from '@/hooks/useAuth'
import { useGameRound } from '@/hooks/useGameRound'
import { useTyping } from '@/hooks/useTyping'

function GameArea({ sentence }: { sentence: string }) {
  const { typedText, wpm, accuracy, isFinished, hasStarted, handleChange } = useTyping(sentence)

  return (
    <div className="space-y-4">
      <SentenceDisplay sentence={sentence} typedText={typedText} />
      <TypingInput value={typedText} onChange={handleChange} disabled={isFinished} />
      {!hasStarted ? (
        <p className="text-sm text-gray-400 italic">Start typing to begin your timer…</p>
      ) : (
        <div className="flex gap-6 text-sm text-gray-500">
          <span>
            WPM: <span className="font-semibold text-gray-900 dark:text-gray-100">{wpm}</span>
          </span>
          <span>
            Accuracy:{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(accuracy * 100)}%
            </span>
          </span>
          {isFinished && (
            <span className="font-semibold text-green-600 dark:text-green-400">Finished!</span>
          )}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { state: authState, signIn } = useAuth()
  const roundState = useGameRound()

  if (authState.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {authState.status === 'unauthenticated' && <PlayerNameModal onSubmit={signIn} />}

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">TypeRace</h1>
          {authState.status === 'authenticated' && (
            <p className="text-sm text-gray-500">
              Playing as{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {authState.player.name}
              </span>
            </p>
          )}
        </div>

        {roundState.status === 'loading' && <p className="text-gray-400">Loading round...</p>}
        {roundState.status === 'error' && <p className="text-gray-400">{roundState.message}</p>}
        {roundState.status === 'finished' && (
          <p className="text-gray-400">Round finished. Waiting for next round...</p>
        )}

        {roundState.status === 'active' && (
          <div className="space-y-4">
            <RoundTimer secondsLeft={roundState.secondsLeft} />
            <GameArea sentence={roundState.round.sentence} />
          </div>
        )}
      </main>
    </div>
  )
}
