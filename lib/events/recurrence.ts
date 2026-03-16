import { CalendarEvent } from './types'

/**
 * Expands recurring events into individual instances within [rangeStart, rangeEnd].
 * Non-recurring events are returned unchanged.
 */
export function expandRecurringEvents(
  events: CalendarEvent[],
  rangeStart: string,
  rangeEnd: string
): CalendarEvent[] {
  const result: CalendarEvent[] = []
  const start = new Date(rangeStart)
  const end = new Date(rangeEnd)

  for (const event of events) {
    if (!event.recurrence) {
      result.push(event)
      continue
    }

    const origin = new Date(event.date)
    let cursor = new Date(origin)

    if (event.recurrence === 'yearly') {
      // Start from the year of rangeStart, go through rangeEnd year
      cursor = new Date(origin)
      cursor.setFullYear(start.getFullYear())
      if (cursor < origin) cursor.setFullYear(cursor.getFullYear() + 1)

      while (cursor <= end) {
        if (cursor >= start) {
          result.push({ ...event, id: `${event.id}-${cursor.getFullYear()}`, date: fmtDate(cursor) })
        }
        cursor = new Date(cursor)
        cursor.setFullYear(cursor.getFullYear() + 1)
      }

    } else if (event.recurrence === 'monthly') {
      // Start from the month/day in the range start month
      cursor = new Date(start.getFullYear(), start.getMonth(), origin.getDate())
      if (cursor < new Date(event.date)) {
        // Advance to the first occurrence at or after rangeStart
        while (cursor < start) {
          cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, origin.getDate())
        }
      }

      while (cursor <= end) {
        if (cursor >= start) {
          result.push({ ...event, id: `${event.id}-${fmtDate(cursor)}`, date: fmtDate(cursor) })
        }
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, origin.getDate())
      }

    } else if (event.recurrence === 'weekly') {
      // Find first occurrence at or after rangeStart
      cursor = new Date(origin)
      while (cursor < start) {
        cursor = new Date(cursor.getTime() + 7 * 86400000)
      }

      while (cursor <= end) {
        result.push({ ...event, id: `${event.id}-${fmtDate(cursor)}`, date: fmtDate(cursor) })
        cursor = new Date(cursor.getTime() + 7 * 86400000)
      }
    }
  }

  return result
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Replaces [YYYY] patterns in a title with "(N år)" calculated from the event date.
 * Example: "Mors fødselsdag [1990]" on 2025-06-15 → "Mors fødselsdag (35 år)"
 */
export function formatAgeInTitle(title: string, eventDate: string): string {
  return title.replace(/\[(\d{4})\]/g, (_, yearStr) => {
    const birthYear = parseInt(yearStr, 10)
    const eventYear = parseInt(eventDate.slice(0, 4), 10)
    const age = eventYear - birthYear
    return `(${age} år)`
  })
}
