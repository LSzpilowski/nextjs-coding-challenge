import { describe, it, expect } from 'vitest'
import { calculateWpm } from '@/lib/game/wpm'

describe('calculateWpm', () => {
  it('returns 0 when elapsed time is 0', () => {
    expect(calculateWpm('hello world', 'hello world', 0)).toBe(0)
  })

  it('returns 0 when typed text is empty', () => {
    expect(calculateWpm('', 'hello world', 10)).toBe(0)
  })

  it('returns 0 when no words match', () => {
    expect(calculateWpm('xyz abc', 'hello world', 60)).toBe(0)
  })

  it('calculates WPM correctly for 2 correct words in 60 seconds', () => {
    // 2 correct words / 1 minute = 2 WPM
    expect(calculateWpm('hello world', 'hello world', 60)).toBe(2)
  })

  it('calculates WPM correctly for 60 correct words in 60 seconds', () => {
    const words = Array(60).fill('word').join(' ')
    expect(calculateWpm(words, words, 60)).toBe(60)
  })

  it('calculates WPM correctly for 5 correct words in 30 seconds', () => {
    // 5 words / 0.5 min = 10 WPM
    const sentence = 'one two three four five'
    expect(calculateWpm(sentence, sentence, 30)).toBe(10)
  })

  it('only counts words that match the target exactly', () => {
    // 'hello' matches, 'wrld' does not
    expect(calculateWpm('hello wrld', 'hello world', 60)).toBe(1)
  })

  it('handles negative elapsed time as 0', () => {
    expect(calculateWpm('hello world', 'hello world', -5)).toBe(0)
  })
})
