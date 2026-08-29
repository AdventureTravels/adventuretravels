'use client'

import { CheckCircleIcon, ChevronDownIcon, ErrorIcon } from './icons'

const fieldBaseClass =
  'w-full border px-4 py-3 font-body text-sm text-departure outline-none transition-colors placeholder:text-dune focus:border-departure focus:shadow-[inset_0_0_0_1px_#C7513C]'

function fieldStateClass(error?: string | null) {
  return error ? 'border-accent-label bg-[#FDF6F3]' : 'border-line bg-white'
}

type FormFieldProps = {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'textarea'
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string | null
  rows?: number
}

export function FormField({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  rows,
}: FormFieldProps) {
  const id = name
  const filled = value.trim().length > 0 && !error

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-body text-[11px] font-medium uppercase tracking-[0.12em] text-departure"
      >
        {label}
        {required && ' *'}
      </label>
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            required={required}
            placeholder={placeholder}
            rows={rows ?? 4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={Boolean(error)}
            className={`${fieldBaseClass} ${fieldStateClass(error)} resize-none`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={Boolean(error)}
            className={`${fieldBaseClass} ${fieldStateClass(error)} ${error || filled ? 'pr-10' : ''}`}
          />
        )}
        {error && (
          <ErrorIcon className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-accent-label" />
        )}
        {!error && filled && (
          <CheckCircleIcon className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-trail" />
        )}
      </div>
      {error && <p className="font-body text-xs leading-relaxed text-accent-label">{error}</p>}
    </div>
  )
}

type SelectFieldProps = {
  label: string
  name: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string | null
  options: { label: string; value: string }[]
}

export function SelectField({
  label,
  name,
  required,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  options,
}: SelectFieldProps) {
  const id = name

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-body text-[11px] font-medium uppercase tracking-[0.12em] text-departure"
      >
        {label}
        {required && ' *'}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={`${fieldBaseClass} ${fieldStateClass(error)} appearance-none pr-10 ${
            value ? 'text-departure' : 'text-dune'
          }`}
        >
          <option value="" disabled hidden>
            {placeholder ?? 'Selecteer'}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-departure" />
      </div>
      {error && <p className="font-body text-xs leading-relaxed text-accent-label">{error}</p>}
    </div>
  )
}
