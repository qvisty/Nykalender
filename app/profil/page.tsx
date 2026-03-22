'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ProfileForm from '@/components/ProfileForm'

export default function ProfilPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/auth/login')
      } else {
        setEmail(data.user.email ?? null)
      }
    })
  }, [router])

  async function handleChangePassword(newPassword: string) {
    const { error } = await createClient().auth.updateUser({ password: newPassword })
    setStatus(error ? `Fejl: ${error.message}` : 'Adgangskode opdateret.')
  }

  async function handleDeleteAccount() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    // Delete via server action
    const res = await fetch('/api/account', { method: 'DELETE' })
    if (res.ok) {
      await supabase.auth.signOut()
      router.replace('/auth/login')
    } else {
      setStatus('Sletning mislykkedes.')
    }
  }

  if (!email) return null

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Min profil</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Tilbage</Link>
      </div>

      {status && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          status.startsWith('Fejl') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {status}
        </div>
      )}

      <ProfileForm
        email={email}
        onChangePassword={handleChangePassword}
        onDeleteAccount={handleDeleteAccount}
      />
    </main>
  )
}
