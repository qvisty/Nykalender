import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function genToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
  }
  return Math.random().toString(36).slice(2, 18)
}

// POST /api/calendars/[id]/share — generate or revoke share token
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const revoke = body?.revoke === true

  const token = revoke ? null : genToken()

  const { data: row, error } = await supabase
    .from('calendars')
    .update({ share_token: token })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, share_token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(row)
}
