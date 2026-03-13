import CalendarGrid from '@/components/calendar/CalendarGrid'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">Nykalender</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CalendarGrid />
      </div>
    </main>
  )
}
