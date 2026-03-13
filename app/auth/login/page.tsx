import Link from 'next/link'
import { login } from '@/app/auth/actions'

interface LoginPageProps {
  searchParams?: { error?: string; message?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Nykalender</h1>
          <p className="text-gray-500 mt-1 text-sm">Log ind på din konto</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {searchParams?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {searchParams.error}
            </div>
          )}
          {searchParams?.message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {searchParams.message}
            </div>
          )}

          <form action={login} className="space-y-4">
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
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Log ind
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Ingen konto?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Opret konto
          </Link>
        </p>
      </div>
    </main>
  )
}
