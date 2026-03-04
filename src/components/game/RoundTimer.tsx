'use client'

interface RoundTimerProps {
  secondsLeft: number
}

export function RoundTimer({ secondsLeft }: RoundTimerProps) {
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isUrgent = secondsLeft > 0 && secondsLeft <= 10

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-zinc-500">Time left</span>
      <span
        className={`font-mono text-2xl font-bold tabular-nums transition-colors ${
          isUrgent ? 'text-red-500' : 'text-zinc-900 dark:text-zinc-100'
        }`}
      >
        {secondsLeft === 0
          ? '0:00'
          : minutes > 0
            ? `${minutes}:${String(seconds).padStart(2, '0')}`
            : `${seconds}s`}
      </span>
    </div>
  )
}
