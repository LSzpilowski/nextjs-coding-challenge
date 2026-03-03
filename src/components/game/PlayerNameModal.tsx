'use client'

import { useRef, useState } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PlayerNameModalProps {
  onSubmit: (name: string, captchaToken: string) => Promise<{ error: string | null }>
}

export function PlayerNameModal({ onSubmit }: PlayerNameModalProps) {
  const [name, setName] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less.')
      return
    }
    if (!captchaToken) {
      setError('Please complete the captcha.')
      return
    }

    setIsLoading(true)
    const result = await onSubmit(trimmedName, captchaToken)
    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      captchaRef.current?.resetCaptcha()
      setCaptchaToken(null)
    }
  }

  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Join the race</DialogTitle>
          <DialogDescription>Enter a display name to start competing</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="player-name">Your username</Label>
            <Input
              id="player-name"
              placeholder="e.g. TypeMaster3000"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoFocus
              autoComplete="off"
            />
          </div>

          <HCaptcha
            ref={captchaRef}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={isLoading || !captchaToken}>
            {isLoading ? 'Joining...' : 'Join race'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
