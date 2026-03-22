'use client'

import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import YearView from '@/components/calendar/YearView'
import CalendarHeader, { HeaderAlign } from '@/components/calendar/CalendarHeader'
import { CalendarEvent, EventColor, EVENT_COLORS } from '@/lib/events/types'
import { getEvents, saveEvent, deleteEvent } from '@/lib/events/storage'
import { CalendarColumn, DEFAULT_COLUMN_COLORS } from '@/lib/events/columns'
import { getColumns, saveColumn, deleteColumn } from '@/lib/events/columnStorage'
import { expandRecurringEvents } from '@/lib/events/recurrence'
import { RecurrenceType } from '@/lib/events/types'
import { parseEventText } from '@/lib/events/textImport'
import { serializeCalendarState, deserializeCalendarState } from '@/lib/calendars/snapshot'
import { saveCalendar, fetchSharedCalendar, fetchCalendar } from '@/lib/calendars/api'
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
  columnId?: string
  recurrence?: RecurrenceType
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  )
}

function HomeInner() {
  const searchParams = useSearchParams()
  const today = new Date()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [startMonth, setStartMonth] = useState(1)
  const [startYear, setStartYear] = useState(today.getFullYear())
  const [monthCount, setMonthCount] = useState<1 | 3 | 6 | 12>(12)
  const [calTitle, setCalTitle] = useState('')
  const [calTitleAlign, setCalTitleAlign] = useState<HeaderAlign>('center')
  const [showYear, setShowYear] = useState(false)
  const [columns, setColumns] = useState<CalendarColumn[]>([])
  const [newColName, setNewColName] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [showSave, setShowSave] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isSharedView, setIsSharedView] = useState(false)
  const [form, setForm] = useState<EventFormState | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const shareToken = searchParams.get('share')
    const loadId = searchParams.get('load')

    if (shareToken) {
      fetchSharedCalendar(shareToken).then((result) => {
        if (result) {
          applySnapshot(deserializeCalendarState(result.data))
          setIsSharedView(true)
        }
      })
    } else if (loadId) {
      fetchCalendar(loadId).then((result) => {
        if (result) {
          applySnapshot(deserializeCalendarState(result.data))
        }
      })
      setEvents(getEvents())
      setColumns(getColumns())
    } else {
      setEvents(getEvents())
      setColumns(getColumns())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      columnId: form.columnId || undefined,
      recurrence: form.recurrence || undefined,
    }
    saveEvent(event)
    setEvents(getEvents())
    closeForm()
  }

  function handleDelete(id: string) {
    deleteEvent(id)
    setEvents(getEvents())
  }

  function handleAddColumn() {
    if (!newColName.trim()) return
    const col: CalendarColumn = {
      id: nanoid(),
      name: newColName.trim(),
      color: DEFAULT_COLUMN_COLORS[columns.length % DEFAULT_COLUMN_COLORS.length],
    }
    saveColumn(col)
    setColumns(getColumns())
    setNewColName('')
  }

  function handleDeleteColumn(id: string) {
    deleteColumn(id)
    setColumns(getColumns())
  }

  function handleImport() {
    const parsed = parseEventText(importText)
    parsed.forEach((e) => saveEvent(e))
    setEvents(getEvents())
    setImportText('')
    setShowImport(false)
  }

  async function handleSaveCalendar() {
    if (!saveName.trim()) return
    setSaveStatus('saving')
    try {
      const snap = serializeCalendarState({
        events,
        columns,
        settings: { startYear, startMonth, monthCount, calTitle, calTitleAlign, showYear },
      })
      await saveCalendar(saveName.trim(), snap)
      setSaveStatus('saved')
      setTimeout(() => { setShowSave(false); setSaveStatus('idle'); setSaveName('') }, 1200)
    } catch {
      setSaveStatus('error')
    }
  }

  function applySnapshot(data: ReturnType<typeof deserializeCalendarState>) {
    data.events.forEach((e) => saveEvent(e))
    data.columns.forEach((c) => saveColumn(c))
    setEvents(getEvents())
    setColumns(getColumns())
    const s = data.settings
    setStartYear(s.startYear)
    setStartMonth(s.startMonth)
    setMonthCount(s.monthCount)
    setCalTitle(s.calTitle)
    setCalTitleAlign(s.calTitleAlign)
    setShowYear(s.showYear)
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

  // Expand recurring events over the visible period
  const lastMonthIdx = (startMonth - 1 + monthCount - 1) % 12
  const lastYear = startYear + Math.floor((startMonth - 1 + monthCount - 1) / 12)
  const rangeStart = `${startYear}-${String(startMonth).padStart(2, '0')}-01`
  const rangeEnd = `${lastYear}-${String(lastMonthIdx + 1).padStart(2, '0')}-31`
  const expandedEvents = expandRecurringEvents(events, rangeStart, rangeEnd)
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

          {/* Titel-indstillinger */}
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <input
              type="text"
              value={calTitle}
              onChange={(e) => setCalTitle(e.target.value)}
              placeholder="Kalendertitel (valgfri)"
              className="border border-gray-300 rounded px-2 py-1 text-sm w-44"
            />
            <select
              value={calTitleAlign}
              onChange={(e) => setCalTitleAlign(e.target.value as HeaderAlign)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              disabled={!calTitle}
            >
              <option value="left">Venstre</option>
              <option value="center">Centreret</option>
              <option value="right">Højre</option>
            </select>
            <label className="flex items-center gap-1 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showYear}
                onChange={(e) => setShowYear(e.target.checked)}
                disabled={!calTitle}
              />
              Vis år
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isSharedView && (
              <>
                <button
                  onClick={() => openNewEvent()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                >
                  + Ny begivenhed
                </button>
                <button
                  onClick={() => setShowImport(true)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
                >
                  Importer tekst
                </button>
                <button
                  onClick={() => setShowSave(true)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
                >
                  Gem kalender
                </button>
                <a
                  href="/arkiv"
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
                >
                  Arkiv
                </a>
              </>
            )}
            {isSharedView && (
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                Delt kalender (skrivebeskyttet)
              </span>
            )}
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
          <CalendarHeader
            title={calTitle}
            year={startYear}
            showYear={showYear}
            align={calTitleAlign}
          />
          <YearView
            startYear={startYear}
            startMonth={startMonth}
            monthCount={monthCount}
            today={today}
            events={expandedEvents}
            columns={columns}
          />
        </div>

        {/* Event list sidebar */}
        <aside className="w-60 shrink-0 space-y-3">
          {/* Kolonner */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
            <h2 className="font-semibold text-gray-700 text-sm mb-2">Kolonner</h2>
            <ul className="space-y-1 mb-2">
              {columns.map((col) => (
                <li key={col.id} className="flex items-center gap-1.5 text-xs rounded px-2 py-1 group" style={{ backgroundColor: col.color }}>
                  <span className="flex-1 font-medium text-gray-700">{col.name}</span>
                  <button
                    onClick={() => handleDeleteColumn(col.id)}
                    className="hidden group-hover:inline text-gray-500 hover:text-red-600"
                    title="Slet kolonne"
                  >✕</button>
                </li>
              ))}
            </ul>
            <div className="flex gap-1">
              <input
                type="text"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                placeholder="Ny kolonne..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
              />
              <button
                onClick={handleAddColumn}
                disabled={!newColName.trim()}
                className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 disabled:opacity-40"
              >+</button>
            </div>
          </div>

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
              {columns.length > 0 && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Kolonne</label>
                  <select
                    value={form.columnId ?? ''}
                    onChange={(e) => setForm({ ...form, columnId: e.target.value || undefined })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  >
                    <option value="">— Ingen kolonne —</option>
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Gentagelse</label>
                <select
                  value={form.recurrence ?? ''}
                  onChange={(e) => setForm({ ...form, recurrence: (e.target.value as RecurrenceType) || undefined })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                >
                  <option value="">— Ingen gentagelse —</option>
                  <option value="weekly">Ugentlig</option>
                  <option value="monthly">Månedlig</option>
                  <option value="yearly">Årlig</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">Tip: skriv [årstal] i titlen for at vise alder, f.eks. "Fødselsdag [1990]"</p>
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

      {/* Import modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h2 className="font-semibold text-gray-800 mb-1">Importer begivenheder</h2>
            <p className="text-xs text-gray-500 mb-3">
              Ét event per linje:<br />
              <code className="bg-gray-100 px-1 rounded">ÅÅÅÅ-MM-DD Titel [farve] [gentagelse]</code><br />
              Farver: gul, grøn, blå, lilla, rød, pink, grå<br />
              Gentagelse: ugentlig, månedlig, årlig
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={'2025-08-11 Første skoledag gul\n2025-12-24 Juleaften rød\n2025-06-15 Mors fødselsdag [1975] lilla årlig'}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono h-40 resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setShowImport(false); setImportText('') }}
                className="px-4 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50"
              >
                Annuller
              </button>
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="px-4 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-40"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gem kalender modal */}
      {showSave && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 className="font-semibold text-gray-800 mb-3">Gem kalender</h2>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCalendar()}
              placeholder="Navn, fx 'Familie 2025/26'"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
              autoFocus
            />
            {saveStatus === 'error' && (
              <p className="text-red-600 text-xs mb-2">Gem mislykkedes — er du logget ind?</p>
            )}
            {saveStatus === 'saved' && (
              <p className="text-green-600 text-xs mb-2">Gemt!</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowSave(false); setSaveStatus('idle'); setSaveName('') }}
                className="px-4 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50"
              >
                Annuller
              </button>
              <button
                onClick={handleSaveCalendar}
                disabled={!saveName.trim() || saveStatus === 'saving'}
                className="px-4 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-40"
              >
                {saveStatus === 'saving' ? 'Gemmer…' : 'Gem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

