export const EVENT_COLORS = ['yellow', 'green', 'blue', 'purple', 'red', 'pink', 'gray'] as const

export type EventColor = (typeof EVENT_COLORS)[number]

export interface CalendarEvent {
  id: string
  date: string      // YYYY-MM-DD
  title: string
  color: EventColor
  columnId?: string // optional: id of CalendarColumn
}
