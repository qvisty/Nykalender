'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  fetchCalendars,
  deleteCalendar,
  generateShareToken,
  revokeShareToken,
  CalendarMeta,
} from '@/lib/calendars/api'

export default function ArkivPage() {
  const [calendars, setCalendars] = useState<CalendarMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      setCalendars(await fetchCalendars())
      setError(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ukendt fejl')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Slet denne kalender?')) return
    await deleteCalendar(id)
    load()
  }

  async function handleShare(cal: CalendarMeta) {
    if (cal.share_token) {
      await revokeShareToken(cal.id)
    } else {
      await generateShareToken(cal.id)
    }
    load()
  }

  function shareUrl(token: string) {
    return `${window.location.origin}/?share=${token}`
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kalenderarkiv</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Tilbage til kalender
        </Link>
      </div>

      {loading && <p className="text-gray-500 text-sm">Indlæser…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && calendars.length === 0 && (
        <p className="text-gray-500 text-sm">
          Ingen gemte kalendere endnu. Gå til kalenderen og tryk <strong>Gem kalender</strong>.
        </p>
      )}

      <ul className="space-y-3">
        {calendars.map((cal) => (
          <li key={cal.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{cal.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Opdateret: {new Date(cal.updated_at).toLocaleDateString('da-DK')}
                </p>
                {cal.share_token && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      readOnly
                      value={shareUrl(cal.share_token)}
                      className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 font-mono truncate"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl(cal.share_token!))}
                      className="text-xs text-blue-600 hover:underline shrink-0"
                    >
                      Kopiér
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/?load=${cal.id}`}
                  className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-50"
                >
                  Åbn
                </Link>
                <button
                  onClick={() => handleShare(cal)}
                  className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                    cal.share_token
                      ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                      : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {cal.share_token ? 'Fjern deling' : 'Del'}
                </button>
                <button
                  onClick={() => handleDelete(cal.id)}
                  className="px-3 py-1.5 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Slet
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
