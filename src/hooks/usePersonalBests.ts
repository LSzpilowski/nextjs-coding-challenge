'use client'

import { useState, useCallback } from 'react'

interface PersonalBests {
  bestWpm: number | null
  bestPerfectWpm: number | null
}

const STORAGE_KEY = 'typerace:personal_bests'

function load(): PersonalBests {
  if (typeof window === 'undefined') return { bestWpm: null, bestPerfectWpm: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PersonalBests) : { bestWpm: null, bestPerfectWpm: null }
  } catch {
    return { bestWpm: null, bestPerfectWpm: null }
  }
}

function save(bests: PersonalBests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bests))
}

export function usePersonalBests() {
  const [bests, setBests] = useState<PersonalBests>(load)

  const recordResult = useCallback((wpm: number, hadError: boolean) => {
    setBests((prev) => {
      const next: PersonalBests = {
        bestWpm: prev.bestWpm === null ? wpm : Math.max(prev.bestWpm, wpm),
        bestPerfectWpm: !hadError
          ? prev.bestPerfectWpm === null
            ? wpm
            : Math.max(prev.bestPerfectWpm, wpm)
          : prev.bestPerfectWpm,
      }
      save(next)
      return next
    })
  }, [])

  return { bests, recordResult }
}
