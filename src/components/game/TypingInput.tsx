'use client'

interface TypingInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

export function TypingInput({ value, onChange, disabled }: TypingInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      onPaste={(e) => e.preventDefault()}
      placeholder={disabled ? 'Round finished' : 'Start typing...'}
      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}
