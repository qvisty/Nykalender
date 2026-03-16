import { expandRecurringEvents, formatAgeInTitle } from '@/lib/events/recurrence'
import { CalendarEvent } from '@/lib/events/types'

describe('expandRecurringEvents – yearly', () => {
  const base: CalendarEvent = {
    id: 'r1',
    date: '2020-06-15',
    title: 'Fødselsdag',
    color: 'yellow',
    recurrence: 'yearly',
  }

  it('returnerer original event + kopier for hvert år i range', () => {
    const result = expandRecurringEvents([base], '2020-01-01', '2023-12-31')
    const dates = result.map((e) => e.date)
    expect(dates).toContain('2020-06-15')
    expect(dates).toContain('2021-06-15')
    expect(dates).toContain('2022-06-15')
    expect(dates).toContain('2023-06-15')
  })

  it('inkluderer ikke datoer uden for range', () => {
    const result = expandRecurringEvents([base], '2021-01-01', '2022-12-31')
    const dates = result.map((e) => e.date)
    expect(dates).not.toContain('2020-06-15')
    expect(dates).not.toContain('2023-06-15')
  })

  it('genererede events har samme id-præfiks som original', () => {
    const result = expandRecurringEvents([base], '2020-01-01', '2022-12-31')
    result.forEach((e) => expect(e.id).toContain('r1'))
  })
})

describe('expandRecurringEvents – monthly', () => {
  const base: CalendarEvent = {
    id: 'm1',
    date: '2025-01-10',
    title: 'Månedlig møde',
    color: 'blue',
    recurrence: 'monthly',
  }

  it('gentager den 10. i hvert måned i range', () => {
    const result = expandRecurringEvents([base], '2025-01-01', '2025-04-30')
    const dates = result.map((e) => e.date)
    expect(dates).toContain('2025-01-10')
    expect(dates).toContain('2025-02-10')
    expect(dates).toContain('2025-03-10')
    expect(dates).toContain('2025-04-10')
  })
})

describe('expandRecurringEvents – weekly', () => {
  const base: CalendarEvent = {
    id: 'w1',
    date: '2025-01-06',  // Monday
    title: 'Ugentligt møde',
    color: 'green',
    recurrence: 'weekly',
  }

  it('gentager ugentligt i range', () => {
    const result = expandRecurringEvents([base], '2025-01-01', '2025-01-31')
    const dates = result.map((e) => e.date)
    expect(dates).toContain('2025-01-06')
    expect(dates).toContain('2025-01-13')
    expect(dates).toContain('2025-01-20')
    expect(dates).toContain('2025-01-27')
  })
})

describe('expandRecurringEvents – ingen gentagelse', () => {
  it('returnerer event uændret når recurrence er undefined', () => {
    const event: CalendarEvent = { id: 'x', date: '2025-05-01', title: 'Engangsbegivenhed', color: 'red' }
    const result = expandRecurringEvents([event], '2025-01-01', '2025-12-31')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(event)
  })
})

describe('formatAgeInTitle', () => {
  it('erstatter [årstal] med alder beregnet ud fra begivenhedens dato', () => {
    // Born 1990, event date 2025-06-15 → 35 years
    const result = formatAgeInTitle('Mors fødselsdag [1990]', '2025-06-15')
    expect(result).toBe('Mors fødselsdag (35 år)')
  })

  it('viser 0 år på selve fødselsdagen i fødselsåret', () => {
    const result = formatAgeInTitle('Baby [2025]', '2025-03-10')
    expect(result).toBe('Baby (0 år)')
  })

  it('ændrer ikke titel uden [årstal] mønster', () => {
    const result = formatAgeInTitle('Julefrokost', '2025-12-15')
    expect(result).toBe('Julefrokost')
  })
})
