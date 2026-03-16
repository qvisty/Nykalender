import React from 'react'
import { render, screen } from '@testing-library/react'
import CalendarHeader from '@/components/calendar/CalendarHeader'

describe('CalendarHeader – titel', () => {
  it('viser den angivne titel', () => {
    render(<CalendarHeader title="Familie 2025/26" />)
    expect(screen.getByText('Familie 2025/26')).toBeInTheDocument()
  })

  it('viser ikke titel når title er tom streng', () => {
    const { container } = render(<CalendarHeader title="" />)
    expect(container.firstChild).toBeNull()
  })

  it('viser årstal ved siden af titel når showYear=true', () => {
    render(<CalendarHeader title="Emmerske" year={2025} showYear />)
    expect(screen.getByText('Emmerske')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('skjuler årstal når showYear=false', () => {
    render(<CalendarHeader title="Emmerske" year={2025} showYear={false} />)
    expect(screen.queryByText('2025')).not.toBeInTheDocument()
  })
})

describe('CalendarHeader – placering', () => {
  it('centrerer tekst som standard', () => {
    render(<CalendarHeader title="Kalender" />)
    const el = screen.getByRole('banner')
    expect(el).toHaveAttribute('data-align', 'center')
  })

  it('venstrejusterer når align=left', () => {
    render(<CalendarHeader title="Kalender" align="left" />)
    const el = screen.getByRole('banner')
    expect(el).toHaveAttribute('data-align', 'left')
  })

  it('højrejusterer når align=right', () => {
    render(<CalendarHeader title="Kalender" align="right" />)
    const el = screen.getByRole('banner')
    expect(el).toHaveAttribute('data-align', 'right')
  })
})
