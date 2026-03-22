import Link from 'next/link'

interface AuthIndicatorProps {
  user: { email: string } | null
  onLogout?: () => void
}

export default function AuthIndicator({ user, onLogout }: AuthIndicatorProps) {
  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
      >
        Log ind
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/arkiv"
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
      >
        Arkiv
      </Link>
      <Link
        href="/profil"
        className="text-xs text-gray-500 hidden sm:inline truncate max-w-[12rem] hover:underline"
        title="Min profil"
      >
        {user.email}
      </Link>
      <button
        onClick={onLogout}
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
      >
        Log ud
      </button>
    </div>
  )
}
