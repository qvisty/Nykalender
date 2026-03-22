import { CalendarSnapshot } from './snapshot'

export interface CalendarMeta {
  id: string
  name: string
  share_token: string | null
  created_at: string
  updated_at: string
}

export async function fetchCalendars(): Promise<CalendarMeta[]> {
  const res = await fetch('/api/calendars')
  if (!res.ok) throw new Error('Kunne ikke hente kalendere')
  return res.json()
}

export async function saveCalendar(name: string, data: CalendarSnapshot): Promise<CalendarMeta> {
  const res = await fetch('/api/calendars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data }),
  })
  if (!res.ok) throw new Error('Kunne ikke gemme kalender')
  return res.json()
}

export async function updateCalendar(
  id: string,
  update: { name?: string; data?: CalendarSnapshot }
): Promise<CalendarMeta> {
  const res = await fetch(`/api/calendars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  })
  if (!res.ok) throw new Error('Kunne ikke opdatere kalender')
  return res.json()
}

export async function deleteCalendar(id: string): Promise<void> {
  const res = await fetch(`/api/calendars/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Kunne ikke slette kalender')
}

export async function generateShareToken(id: string): Promise<string | null> {
  const res = await fetch(`/api/calendars/${id}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  if (!res.ok) throw new Error('Kunne ikke generere delingslink')
  const row = await res.json()
  return row.share_token
}

export async function revokeShareToken(id: string): Promise<void> {
  const res = await fetch(`/api/calendars/${id}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ revoke: true }),
  })
  if (!res.ok) throw new Error('Kunne ikke fjerne delingslink')
}

export async function fetchCalendar(id: string): Promise<{
  id: string
  name: string
  data: CalendarSnapshot
} | null> {
  const res = await fetch(`/api/calendars/${id}`)
  if (!res.ok) return null
  return res.json()
}

export async function fetchSharedCalendar(token: string): Promise<{
  id: string
  name: string
  data: CalendarSnapshot
} | null> {
  const res = await fetch(`/api/share/${token}`)
  if (!res.ok) return null
  return res.json()
}
