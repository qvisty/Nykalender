import { CalendarColumn, DEFAULT_COLUMN_COLORS } from '@/lib/events/columns'
import {
  getColumns,
  saveColumn,
  deleteColumn,
  clearColumns,
} from '@/lib/events/columnStorage'

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

beforeEach(() => localStorageMock.clear())

describe('CalendarColumn typer', () => {
  it('DEFAULT_COLUMN_COLORS indeholder mindst 5 farver', () => {
    expect(DEFAULT_COLUMN_COLORS.length).toBeGreaterThanOrEqual(5)
  })

  it('CalendarColumn interface er korrekt', () => {
    const col: CalendarColumn = { id: 'c1', name: 'Mor', color: '#fef08a' }
    expect(col.id).toBe('c1')
    expect(col.name).toBe('Mor')
    expect(col.color).toBe('#fef08a')
  })
})

describe('Column storage', () => {
  it('returnerer tom liste når der ingen kolonner er', () => {
    expect(getColumns()).toEqual([])
  })

  it('kan gemme og hente en kolonne', () => {
    const col: CalendarColumn = { id: 'c1', name: 'Far', color: '#bbf7d0' }
    saveColumn(col)
    expect(getColumns()).toHaveLength(1)
    expect(getColumns()[0]).toEqual(col)
  })

  it('opdaterer eksisterende kolonne ved samme id', () => {
    saveColumn({ id: 'c1', name: 'Mor', color: '#fef08a' })
    saveColumn({ id: 'c1', name: 'Mor opdateret', color: '#bfdbfe' })
    expect(getColumns()).toHaveLength(1)
    expect(getColumns()[0].name).toBe('Mor opdateret')
  })

  it('kan slette en kolonne', () => {
    saveColumn({ id: 'c1', name: 'Barn', color: '#e9d5ff' })
    deleteColumn('c1')
    expect(getColumns()).toHaveLength(0)
  })

  it('clearColumns fjerner alle kolonner', () => {
    saveColumn({ id: 'a', name: 'A', color: '#fef08a' })
    saveColumn({ id: 'b', name: 'B', color: '#bbf7d0' })
    clearColumns()
    expect(getColumns()).toHaveLength(0)
  })
})
