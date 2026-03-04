import { describe, it, expect } from 'vitest'
import { calculateAccuracy } from '@/lib/game/accuracy'

describe('calculateAccuracy', () => {
  it('returns 1 when typed text is empty', () => {
    expect(calculateAccuracy('', 'hello world')).toBe(1)
  })

  it('returns 1 when all characters are correct', () => {
    expect(calculateAccuracy('hello', 'hello world')).toBe(1)
  })

  it('returns 0 when no characters match', () => {
    expect(calculateAccuracy('xxxxx', 'hello')).toBe(0)
  })

  it('returns 0.5 when half of characters are correct', () => {
    // 'he' correct, 'xx' incorrect out of 'hell'
    expect(calculateAccuracy('hexx', 'hell')).toBe(0.5)
  })

  it('rounds to 2 decimal places', () => {
    // 2 out of 3 correct = 0.67
    expect(calculateAccuracy('hex', 'hey')).toBe(0.67)
  })

  it('compares characters by position, not content', () => {
    // 'ab' vs 'ba' – no position matches
    expect(calculateAccuracy('ab', 'ba')).toBe(0)
  })
})
