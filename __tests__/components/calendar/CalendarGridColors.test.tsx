import { render, screen } from '@testing-library/react'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import { DEFAULT_CALENDAR_COLORS, CalendarColors } from '@/components/calendar/calendarColors'

describe('CalendarGrid farve-props', () => {
  const today = new Date(2025, 0, 15) // 15. januar 2025

  it('renderer uden farve-props (standardfarver)', () => {
    render(<CalendarGrid today={today} />)
    expect(screen.getByText('Man')).toBeInTheDocument()
  })

  it('anvender brugerdefineret header-tekstfarve på ugedage', () => {
    const colors: CalendarColors = {
      ...DEFAULT_CALENDAR_COLORS,
      headerText: '#ff00ff',
    }
    render(<CalendarGrid today={today} colors={colors} />)
    const manHeader = screen.getByText('Man')
    expect(manHeader).toHaveStyle({ color: '#ff00ff' })
  })

  it('anvender brugerdefineret header-baggrund', () => {
    const colors: CalendarColors = {
      ...DEFAULT_CALENDAR_COLORS,
      headerBackground: '#123456',
    }
    render(<CalendarGrid today={today} colors={colors} />)
    const manHeader = screen.getByText('Man')
    const th = manHeader.closest('th')
    expect(th).toHaveStyle({ backgroundColor: '#123456' })
  })

  it('anvender brugerdefineret datofelter-tekstfarve', () => {
    const colors: CalendarColors = {
      ...DEFAULT_CALENDAR_COLORS,
      dateText: '#00ff00',
    }
    render(<CalendarGrid today={today} colors={colors} />)
    // Dag 10 er unik i januar 2025 visningen (vises ikke i overflow)
    const dayTen = screen.getByText('10')
    const td = dayTen.closest('td')
    expect(td).toHaveStyle({ color: '#00ff00' })
  })

  it('anvender brugerdefineret cellebaggrund', () => {
    const colors: CalendarColors = {
      ...DEFAULT_CALENDAR_COLORS,
      cellBackground: '#ffe0e0',
    }
    render(<CalendarGrid today={today} colors={colors} />)
    const dayTen = screen.getByText('10')
    const td = dayTen.closest('td')
    expect(td).toHaveStyle({ backgroundColor: '#ffe0e0' })
  })

  it('anvender brugerdefineret begivenhedstekst-farve på helligdage', () => {
    // 1. januar 2025 er nytårsdag (helligdag)
    const januarToday = new Date(2025, 0, 15)
    const colors: CalendarColors = {
      ...DEFAULT_CALENDAR_COLORS,
      eventText: '#9900cc',
    }
    render(<CalendarGrid today={januarToday} colors={colors} />)
    // Nytårsdag-teksten skal have den brugerdefinerede farve
    const nytaar = screen.getByText('Nytårsdag')
    expect(nytaar).toHaveStyle({ color: '#9900cc' })
  })
})
