import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nykalender',
  description: 'Dansk kalenderapplikation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}
