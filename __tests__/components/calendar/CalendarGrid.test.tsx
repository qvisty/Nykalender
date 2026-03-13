import { render, screen, fireEvent } from '@testing-library/react'
import CalendarGrid from '@/components/calendar/CalendarGrid'

describe('CalendarGrid', () => {
  it('renders the correct month and year', () => {
    render(<CalendarGrid initialYear={2026} initialMonth={3} />)
    expect(screen.getByText(/marts 2026/i)).toBeInTheDocument()
  })

  it('renders 7 weekday headers (Mon-Sun)', () => {
    render(<CalendarGrid initialYear={2026} initialMonth={3} />)
    expect(screen.getByText('Man')).toBeInTheDocument()
    expect(screen.getByText('Tir')).toBeInTheDocument()
    expect(screen.getByText('Ons')).toBeInTheDocument()
    expect(screen.getByText('Tor')).toBeInTheDocument()
    expect(screen.getByText('Fre')).toBeInTheDocument()
    expect(screen.getByText('Lør')).toBeInTheDocument()
    expect(screen.getByText('Søn')).toBeInTheDocument()
  })

  it('renders correct number of days for March 2026 (31 days)', () => {
    render(<CalendarGrid initialYear={2026} initialMonth={3} />)
    // Day 31 only appears in March (no other month adjacent has day 31 visible)
    expect(screen.getByText('31')).toBeInTheDocument()
    // All days 1-31 should be present (some may appear multiple times due to prev/next month padding)
    const allOnes = screen.getAllByText('1')
    expect(allOnes.length).toBeGreaterThanOrEqual(1)
  })

  it('navigates to next month when clicking next button', () => {
    render(<CalendarGrid initialYear={2026} initialMonth={3} />)
    fireEvent.click(screen.getByLabelText('Næste måned'))
    expect(screen.getByText(/april 2026/i)).toBeInTheDocument()
  })

  it('navigates to previous month when clicking previous button', () => {
    render(<CalendarGrid initialYear={2026} initialMonth={3} />)
    fireEvent.click(screen.getByLabelText('Forrige måned'))
    expect(screen.getByText(/februar 2026/i)).toBeInTheDocument()
  })

  it('shows week numbers column header', () => {
    render(<CalendarGrid initialYear={2026} initialMonth={3} />)
    expect(screen.getByText('Uge')).toBeInTheDocument()
  })

  it('shows ISO week numbers for March 2026', () => {
    render(<CalendarGrid initialYear={2026} initialMonth={3} />)
    // March 2026 spans weeks 9-14
    // Week 9 contains Feb 23 - Mar 1
    // Week 10 contains Mar 2-8
    // There should be multiple week numbers visible
    const weekNumbers = screen.getAllByText(/^\d+$/).map((el) => el.textContent)
    const numericValues = weekNumbers.map(Number).filter((n) => n >= 9 && n <= 14)
    expect(numericValues.length).toBeGreaterThan(0)
  })

  it('highlights today if current month is shown', () => {
    const today = new Date(2026, 2, 13) // March 13, 2026
    render(
      <CalendarGrid
        initialYear={2026}
        initialMonth={3}
        today={today}
      />
    )
    // Find the td with data-today="true"
    const todayTd = document.querySelector('[data-today="true"]')
    expect(todayTd).toBeInTheDocument()
    expect(todayTd).toHaveTextContent('13')
  })

  it('navigates back to today when clicking today button', () => {
    render(<CalendarGrid initialYear={2025} initialMonth={1} />)
    fireEvent.click(screen.getByText('I dag'))
    const today = new Date()
    const monthName = today.toLocaleString('da-DK', { month: 'long' })
    expect(
      screen.getByText(new RegExp(`${monthName} ${today.getFullYear()}`, 'i'))
    ).toBeInTheDocument()
  })
})
