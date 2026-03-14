'use client'

import { useRef, useState } from 'react'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import ColorPanel from '@/components/calendar/ColorPanel'
import { CalendarColors, DEFAULT_CALENDAR_COLORS } from '@/components/calendar/calendarColors'

export default function Home() {
  const [colors, setColors] = useState<CalendarColors>(DEFAULT_CALENDAR_COLORS)
  const calendarRef = useRef<HTMLDivElement>(null)

  async function handleExport() {
    if (!calendarRef.current) return

    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default

    const canvas = await html2canvas(calendarRef.current, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
    pdf.save('kalender.pdf')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">Nykalender</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          <div ref={calendarRef} className="flex-1">
            <CalendarGrid colors={colors} />
          </div>
          <ColorPanel
            colors={colors}
            onChange={setColors}
            onExport={handleExport}
          />
        </div>
      </div>
    </main>
  )
}
