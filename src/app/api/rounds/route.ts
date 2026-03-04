import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: rounds, error } = await supabase
    .from('rounds')
    .select('*')
    .eq('is_active', true)

  if (error || !rounds || rounds.length === 0) {
    return NextResponse.json({ error: 'No active round found' }, { status: 404 })
  }

  const round = rounds[Math.floor(Math.random() * rounds.length)]

  return NextResponse.json(round)
}
