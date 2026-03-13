import Link from 'next/link'
import { signup } from '@/app/auth/actions'

interface SignupPageProps {
  searchParams?: { error?: string }
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Nykalender</h1>
          <p className="text-gray-500 mt-1 text-sm">Opret en ny konto</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {searchParams?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {searchParams.error}
            </div>
          )}

          <form action={signup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="dig@eksempel.dk"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Adgangskode
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-400">Mindst 6 tegn</p>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Opret konto
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Har du allerede en konto?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Log ind
          </Link>
        </p>
      </div>
    </main>
  )
}
