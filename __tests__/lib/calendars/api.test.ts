/**
 * Tests for pure calendar API helper logic.
 * We test the URL construction and response handling via fetch mocking.
 */

import { fetchCalendar } from '@/lib/calendars/api'
import { CalendarSnapshot } from '@/lib/calendars/snapshot'

const snapshot: CalendarSnapshot = {
  version: 1,
  events: [{ id: 'e1', date: '2025-08-11', title: 'Skoledag', color: 'yellow' }],
  columns: [],
  settings: {
    startYear: 2025, startMonth: 1, monthCount: 12,
    calTitle: '', calTitleAlign: 'center', showYear: false,
  },
}

const mockCalendar = { id: 'cal-1', name: 'Test', data: snapshot }

global.fetch = jest.fn()

afterEach(() => jest.clearAllMocks())

describe('fetchCalendar', () => {
  it('kalder korrekt URL og returnerer data', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCalendar,
    })

    const result = await fetchCalendar('cal-1')
    expect(fetch).toHaveBeenCalledWith('/api/calendars/cal-1')
    expect(result?.name).toBe('Test')
    expect(result?.data).toEqual(snapshot)
  })

  it('returnerer null når response ikke er ok', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({ ok: false })
    const result = await fetchCalendar('missing')
    expect(result).toBeNull()
  })
})
