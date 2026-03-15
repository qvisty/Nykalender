'use client'

import { getHolidayMap, formatDateKey } from '@/lib/holidays/danish'
import { CalendarEvent, EventColor } from '@/lib/events/types'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

// Danish day abbreviations indexed by Date.getDay() (0=Sun, 1=Mon, ...)
const DAY_ABBR = ['S', 'M', 'T', 'O', 'T', 'F', 'L']

const COLOR_BG: Record<EventColor, string> = {
  yellow: '#fef08a',
  green:  '#bbf7d0',
  blue:   '#bfdbfe',
  purple: '#e9d5ff',
  red:    '#fecaca',
  pink:   '#fbcfe8',
  gray:   '#e5e7eb',
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function formatKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

interface YearViewProps {
  startYear: number
  startMonth: number  // 1–12
  today?: Date
  events?: CalendarEvent[]
}

export default function YearView({
  startYear,
  startMonth,
  today = new Date(),
  events = [],
}: YearViewProps) {
  // Build the 12-month sequence
  const months: { year: number; month: number }[] = []
  for (let i = 0; i < 12; i++) {
    const m = ((startMonth - 1 + i) % 12) + 1
    const y = startYear + Math.floor((startMonth - 1 + i) / 12)
    months.push({ year: y, month: m })
  }

  // Holiday maps per year
  const years = [...new Set(months.map((m) => m.year))]
  const holidayMaps = new Map<number, Map<string, { name: string; isPublicHoliday: boolean }>>()
  years.forEach((y) => holidayMaps.set(y, getHolidayMap(y)))

  // Event map keyed by date string
  const eventMap = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const arr = eventMap.get(event.date) ?? []
    arr.push(event)
    eventMap.set(event.date, arr)
  }

  const todayKey = formatDateKey(today)

  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-collapse" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            {months.map(({ year, month }) => (
              <th
                key={`${year}-${month}`}
                role="columnheader"
                className="px-1 py-1 text-center font-bold bg-gray-100 border border-gray-300"
                style={{ minWidth: '7rem' }}
              >
                {MONTH_SHORT[month - 1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 31 }, (_, rowIdx) => {
            const dayNum = rowIdx + 1
            return (
              <tr key={dayNum} data-testid={`row-${dayNum}`}>
                {months.map(({ year, month }) => {
                  const daysInMonth = getDaysInMonth(year, month)

                  if (dayNum > daysInMonth) {
                    return (
                      <td
                        key={`${year}-${month}`}
                        data-month={month}
                        className="border border-gray-100 px-1 py-0.5"
                      />
                    )
                  }

                  const date = new Date(year, month - 1, dayNum)
                  const dateKey = formatKey(year, month, dayNum)
                  const isToday = dateKey === todayKey
                  const isMonday = date.getDay() === 1
                  const weekNum = isMonday ? getISOWeekNumber(date) : null
                  const holiday = holidayMaps.get(year)!.get(dateKey)
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6
                  const isRed = isWeekend || !!holiday?.isPublicHoliday

                  const dayEvents = eventMap.get(dateKey) ?? []
                  const firstEvent = dayEvents[0]
                  const label = firstEvent?.title ?? holiday?.name

                  return (
                    <td
                      key={`${year}-${month}`}
                      data-testid={`day-${dateKey}`}
                      data-month={month}
                      data-today={isToday ? 'true' : 'false'}
                      data-color={firstEvent?.color ?? undefined}
                      className="border border-gray-100 px-1 py-0.5 align-middle"
                      style={{
                        backgroundColor: firstEvent
                          ? COLOR_BG[firstEvent.color]
                          : isToday
                          ? '#dbeafe'
                          : undefined,
                        outline: isToday ? '1px solid #3b82f6' : undefined,
                      }}
                    >
                      <div className="flex items-center gap-0.5">
                        {weekNum !== null && (
                          <span
                            data-testid={`weeknum-${dateKey}`}
                            className="text-gray-400 shrink-0"
                            style={{ fontSize: '8px', minWidth: '1rem' }}
                          >
                            {weekNum}
                          </span>
                        )}
                        <span
                          className={`font-medium shrink-0 ${isRed ? 'text-red-600' : 'text-gray-500'}`}
                          style={{ minWidth: '0.75rem' }}
                        >
                          {DAY_ABBR[date.getDay()]}
                        </span>
                        <span
                          className={`font-semibold shrink-0 ${
                            isToday ? 'text-blue-700' : isRed ? 'text-red-600' : 'text-gray-800'
                          }`}
                          style={{ minWidth: '1rem' }}
                        >
                          {dayNum}
                        </span>
                        {label && (
                          <span
                            className="ml-0.5 truncate text-gray-700"
                            style={{ fontSize: '9px' }}
                          >
                            {label}
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
