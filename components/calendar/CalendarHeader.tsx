export type HeaderAlign = 'left' | 'center' | 'right'

interface CalendarHeaderProps {
  title: string
  year?: number
  showYear?: boolean
  align?: HeaderAlign
}

const ALIGN_CLASS: Record<HeaderAlign, string> = {
  left:   'text-left',
  center: 'text-center',
  right:  'text-right',
}

export default function CalendarHeader({
  title,
  year,
  showYear = false,
  align = 'center',
}: CalendarHeaderProps) {
  if (!title) return null

  return (
    <header
      role="banner"
      data-align={align}
      className={`w-full py-2 px-4 ${ALIGN_CLASS[align]}`}
    >
      <span className="text-xl font-bold text-gray-800">{title}</span>
      {showYear && year !== undefined && (
        <span className="ml-2 text-lg font-semibold text-gray-500">{year}</span>
      )}
    </header>
  )
}
