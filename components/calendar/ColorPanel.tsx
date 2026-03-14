'use client'

import { CalendarColors, DEFAULT_CALENDAR_COLORS } from './calendarColors'

interface ColorPanelProps {
  colors: CalendarColors
  onChange: (colors: CalendarColors) => void
  onExport: () => void
}

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={`color-${label}`}
        className="text-sm text-gray-600 flex-1"
      >
        {label}
      </label>
      <input
        id={`color-${label}`}
        aria-label={label}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-gray-200"
      />
    </div>
  )
}

export default function ColorPanel({ colors, onChange, onExport }: ColorPanelProps) {
  function update(key: keyof CalendarColors, value: string) {
    onChange({ ...colors, [key]: value })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-56 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-700">Tilpas farver</h3>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Kolonne-headers
        </p>
        <ColorField
          label="Kolonne-headers tekst"
          value={colors.headerText}
          onChange={(v) => update('headerText', v)}
        />
        <ColorField
          label="Kolonne-headers baggrund"
          value={colors.headerBackground}
          onChange={(v) => update('headerBackground', v)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Datofelter
        </p>
        <ColorField
          label="Datofelter tekst"
          value={colors.dateText}
          onChange={(v) => update('dateText', v)}
        />
        <ColorField
          label="Cellebaggrunde"
          value={colors.cellBackground}
          onChange={(v) => update('cellBackground', v)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Begivenheder
        </p>
        <ColorField
          label="Begivenhedstekst"
          value={colors.eventText}
          onChange={(v) => update('eventText', v)}
        />
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={onExport}
          className="w-full py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Eksportér PDF
        </button>
        <button
          onClick={() => onChange(DEFAULT_CALENDAR_COLORS)}
          className="w-full py-2 px-3 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          Nulstil
        </button>
      </div>
    </div>
  )
}
