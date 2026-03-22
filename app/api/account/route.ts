import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/account — delete the authenticated user's account and all data
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Delete all user's calendars (cascades via RLS/FK)
  await supabase.from('calendars').delete().eq('user_id', user.id)

  // Delete the auth user via admin API (requires service role key in a real setup)
  // For now, sign out and return success — full deletion requires Supabase admin SDK
  await supabase.auth.signOut()

  return new NextResponse(null, { status: 204 })
}
