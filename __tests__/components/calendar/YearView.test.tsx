import React from 'react'
import { render, screen } from '@testing-library/react'
import YearView from '@/components/calendar/YearView'
import { CalendarEvent } from '@/lib/events/types'

const DANISH_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec',
]

describe('YearView – månedsoverskrifter', () => {
  it('viser 12 månedsoverskrifter startende fra januar (standard)', () => {
    render(<YearView startYear={2025} startMonth={1} today={new Date('2025-03-15')} />)
    DANISH_MONTHS.forEach((m) => {
      expect(screen.getByText(m)).toBeInTheDocument()
    })
  })

  it('viser kun 3 overskrifter når monthCount=3', () => {
    render(<YearView startYear={2025} startMonth={1} monthCount={3} today={new Date('2025-03-15')} />)
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(3)
    expect(headers[0]).toHaveTextContent('Jan')
    expect(headers[1]).toHaveTextContent('Feb')
    expect(headers[2]).toHaveTextContent('Mar')
  })

  it('viser kun 6 overskrifter når monthCount=6', () => {
    render(<YearView startYear={2025} startMonth={7} monthCount={6} today={new Date('2025-08-01')} />)
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(6)
    expect(headers[0]).toHaveTextContent('Jul')
    expect(headers[5]).toHaveTextContent('Dec')
  })

  it('viser kun 1 overskrift når monthCount=1', () => {
    render(<YearView startYear={2025} startMonth={5} monthCount={1} today={new Date('2025-05-10')} />)
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(1)
    expect(headers[0]).toHaveTextContent('Maj')
  })

  it('starter med August når startMonth=8 (skoleår)', () => {
    render(<YearView startYear={2025} startMonth={8} today={new Date('2025-09-01')} />)
    const headers = screen.getAllByRole('columnheader')
    // First content header should be Aug
    expect(headers[0]).toHaveTextContent('Aug')
  })

  it('viser korrekte måneder i rækkefølge for skoleår aug–jul', () => {
    render(<YearView startYear={2025} startMonth={8} today={new Date('2025-09-01')} />)
    const headers = screen.getAllByRole('columnheader')
    const expectedOrder = ['Aug', 'Sep', 'Okt', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul']
    expectedOrder.forEach((month, i) => {
      expect(headers[i]).toHaveTextContent(month)
    })
  })
})

describe('YearView – dage og rækketal', () => {
  it('viser rækker for dag 1–31', () => {
    render(<YearView startYear={2025} startMonth={1} today={new Date('2025-03-15')} />)
    // Row labels 1-31 should all be visible
    for (let d = 1; d <= 31; d++) {
      const cells = screen.getAllByText(String(d))
      expect(cells.length).toBeGreaterThan(0)
    }
  })

  it('februar 2025 har kun 28 dage – dag 29 er tom i feb-kolonne', () => {
    render(<YearView startYear={2025} startMonth={1} today={new Date('2025-03-15')} />)
    // day 29 cell for February should be empty (no date)
    const row29 = screen.getByTestId('row-29')
    const febCell = row29.querySelector('[data-month="2"]')
    expect(febCell).toHaveTextContent('')
  })

  it('februar 2024 (skudår) har 29 dage', () => {
    render(<YearView startYear={2024} startMonth={1} today={new Date('2024-03-15')} />)
    const row29 = screen.getByTestId('row-29')
    const febCell = row29.querySelector('[data-month="2"]')
    expect(febCell).not.toHaveTextContent('')
  })
})

describe('YearView – ugenumre', () => {
  it('viser ugenummer på mandage', () => {
    // 2025-01-06 is a Monday (week 2)
    render(<YearView startYear={2025} startMonth={1} today={new Date('2025-01-15')} />)
    expect(screen.getByTestId('weeknum-2025-01-06')).toBeInTheDocument()
  })
})

describe('YearView – i dag', () => {
  it('markerer dags dato med data-today attribut', () => {
    render(<YearView startYear={2025} startMonth={1} today={new Date('2025-03-15')} />)
    const todayCell = screen.getByTestId('day-2025-03-15')
    expect(todayCell).toHaveAttribute('data-today', 'true')
  })
})

describe('YearView – begivenheder', () => {
  const events: CalendarEvent[] = [
    { id: 'e1', date: '2025-08-11', title: 'Første skoledag', color: 'yellow' },
    { id: 'e2', date: '2025-12-24', title: 'Juleaften', color: 'red' },
  ]

  it('viser begivenhedstitel i den korrekte celle', () => {
    render(
      <YearView startYear={2025} startMonth={8} today={new Date('2025-09-01')} events={events} />
    )
    expect(screen.getByText('Første skoledag')).toBeInTheDocument()
    expect(screen.getByText('Juleaften')).toBeInTheDocument()
  })

  it('begivenhed har data-color attribut med den valgte farve', () => {
    render(
      <YearView startYear={2025} startMonth={1} today={new Date('2025-03-15')} events={events} />
    )
    const juleCell = screen.getByTestId('day-2025-12-24')
    expect(juleCell).toHaveAttribute('data-color', 'red')
  })
})

describe('YearView – helligdage', () => {
  it('viser helligdagsnavn for nytårsdag', () => {
    render(<YearView startYear={2025} startMonth={1} today={new Date('2025-03-15')} />)
    expect(screen.getByText('Nytårsdag')).toBeInTheDocument()
  })
})
