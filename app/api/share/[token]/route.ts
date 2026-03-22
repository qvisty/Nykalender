import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/share/[token] — public read of shared calendar data
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = await createClient()
  const { token } = await params

  const { data, error } = await supabase
    .from('calendars')
    .select('id, name, data, created_at')
    .eq('share_token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Ikke fundet' }, { status: 404 })
  }

  return NextResponse.json(data)
}
