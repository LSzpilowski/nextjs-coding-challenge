'use client'

import { Button } from '@/components/ui/button'
import { PersonalBests } from '@/components/game/PersonalBests'
import { PlayerNameModal } from '@/components/game/PlayerNameModal'
import { RoundTimer } from '@/components/game/RoundTimer'
import { SentenceDisplay } from '@/components/game/SentenceDisplay'
import { TypingInput } from '@/components/game/TypingInput'
import { useAuth } from '@/hooks/useAuth'
import { useGameRound } from '@/hooks/useGameRound'
import { usePersonalBests } from '@/hooks/usePersonalBests'
import { useTyping } from '@/hooks/useTyping'

function GameArea({
  sentence,
  onFinish,
  onResult,
  frozen,
}: {
  sentence: string
  onFinish: () => void
  onResult: (wpm: number, hadError: boolean) => void
  frozen: boolean
}) {
  const { typedText, wpm, accuracy, isFinished, hasStarted, handleChange } = useTyping(
    sentence,
    (finalWpm, hadError) => {
      onResult(finalWpm, hadError)
      onFinish()
    }
  )

  return (
    <div className="space-y-4">
      <SentenceDisplay sentence={sentence} typedText={typedText} />
      <TypingInput
        value={typedText}
        onChange={handleChange}
        disabled={isFinished || frozen}
      />
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
  const { state: roundState, startRound, finishRound } = useGameRound()
  const { bests, recordResult } = usePersonalBests()

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

        <div className="flex items-center justify-between">
          <RoundTimer
            secondsLeft={
              roundState.status === 'active' || roundState.status === 'finished'
                ? roundState.secondsLeft
                : 0
            }
          />
          <Button
            onClick={startRound}
            disabled={roundState.status === 'active' || roundState.status === 'countdown'}
            variant="default"
            size="sm"
          >
            New Round
          </Button>
        </div>

        {roundState.status === 'countdown' && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-8xl font-bold text-zinc-900 dark:text-zinc-100">
              {roundState.count}
            </span>
          </div>
        )}

        {(roundState.status === 'active' || roundState.status === 'finished') && (
          <GameArea
            key={roundState.round.id}
            sentence={roundState.round.sentence}
            onFinish={finishRound}
            onResult={recordResult}
            frozen={roundState.status === 'finished'}
          />
        )}

        <PersonalBests bestWpm={bests.bestWpm} bestPerfectWpm={bests.bestPerfectWpm} />
      </main>
    </div>
  )
}
