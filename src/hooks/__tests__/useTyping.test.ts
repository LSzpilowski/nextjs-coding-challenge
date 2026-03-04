import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTyping } from '@/hooks/useTyping'

// Helper – simulate typing into the hook
function makeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return { target: { value } } as React.ChangeEvent<HTMLInputElement>
}

describe('useTyping', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useTyping('hello world'))

    expect(result.current.typedText).toBe('')
    expect(result.current.wpm).toBe(0)
    expect(result.current.accuracy).toBe(1)
    expect(result.current.isFinished).toBe(false)
    expect(result.current.hasStarted).toBe(false)
  })

  it('sets hasStarted on first keystroke', () => {
    const { result } = renderHook(() => useTyping('hello'))

    act(() => result.current.handleChange(makeEvent('h')))

    expect(result.current.hasStarted).toBe(true)
  })

  it('does not accept input longer than the sentence', () => {
    const { result } = renderHook(() => useTyping('hi'))

    act(() => result.current.handleChange(makeEvent('hello world extra')))

    expect(result.current.typedText).toBe('')
  })

  it('sets isFinished when typed text matches sentence exactly', () => {
    const sentence = 'hello'
    const { result } = renderHook(() => useTyping(sentence))

    act(() => result.current.handleChange(makeEvent('hello')))

    expect(result.current.isFinished).toBe(true)
  })

  it('is not finished when text is partial match', () => {
    const { result } = renderHook(() => useTyping('hello world'))

    act(() => result.current.handleChange(makeEvent('hello')))

    expect(result.current.isFinished).toBe(false)
  })

  it('calls onComplete with wpm and hadError=false when finished without errors', () => {
    const onComplete = vi.fn()
    const sentence = 'hi'
    const { result } = renderHook(() => useTyping(sentence, onComplete))

    act(() => result.current.handleChange(makeEvent('hi')))

    expect(onComplete).toHaveBeenCalledOnce()
    expect(onComplete).toHaveBeenCalledWith(expect.any(Number), false)
  })

  it('calls onComplete with hadError=true when there was a mistake', () => {
    const onComplete = vi.fn()
    const sentence = 'hello'
    const { result } = renderHook(() => useTyping(sentence, onComplete))

    // Type wrong character then correct the whole sentence
    act(() => result.current.handleChange(makeEvent('x')))
    act(() => result.current.handleChange(makeEvent('hello')))

    expect(onComplete).toHaveBeenCalledWith(expect.any(Number), true)
  })

  it('does not call onComplete on partial input', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTyping('hello world', onComplete))

    act(() => result.current.handleChange(makeEvent('hello')))

    expect(onComplete).not.toHaveBeenCalled()
  })
})
