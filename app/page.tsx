'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import YearView from '@/components/calendar/YearView'
import { CalendarEvent, EventColor, EVENT_COLORS } from '@/lib/events/types'
import { getEvents, saveEvent, deleteEvent } from '@/lib/events/storage'
import { nanoid } from 'nanoid'

const COLOR_LABELS: Record<EventColor, string> = {
  yellow: 'Gul',
  green:  'Grøn',
  blue:   'Blå',
  purple: 'Lilla',
  red:    'Rød',
  pink:   'Pink',
  gray:   'Grå',
}

const COLOR_BG: Record<EventColor, string> = {
  yellow: '#fef08a',
  green:  '#bbf7d0',
  blue:   '#bfdbfe',
  purple: '#e9d5ff',
  red:    '#fecaca',
  pink:   '#fbcfe8',
  gray:   '#e5e7eb',
}

const MONTH_NAMES = [
  'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'December',
]

interface EventFormState {
  date: string
  title: string
  color: EventColor
}

export default function Home() {
  const today = new Date()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [startMonth, setStartMonth] = useState(1)
  const [startYear, setStartYear] = useState(today.getFullYear())
  const [monthCount, setMonthCount] = useState<1 | 3 | 6 | 12>(12)
  const [form, setForm] = useState<EventFormState | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  function openNewEvent(date?: string) {
    setEditId(null)
    setForm({
      date: date ?? today.toISOString().slice(0, 10),
      title: '',
      color: 'yellow',
    })
  }

  function openEditEvent(event: CalendarEvent) {
    setEditId(event.id)
    setForm({ date: event.date, title: event.title, color: event.color })
  }

  function closeForm() {
    setForm(null)
    setEditId(null)
  }

  function handleSave() {
    if (!form || !form.title.trim()) return
    const event: CalendarEvent = {
      id: editId ?? nanoid(),
      date: form.date,
      title: form.title.trim(),
      color: form.color,
    }
    saveEvent(event)
    setEvents(getEvents())
    closeForm()
  }

  function handleDelete(id: string) {
    deleteEvent(id)
    setEvents(getEvents())
  }

  async function handleExport() {
    if (!calendarRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default
    const canvas = await html2canvas(calendarRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
    pdf.save('kalender.pdf')
  }

  const endMonth = ((startMonth - 2 + 11) % 12) + 1
  const endYear = startYear + (startMonth === 1 ? 0 : 1)
  const periodLabel =
    startMonth === 1
      ? `${startYear}`
      : `${MONTH_NAMES[startMonth - 1].slice(0, 3)} ${startYear} – ${MONTH_NAMES[endMonth - 1].slice(0, 3)} ${endYear}`

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-blue-600">Nykalender</h1>

          {/* Period controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600 font-medium">Startmåned:</label>
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600 font-medium">År:</label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600 font-medium">Måneder:</label>
              <select
                value={monthCount}
                onChange={(e) => setMonthCount(Number(e.target.value) as 1 | 3 | 6 | 12)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>
            </div>
            <span className="text-gray-500 text-sm">{periodLabel}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openNewEvent()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
            >
              + Ny begivenhed
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
            >
              Eksport PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-4 flex gap-4 items-start">
        {/* Calendar */}
        <div ref={calendarRef} className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-2">
          <YearView
            startYear={startYear}
            startMonth={startMonth}
            monthCount={monthCount}
            today={today}
            events={events}
          />
        </div>

        {/* Event list sidebar */}
        <aside className="w-60 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
            <h2 className="font-semibold text-gray-700 text-sm mb-2">Begivenheder</h2>
            {events.length === 0 && (
              <p className="text-xs text-gray-400">Ingen begivenheder endnu.</p>
            )}
            <ul className="space-y-1">
              {events
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-center gap-1.5 text-xs rounded px-2 py-1 cursor-pointer hover:bg-gray-50 group"
                    style={{ backgroundColor: COLOR_BG[ev.color] }}
                  >
                    <span className="flex-1 truncate font-medium text-gray-700">
                      {ev.date.slice(5).replace('-', '/') + ' ' + ev.title}
                    </span>
                    <button
                      onClick={() => openEditEvent(ev)}
                      className="hidden group-hover:inline text-gray-500 hover:text-blue-600"
                      title="Rediger"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="hidden group-hover:inline text-gray-500 hover:text-red-600"
                      title="Slet"
                    >
                      ✕
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Event form modal */}
      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 className="font-semibold text-gray-800 mb-4">
              {editId ? 'Rediger begivenhed' : 'Ny begivenhed'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Dato</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Titel</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Begivenhedens navn"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Farve</label>
                <div className="flex gap-1 flex-wrap">
                  {EVENT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm({ ...form, color: c })}
                      title={COLOR_LABELS[c]}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        form.color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: COLOR_BG[c] }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={closeForm}
                className="px-4 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50"
              >
                Annuller
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="px-4 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-40"
              >
                Gem
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
