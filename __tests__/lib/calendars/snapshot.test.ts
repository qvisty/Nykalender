import {
  serializeCalendarState,
  deserializeCalendarState,
  CalendarSnapshot,
} from '@/lib/calendars/snapshot'
import { CalendarEvent } from '@/lib/events/types'
import { CalendarColumn } from '@/lib/events/columns'

const events: CalendarEvent[] = [
  { id: 'e1', date: '2025-08-11', title: 'Skoledag', color: 'yellow' },
  { id: 'e2', date: '2025-12-24', title: 'Juleaften', color: 'red', recurrence: 'yearly' },
]

const columns: CalendarColumn[] = [
  { id: 'c1', name: 'Mor', color: '#fef08a' },
  { id: 'c2', name: 'Far', color: '#bbf7d0' },
]

const settings = {
  startYear: 2025,
  startMonth: 8,
  monthCount: 12 as const,
  calTitle: 'Familie 2025/26',
  calTitleAlign: 'center' as const,
  showYear: false,
}

describe('serializeCalendarState', () => {
  it('returnerer et objekt med events, columns og settings', () => {
    const snap = serializeCalendarState({ events, columns, settings })
    expect(snap.events).toEqual(events)
    expect(snap.columns).toEqual(columns)
    expect(snap.settings).toEqual(settings)
  })

  it('indeholder version-felt', () => {
    const snap = serializeCalendarState({ events, columns, settings })
    expect(snap.version).toBe(1)
  })
})

describe('deserializeCalendarState', () => {
  it('gendanner events, columns og settings', () => {
    const snap: CalendarSnapshot = { version: 1, events, columns, settings }
    const result = deserializeCalendarState(snap)
    expect(result.events).toEqual(events)
    expect(result.columns).toEqual(columns)
    expect(result.settings).toEqual(settings)
  })

  it('håndterer manglende colonner-felt (v1 bagudkompatibilitet)', () => {
    const snap = { version: 1, events, settings } as unknown as CalendarSnapshot
    const result = deserializeCalendarState(snap)
    expect(result.columns).toEqual([])
  })

  it('håndterer manglende events-felt', () => {
    const snap = { version: 1, columns, settings } as unknown as CalendarSnapshot
    const result = deserializeCalendarState(snap)
    expect(result.events).toEqual([])
  })
})
