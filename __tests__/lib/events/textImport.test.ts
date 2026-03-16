import { parseEventText } from '@/lib/events/textImport'

describe('parseEventText – enkeltbegivenheder', () => {
  it('parser dato og titel', () => {
    const result = parseEventText('2025-08-11 Første skoledag')
    expect(result).toHaveLength(1)
    expect(result[0].date).toBe('2025-08-11')
    expect(result[0].title).toBe('Første skoledag')
  })

  it('parser dato, titel og farve', () => {
    const result = parseEventText('2025-12-24 Juleaften rød')
    expect(result[0].color).toBe('red')
    expect(result[0].title).toBe('Juleaften')
  })

  it('genkender danske farvenavne', () => {
    const cases: [string, string][] = [
      ['gul', 'yellow'],
      ['grøn', 'green'],
      ['blå', 'blue'],
      ['lilla', 'purple'],
      ['rød', 'red'],
      ['pink', 'pink'],
      ['grå', 'gray'],
    ]
    cases.forEach(([danish, english]) => {
      const result = parseEventText(`2025-01-01 Test ${danish}`)
      expect(result[0].color).toBe(english)
    })
  })

  it('bruger gul som standardfarve når ingen farve er angivet', () => {
    const result = parseEventText('2025-06-15 Fødselsdag')
    expect(result[0].color).toBe('yellow')
  })

  it('parser gentagelsesregel', () => {
    const result = parseEventText('2025-01-06 Møde grøn ugentlig')
    expect(result[0].recurrence).toBe('weekly')
  })

  it('genkender gentagelsesnøgleord', () => {
    expect(parseEventText('2025-01-01 A ugentlig')[0].recurrence).toBe('weekly')
    expect(parseEventText('2025-01-01 A månedlig')[0].recurrence).toBe('monthly')
    expect(parseEventText('2025-01-01 A årlig')[0].recurrence).toBe('yearly')
  })
})

describe('parseEventText – flere linjer', () => {
  it('parser flere begivenheder adskilt af linjeskift', () => {
    const text = `2025-08-11 Første skoledag gul
2025-12-24 Juleaften rød
2026-01-01 Nytår blå`
    const result = parseEventText(text)
    expect(result).toHaveLength(3)
    expect(result[0].date).toBe('2025-08-11')
    expect(result[1].date).toBe('2025-12-24')
    expect(result[2].date).toBe('2026-01-01')
  })

  it('springer tomme linjer over', () => {
    const text = `2025-08-11 Event A

2025-09-01 Event B`
    expect(parseEventText(text)).toHaveLength(2)
  })

  it('springer linjer over med ugyldigt datoformat', () => {
    const text = `dette er ikke en dato
2025-08-11 Gyldig event`
    const result = parseEventText(text)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Gyldig event')
  })
})
