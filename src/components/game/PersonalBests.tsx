'use client'

interface PersonalBestsProps {
  bestWpm: number | null
  bestPerfectWpm: number | null
}

export function PersonalBests({ bestWpm, bestPerfectWpm }: PersonalBestsProps) {
  return (
    <div className="flex gap-8 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Your best</p>
        <p className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {bestWpm !== null ? `${bestWpm} WPM` : '—'}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Your best without an error
        </p>
        <p className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {bestPerfectWpm !== null ? `${bestPerfectWpm} WPM` : '—'}
        </p>
      </div>
    </div>
  )
}
