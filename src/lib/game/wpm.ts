export function calculateWpm(
  typedText: string,
  targetText: string,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds <= 0 || typedText.trim().length === 0) {
    return 0
  }

  const typedWords = typedText.trim().split(/\s+/)
  const targetWords = targetText.trim().split(/\s+/)

  const correctWords = typedWords.filter((word, i) => word === targetWords[i]).length

  const minutes = elapsedSeconds / 60

  return Math.round(correctWords / minutes)
}