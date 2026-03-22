import React from 'react'
import { render, screen } from '@testing-library/react'
import AuthIndicator from '@/components/AuthIndicator'

describe('AuthIndicator – ikke logget ind', () => {
  it('viser Log ind-link', () => {
    render(<AuthIndicator user={null} />)
    expect(screen.getByRole('link', { name: /log ind/i })).toBeInTheDocument()
  })

  it('viser ikke arkiv-link', () => {
    render(<AuthIndicator user={null} />)
    expect(screen.queryByRole('link', { name: /arkiv/i })).not.toBeInTheDocument()
  })
})

describe('AuthIndicator – logget ind', () => {
  const user = { email: 'test@eksempel.dk' }

  it('viser brugerens e-mail', () => {
    render(<AuthIndicator user={user} />)
    expect(screen.getByText('test@eksempel.dk')).toBeInTheDocument()
  })

  it('viser Arkiv-link', () => {
    render(<AuthIndicator user={user} />)
    expect(screen.getByRole('link', { name: /arkiv/i })).toBeInTheDocument()
  })

  it('viser Log ud-knap', () => {
    render(<AuthIndicator user={user} onLogout={jest.fn()} />)
    expect(screen.getByRole('button', { name: /log ud/i })).toBeInTheDocument()
  })

  it('kalder onLogout ved klik', async () => {
    const onLogout = jest.fn()
    render(<AuthIndicator user={user} onLogout={onLogout} />)
    screen.getByRole('button', { name: /log ud/i }).click()
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
