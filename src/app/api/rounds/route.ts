import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: round, error } = await supabase
    .from('rounds')
    .select('*')
    .eq('is_active', true)
    .order('started_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !round) {
    return NextResponse.json({ error: 'No active round found' }, { status: 404 })
  }

  return NextResponse.json(round)
}
