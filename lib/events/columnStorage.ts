import { CalendarColumn } from './columns'

const STORAGE_KEY = 'nykalender_columns'

export function getColumns(): CalendarColumn[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CalendarColumn[]) : []
  } catch {
    return []
  }
}

export function saveColumn(column: CalendarColumn): void {
  const cols = getColumns()
  const idx = cols.findIndex((c) => c.id === column.id)
  if (idx >= 0) {
    cols[idx] = column
  } else {
    cols.push(column)
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cols))
}

export function deleteColumn(id: string): void {
  const cols = getColumns().filter((c) => c.id !== id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cols))
}

export function clearColumns(): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
}
