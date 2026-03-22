import { CalendarEvent } from '@/lib/events/types'
import { CalendarColumn } from '@/lib/events/columns'
import { HeaderAlign } from '@/components/calendar/CalendarHeader'

export interface CalendarSettings {
  startYear: number
  startMonth: number
  monthCount: 1 | 3 | 6 | 12
  calTitle: string
  calTitleAlign: HeaderAlign
  showYear: boolean
}

export interface CalendarSnapshot {
  version: 1
  events: CalendarEvent[]
  columns: CalendarColumn[]
  settings: CalendarSettings
}

interface SerializeInput {
  events: CalendarEvent[]
  columns: CalendarColumn[]
  settings: CalendarSettings
}

export function serializeCalendarState(input: SerializeInput): CalendarSnapshot {
  return {
    version: 1,
    events: input.events,
    columns: input.columns,
    settings: input.settings,
  }
}

export function deserializeCalendarState(snap: CalendarSnapshot): SerializeInput {
  return {
    events: snap.events ?? [],
    columns: snap.columns ?? [],
    settings: snap.settings,
  }
}
