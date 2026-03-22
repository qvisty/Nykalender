import { buildEditForm } from '@/lib/events/editForm'
import { CalendarEvent } from '@/lib/events/types'

describe('buildEditForm', () => {
  it('mapper alle grundfelter', () => {
    const event: CalendarEvent = {
      id: 'e1', date: '2025-08-11', title: 'Skoledag', color: 'yellow',
    }
    const form = buildEditForm(event)
    expect(form.date).toBe('2025-08-11')
    expect(form.title).toBe('Skoledag')
    expect(form.color).toBe('yellow')
  })

  it('bevarer columnId', () => {
    const event: CalendarEvent = {
      id: 'e1', date: '2025-08-11', title: 'Tandlæge', color: 'blue', columnId: 'col-1',
    }
    expect(buildEditForm(event).columnId).toBe('col-1')
  })

  it('bevarer recurrence', () => {
    const event: CalendarEvent = {
      id: 'e1', date: '2025-06-15', title: 'Fødselsdag [1990]', color: 'purple', recurrence: 'yearly',
    }
    expect(buildEditForm(event).recurrence).toBe('yearly')
  })

  it('sætter columnId til undefined når det ikke er angivet', () => {
    const event: CalendarEvent = { id: 'e1', date: '2025-01-01', title: 'Test', color: 'green' }
    expect(buildEditForm(event).columnId).toBeUndefined()
  })

  it('sætter recurrence til undefined når det ikke er angivet', () => {
    const event: CalendarEvent = { id: 'e1', date: '2025-01-01', title: 'Test', color: 'green' }
    expect(buildEditForm(event).recurrence).toBeUndefined()
  })
})
