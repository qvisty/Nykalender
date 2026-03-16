import { CalendarEvent, EventColor, RecurrenceType } from './types'

function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const COLOR_MAP: Record<string, EventColor> = {
  gul:    'yellow',
  grøn:   'green',
  blå:    'blue',
  lilla:  'purple',
  rød:    'red',
  pink:   'pink',
  grå:    'gray',
  yellow: 'yellow',
  green:  'green',
  blue:   'blue',
  purple: 'purple',
  red:    'red',
  gray:   'gray',
}

const RECURRENCE_MAP: Record<string, RecurrenceType> = {
  ugentlig:  'weekly',
  månedlig:  'monthly',
  årlig:     'yearly',
  weekly:    'weekly',
  monthly:   'monthly',
  yearly:    'yearly',
}

/**
 * Parses one or more lines of text into CalendarEvent objects.
 *
 * Line format: YYYY-MM-DD <titel> [farve] [gentagelse]
 *
 * Examples:
 *   2025-08-11 Første skoledag
 *   2025-12-24 Juleaften rød
 *   2025-01-06 Ugentligt møde grøn ugentlig
 */
export function parseEventText(text: string): CalendarEvent[] {
  const events: CalendarEvent[] = []

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    const parts = line.split(/\s+/)
    if (parts.length < 2) continue

    const [datePart, ...rest] = parts

    if (!DATE_RE.test(datePart)) continue

    // Extract optional color and recurrence from the END of the token list
    let color: EventColor = 'yellow'
    let recurrence: RecurrenceType | undefined

    const filtered: string[] = []
    for (const token of rest) {
      const lower = token.toLowerCase()
      if (RECURRENCE_MAP[lower]) {
        recurrence = RECURRENCE_MAP[lower]
      } else if (COLOR_MAP[lower]) {
        color = COLOR_MAP[lower]
      } else {
        filtered.push(token)
      }
    }

    const title = filtered.join(' ').trim()
    if (!title) continue

    events.push({
      id: genId(),
      date: datePart,
      title,
      color,
      recurrence,
    })
  }

  return events
}
