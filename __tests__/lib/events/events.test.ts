import { EventColor, CalendarEvent, EVENT_COLORS } from '@/lib/events/types'
import {
  getEvents,
  saveEvent,
  deleteEvent,
  getEventsForDate,
  clearEvents,
} from '@/lib/events/storage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

beforeEach(() => {
  localStorageMock.clear()
})

describe('CalendarEvent typer', () => {
  it('EVENT_COLORS indeholder standard farver', () => {
    expect(EVENT_COLORS).toContain('yellow')
    expect(EVENT_COLORS).toContain('green')
    expect(EVENT_COLORS).toContain('blue')
    expect(EVENT_COLORS).toContain('purple')
    expect(EVENT_COLORS).toContain('red')
  })

  it('CalendarEvent interface er korrekt opbygget', () => {
    const event: CalendarEvent = {
      id: 'test-1',
      date: '2025-08-11',
      title: 'Første skoledag',
      color: 'yellow',
    }
    expect(event.id).toBe('test-1')
    expect(event.date).toBe('2025-08-11')
    expect(event.title).toBe('Første skoledag')
    expect(event.color).toBe('yellow')
  })
})

describe('Event storage', () => {
  it('returnerer tom liste når der ingen events er', () => {
    expect(getEvents()).toEqual([])
  })

  it('kan gemme og hente en event', () => {
    const event: CalendarEvent = {
      id: 'evt-1',
      date: '2025-12-24',
      title: 'Juleaften',
      color: 'red',
    }
    saveEvent(event)
    const events = getEvents()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(event)
  })

  it('kan gemme flere events', () => {
    saveEvent({ id: 'a', date: '2025-09-01', title: 'Event A', color: 'blue' })
    saveEvent({ id: 'b', date: '2025-09-15', title: 'Event B', color: 'green' })
    expect(getEvents()).toHaveLength(2)
  })

  it('opdaterer eksisterende event ved samme id', () => {
    saveEvent({ id: 'x', date: '2025-10-01', title: 'Original', color: 'yellow' })
    saveEvent({ id: 'x', date: '2025-10-01', title: 'Opdateret', color: 'purple' })
    const events = getEvents()
    expect(events).toHaveLength(1)
    expect(events[0].title).toBe('Opdateret')
  })

  it('kan slette en event', () => {
    saveEvent({ id: 'del-1', date: '2025-11-01', title: 'Slet mig', color: 'gray' })
    deleteEvent('del-1')
    expect(getEvents()).toHaveLength(0)
  })

  it('getEventsForDate returnerer kun events for den dato', () => {
    saveEvent({ id: 'e1', date: '2025-09-10', title: 'Match', color: 'blue' })
    saveEvent({ id: 'e2', date: '2025-09-11', title: 'Ingen match', color: 'green' })
    const result = getEventsForDate('2025-09-10')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Match')
  })

  it('clearEvents fjerner alle events', () => {
    saveEvent({ id: 'c1', date: '2025-01-01', title: 'A', color: 'red' })
    saveEvent({ id: 'c2', date: '2025-01-02', title: 'B', color: 'blue' })
    clearEvents()
    expect(getEvents()).toHaveLength(0)
  })
})
