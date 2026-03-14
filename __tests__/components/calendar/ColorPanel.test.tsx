import { render, screen, fireEvent } from '@testing-library/react'
import ColorPanel from '@/components/calendar/ColorPanel'
import { DEFAULT_CALENDAR_COLORS } from '@/components/calendar/calendarColors'

describe('ColorPanel', () => {
  const mockOnChange = jest.fn()
  const mockOnExport = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
    mockOnExport.mockClear()
  })

  it('renderer farve-panel uden crash', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    expect(screen.getByText('Tilpas farver')).toBeInTheDocument()
  })

  it('viser farvepicker for kolonne-headers tekst', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    expect(screen.getByLabelText('Kolonne-headers tekst')).toBeInTheDocument()
  })

  it('viser farvepicker for kolonne-headers baggrund', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    expect(screen.getByLabelText('Kolonne-headers baggrund')).toBeInTheDocument()
  })

  it('viser farvepicker for datofelter tekst', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    expect(screen.getByLabelText('Datofelter tekst')).toBeInTheDocument()
  })

  it('viser farvepicker for cellebaggrunde', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    expect(screen.getByLabelText('Cellebaggrunde')).toBeInTheDocument()
  })

  it('viser farvepicker for begivenhedstekst', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    expect(screen.getByLabelText('Begivenhedstekst')).toBeInTheDocument()
  })

  it('kalder onChange når en farve ændres', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    const input = screen.getByLabelText('Datofelter tekst')
    fireEvent.change(input, { target: { value: '#ff0000' } })
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ dateText: '#ff0000' })
    )
  })

  it('kalder onExport når eksport-knappen trykkes', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /eksportér pdf/i }))
    expect(mockOnExport).toHaveBeenCalledTimes(1)
  })

  it('har nulstil-knap der kalder onChange med standardfarver', () => {
    render(
      <ColorPanel
        colors={DEFAULT_CALENDAR_COLORS}
        onChange={mockOnChange}
        onExport={mockOnExport}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /nulstil/i }))
    expect(mockOnChange).toHaveBeenCalledWith(DEFAULT_CALENDAR_COLORS)
  })
})
