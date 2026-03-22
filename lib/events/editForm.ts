import { CalendarEvent, EventColor, RecurrenceType } from './types'

export interface EventFormState {
  date: string
  title: string
  color: EventColor
  columnId?: string
  recurrence?: RecurrenceType
}

export function buildEditForm(event: CalendarEvent): EventFormState {
  return {
    date: event.date,
    title: event.title,
    color: event.color,
    columnId: event.columnId,
    recurrence: event.recurrence,
  }
}
