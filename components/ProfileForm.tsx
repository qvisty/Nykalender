'use client'

import { useState } from 'react'

interface ProfileFormProps {
  email: string
  onChangePassword: (newPassword: string) => void
  onDeleteAccount: () => void
}

export default function ProfileForm({ email, onChangePassword, onDeleteAccount }: ProfileFormProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="space-y-6">
      {/* Konto-info */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-700 mb-3">Konto</h2>
        <p className="text-sm text-gray-500">E-mail</p>
        <p className="font-medium text-gray-800">{email}</p>
      </section>

      {/* Skift adgangskode */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-700 mb-3">Skift adgangskode</h2>
        <div className="flex gap-2">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ny adgangskode"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => { onChangePassword(newPassword); setNewPassword('') }}
            disabled={!newPassword.trim()}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-40"
          >
            Opdater
          </button>
        </div>
      </section>

      {/* Slet konto */}
      <section className="bg-white rounded-xl border border-red-100 p-5">
        <h2 className="font-semibold text-red-700 mb-3">Slet konto</h2>
        <p className="text-sm text-gray-500 mb-3">
          Denne handling er permanent og kan ikke fortrydes.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 rounded border border-red-300 text-red-600 text-sm hover:bg-red-50"
          >
            Slet konto
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-red-700 font-medium">Er du sikker?</span>
            <button
              onClick={onDeleteAccount}
              className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700"
            >
              Ja, slet
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50"
            >
              Annuller
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
