'use client'

import { useState } from 'react'
import { getHolidayMap, formatDateKey, type Holiday } from '@/lib/holidays/danish'
import { CalendarColors, DEFAULT_CALENDAR_COLORS } from './calendarColors'

interface CalendarGridProps {
  initialYear?: number
  initialMonth?: number
  today?: Date
  colors?: CalendarColors
}

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

const MONTH_NAMES = [
  'januar', 'februar', 'marts', 'april', 'maj', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'december',
]

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

// Returns 0=Mon, 6=Sun for the first day of month
function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month - 1, 1).getDay()
  return day === 0 ? 6 : day - 1
}

interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  weekNumber?: number
}

function buildCalendarDays(year: number, month: number, today: Date): CalendarDay[] {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOffset = getFirstDayOfWeek(year, month)
  const days: CalendarDay[] = []

  // Days from previous month
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

  for (let i = firstDayOffset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const date = new Date(prevYear, prevMonth - 1, d)
    days.push({
      date,
      day: d,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
  }

  // Days in current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d)
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    days.push({
      date,
      day: d,
      isCurrentMonth: true,
      isToday,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
  }

  // Fill remaining cells to complete the grid (up to 6 rows)
  const totalCells = Math.ceil(days.length / 7) * 7
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  let nextDay = 1
  while (days.length < totalCells) {
    const date = new Date(nextYear, nextMonth - 1, nextDay)
    days.push({
      date,
      day: nextDay++,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
  }

  return days
}

export default function CalendarGrid({
  initialYear,
  initialMonth,
  today = new Date(),
  colors = DEFAULT_CALENDAR_COLORS,
}: CalendarGridProps) {
  const [year, setYear] = useState(initialYear ?? today.getFullYear())
  const [month, setMonth] = useState(initialMonth ?? today.getMonth() + 1)

  function goToPrevMonth() {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function goToNextMonth() {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function goToToday() {
    const now = today
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
  }

  const days = buildCalendarDays(year, month, today)
  const holidayMap = getHolidayMap(year)

  // Group into weeks (rows of 7)
  const weeks: CalendarDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={goToPrevMonth}
          aria-label="Forrige måned"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ←
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {MONTH_NAMES[month - 1]} {year}
          </h2>
          <button
            onClick={goToToday}
            className="text-sm px-3 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            I dag
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          aria-label="Næste måned"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          →
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {/* Week number header */}
              <th className="w-10 px-2 py-2 text-xs text-gray-400 font-normal text-center">
                Uge
              </th>
              {WEEKDAYS.map((day) => (
                <th
                  key={day}
                  className="px-2 py-2 text-xs font-medium text-center"
                  style={{
                    color: colors.headerText,
                    backgroundColor: colors.headerBackground,
                  }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIdx) => {
              const weekNumber = getISOWeekNumber(
                week.find((d) => d.isCurrentMonth)?.date ?? week[0].date
              )
              return (
                <tr key={weekIdx} className="border-b border-gray-50 last:border-0">
                  {/* Week number */}
                  <td className="px-2 py-1 text-xs text-gray-300 text-center align-middle">
                    {weekNumber}
                  </td>
                  {week.map((day, dayIdx) => {
                    const holiday = holidayMap.get(formatDateKey(day.date))
                    const isHoliday = !!holiday?.isPublicHoliday
                    const isRed = day.isWeekend || isHoliday

                    return (
                      <td
                        key={dayIdx}
                        data-today={day.isToday ? 'true' : 'false'}
                        title={holiday?.name}
                        className={`px-1 py-1 text-center align-top min-h-[60px] cursor-default ${
                          !day.isCurrentMonth ? 'opacity-30' : ''
                        }`}
                        style={{
                          color: colors.dateText,
                          backgroundColor: colors.cellBackground,
                        }}
                      >
                        <div
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                            day.isToday
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {day.day}
                        </div>
                        {holiday && day.isCurrentMonth && (
                          <div
                            className="text-[9px] leading-tight mt-0.5 truncate px-0.5"
                            style={{ color: colors.eventText }}
                          >
                            {holiday.name}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
