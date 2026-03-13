export interface Holiday {
  date: Date
  name: string
  isPublicHoliday: boolean // red day (lukket)
}

/**
 * Calculates Easter Sunday using the Anonymous Gregorian algorithm.
 */
export function getEasterDate(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1 // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getHolidaysForYear(year: number): Holiday[] {
  const easter = getEasterDate(year)
  const holidays: Holiday[] = []

  // Fixed holidays
  holidays.push({ date: new Date(year, 0, 1), name: 'Nytårsdag', isPublicHoliday: true })
  holidays.push({ date: new Date(year, 5, 5), name: 'Grundlovsdag', isPublicHoliday: false })
  holidays.push({ date: new Date(year, 11, 24), name: 'Juleaftensdag', isPublicHoliday: false })
  holidays.push({ date: new Date(year, 11, 25), name: '1. juledag', isPublicHoliday: true })
  holidays.push({ date: new Date(year, 11, 26), name: '2. juledag', isPublicHoliday: true })
  holidays.push({ date: new Date(year, 11, 31), name: 'Nytårsaftensdag', isPublicHoliday: false })

  // Easter-relative holidays
  holidays.push({ date: addDays(easter, -7), name: 'Palmesøndag', isPublicHoliday: false })
  holidays.push({ date: addDays(easter, -3), name: 'Skærtorsdag', isPublicHoliday: true })
  holidays.push({ date: addDays(easter, -2), name: 'Langfredag', isPublicHoliday: true })
  holidays.push({ date: addDays(easter, -1), name: 'Påskeaftensdag', isPublicHoliday: false })
  holidays.push({ date: easter, name: '1. påskedag', isPublicHoliday: true })
  holidays.push({ date: addDays(easter, 1), name: '2. påskedag', isPublicHoliday: true })
  holidays.push({ date: addDays(easter, 26), name: 'Store bededag (afskaffet fra 2024)', isPublicHoliday: year < 2024 })
  holidays.push({ date: addDays(easter, 39), name: 'Kristi Himmelfartsdag', isPublicHoliday: true })
  holidays.push({ date: addDays(easter, 49), name: '1. pinsedag', isPublicHoliday: true })
  holidays.push({ date: addDays(easter, 50), name: '2. pinsedag', isPublicHoliday: true })

  // Filter out Store bededag from 2024+
  return holidays.filter(
    (h) => !(h.name.startsWith('Store bededag') && year >= 2024)
  )
}

export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  // month is 1-indexed
  return getHolidaysForYear(year).filter((h) => h.date.getMonth() === month - 1)
}

/**
 * Returns a map from date string (YYYY-MM-DD) to Holiday for fast lookups.
 */
export function getHolidayMap(year: number): Map<string, Holiday> {
  const map = new Map<string, Holiday>()
  for (const holiday of getHolidaysForYear(year)) {
    const key = holiday.date.toISOString().slice(0, 10)
    map.set(key, holiday)
  }
  return map
}

export function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}
