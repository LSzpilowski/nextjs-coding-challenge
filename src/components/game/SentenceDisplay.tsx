interface SentenceDisplayProps {
  sentence: string
  typedText: string
}

export function SentenceDisplay({ sentence, typedText }: SentenceDisplayProps) {
  return (
    <div className="font-mono text-2xl leading-relaxed tracking-wide">
        {sentence.split('').map((char, i) => (
            <span key={i} className={i >= typedText.length ? 'text-gray-500' : typedText[i] === char ? 'bg-green-100 text-green-500' : 'bg-red-400 text-red-900'}>{char}</span>
        ))}
    </div>
    )
}   