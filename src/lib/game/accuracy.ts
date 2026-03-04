export function calculateAccuracy(
  typedText: string,
  targetText: string,
): number {
  if (typedText.length === 0) {
    return 1
  }
  const correctChars = typedText
    .split('')
    .filter((char, index) => char === targetText[index]).length

  return Math.round((correctChars / typedText.length) * 100) / 100
}