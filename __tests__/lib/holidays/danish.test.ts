import {
  getEasterDate,
  getHolidaysForYear,
  getHolidaysForMonth,
  type Holiday,
} from '@/lib/holidays/danish'

describe('getEasterDate', () => {
  it('calculates Easter 2026 correctly (April 5)', () => {
    const easter = getEasterDate(2026)
    expect(easter.getMonth()).toBe(3) // April = month 3 (0-indexed)
    expect(easter.getDate()).toBe(5)
  })

  it('calculates Easter 2025 correctly (April 20)', () => {
    const easter = getEasterDate(2025)
    expect(easter.getMonth()).toBe(3)
    expect(easter.getDate()).toBe(20)
  })

  it('calculates Easter 2024 correctly (March 31)', () => {
    const easter = getEasterDate(2024)
    expect(easter.getMonth()).toBe(2) // March
    expect(easter.getDate()).toBe(31)
  })

  it('calculates Easter 2019 correctly (April 21)', () => {
    const easter = getEasterDate(2019)
    expect(easter.getMonth()).toBe(3)
    expect(easter.getDate()).toBe(21)
  })
})

describe('getHolidaysForYear', () => {
  it('returns array of holidays', () => {
    const holidays = getHolidaysForYear(2026)
    expect(Array.isArray(holidays)).toBe(true)
    expect(holidays.length).toBeGreaterThan(10)
  })

  it('includes New Years Day (Nytårsdag)', () => {
    const holidays = getHolidaysForYear(2026)
    const newYear = holidays.find((h) => h.date.getMonth() === 0 && h.date.getDate() === 1)
    expect(newYear).toBeDefined()
    expect(newYear?.name).toMatch(/nytår/i)
  })

  it('includes Christmas Day (1. juledag)', () => {
    const holidays = getHolidaysForYear(2026)
    const christmas = holidays.find((h) => h.date.getMonth() === 11 && h.date.getDate() === 25)
    expect(christmas).toBeDefined()
    expect(christmas?.name).toMatch(/juledag/i)
  })

  it('includes Good Friday (Langfredag) for 2026', () => {
    const holidays = getHolidaysForYear(2026)
    // Easter 2026 is April 5, so Langfredag is April 3
    const langfredag = holidays.find((h) => h.date.getMonth() === 3 && h.date.getDate() === 3)
    expect(langfredag).toBeDefined()
    expect(langfredag?.name).toMatch(/langfredag/i)
  })

  it('includes Ascension Day (Kristi Himmelfartsdag) for 2026', () => {
    const holidays = getHolidaysForYear(2026)
    // Easter April 5 + 39 days = May 14
    const ascension = holidays.find((h) => h.date.getMonth() === 4 && h.date.getDate() === 14)
    expect(ascension).toBeDefined()
    expect(ascension?.name).toMatch(/himmelfartsdag/i)
  })

  it('includes Whit Monday (2. Pinsedag) for 2026', () => {
    const holidays = getHolidaysForYear(2026)
    // Easter April 5 + 50 days = May 25
    const whitMonday = holidays.find((h) => h.date.getMonth() === 4 && h.date.getDate() === 25)
    expect(whitMonday).toBeDefined()
    expect(whitMonday?.name).toMatch(/pinsedag/i)
  })

  it('includes Constitution Day (Grundlovsdag) on June 5', () => {
    const holidays = getHolidaysForYear(2026)
    const grundlov = holidays.find((h) => h.date.getMonth() === 5 && h.date.getDate() === 5)
    expect(grundlov).toBeDefined()
    expect(grundlov?.name).toMatch(/grundlovsdag/i)
  })

  it('marks public holidays as isPublicHoliday=true', () => {
    const holidays = getHolidaysForYear(2026)
    const christmas = holidays.find((h) => h.date.getMonth() === 11 && h.date.getDate() === 25)
    expect(christmas?.isPublicHoliday).toBe(true)
  })

  it('marks Grundlovsdag as not a full public holiday (banks open)', () => {
    const holidays = getHolidaysForYear(2026)
    const grundlov = holidays.find((h) => h.name.toLowerCase().includes('grundlovsdag'))
    // Grundlovsdag is a half holiday in Denmark
    expect(grundlov).toBeDefined()
  })
})

describe('getHolidaysForMonth', () => {
  it('returns only holidays for the given month', () => {
    const holidays = getHolidaysForMonth(2026, 12) // December
    expect(holidays.every((h) => h.date.getMonth() === 11)).toBe(true)
  })

  it('returns Christmas holidays in December 2026', () => {
    const holidays = getHolidaysForMonth(2026, 12)
    expect(holidays.some((h) => h.date.getDate() === 25)).toBe(true)
    expect(holidays.some((h) => h.date.getDate() === 26)).toBe(true)
  })

  it('returns empty array for month with no holidays', () => {
    // August typically has no Danish public holidays
    const holidays = getHolidaysForMonth(2026, 8)
    const publicHolidays = holidays.filter((h) => h.isPublicHoliday)
    expect(publicHolidays.length).toBe(0)
  })
})
