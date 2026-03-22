/**
 * Builds a safe PDF filename from the calendar title or the period.
 */
export function buildPdfFilename(
  title: string,
  startYear: number,
  startMonth: number,
  _monthCount: number
): string {
  const trimmed = title.trim()
  if (trimmed) {
    const safe = trimmed
      .replace(/[/\\]/g, '-')                          // slashes → dash
      .replace(/[^a-zA-Z0-9æøåÆØÅ \-_.]/g, '-')       // other invalid → dash (keep space)
      .replace(/ *- */g, '-')                           // collapse space-dash-space
      .replace(/-{2,}/g, '-')                           // collapse multiple dashes
      .replace(/^-|-$/g, '')                            // strip leading/trailing dashes
      .trim()
    return `${safe}.pdf`
  }
  const mm = String(startMonth).padStart(2, '0')
  return `kalender-${startYear}-${mm}.pdf`
}
