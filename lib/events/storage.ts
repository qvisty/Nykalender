import { CalendarEvent } from './types'

const STORAGE_KEY = 'nykalender_events'

export function getEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CalendarEvent[]) : []
  } catch {
    return []
  }
}

export function saveEvent(event: CalendarEvent): void {
  const events = getEvents()
  const idx = events.findIndex((e) => e.id === event.id)
  if (idx >= 0) {
    events[idx] = event
  } else {
    events.push(event)
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function deleteEvent(id: string): void {
  const events = getEvents().filter((e) => e.id !== id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function getEventsForDate(date: string): CalendarEvent[] {
  return getEvents().filter((e) => e.date === date)
}

export function clearEvents(): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
}
