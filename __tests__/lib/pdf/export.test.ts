import { buildPdfFilename } from '@/lib/pdf/export'

describe('buildPdfFilename', () => {
  it('bruger kalendertitlen når den er angivet', () => {
    expect(buildPdfFilename('Familie 2025/26', 2025, 8, 12)).toBe('Familie 2025-26.pdf')
  })

  it('genererer filnavn fra periode når ingen titel', () => {
    expect(buildPdfFilename('', 2025, 1, 12)).toBe('kalender-2025-01.pdf')
  })

  it('erstatter skråstreg og ugyldige tegn med bindestreg', () => {
    expect(buildPdfFilename('Mor & Far / 2025', 2025, 1, 12)).toBe('Mor-Far-2025.pdf')
  })

  it('trimmer whitespace fra titlen', () => {
    expect(buildPdfFilename('  Kalender  ', 2025, 6, 6)).toBe('Kalender.pdf')
  })

  it('bruger periode-format med to måneder for monthCount=1', () => {
    expect(buildPdfFilename('', 2025, 3, 1)).toBe('kalender-2025-03.pdf')
  })
})
