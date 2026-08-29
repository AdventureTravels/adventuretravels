'use client'

import { useState } from 'react'
import { Button } from './Button'
import { FormField, SelectField } from './FormField'

type SportOption = { label: string; value: string }

type AanvraagType = 'groepsreis' | 'op-maat' | 'bedrijven'

type FieldKey = 'name' | 'email' | 'phone' | 'groupSize' | 'sport' | 'period' | 'budget' | 'notes'

type FormState = Record<FieldKey, string>

const emptyState: FormState = {
  name: '',
  email: '',
  phone: '',
  groupSize: '',
  sport: '',
  period: '',
  budget: '',
  notes: '',
}

function validateField(key: FieldKey, value: string): string | null {
  if (key === 'name' && !value.trim()) {
    return 'Vul je naam in, zodat we je goed kunnen aanspreken.'
  }
  if (key === 'email') {
    if (!value.trim()) return 'Vul je e-mailadres in.'
    const atIndex = value.indexOf('@')
    if (atIndex === -1 || !value.slice(atIndex + 1).includes('.')) {
      return 'Dit e-mailadres lijkt niet compleet — controleer het deel na de @.'
    }
  }
  if (key === 'sport' && !value.trim()) {
    return 'Kies de gewenste sport.'
  }
  return null
}

const fieldOrder: FieldKey[] = ['name', 'email', 'phone', 'groupSize', 'sport', 'period', 'budget', 'notes']

export function AanvraagForm({
  type,
  groupSizeLabel,
  groupSizePlaceholder,
  submitLabel,
  sportOptions,
}: {
  type: AanvraagType
  groupSizeLabel: string
  groupSizePlaceholder: string
  submitLabel: string
  sportOptions: SportOption[]
}) {
  const [values, setValues] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  function handleBlur(key: FieldKey) {
    const error = validateField(key, values[key])
    setErrors((prev) => ({ ...prev, [key]: error ?? undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const nextErrors: Partial<Record<FieldKey, string>> = {}
    for (const key of fieldOrder) {
      const error = validateField(key, values[key])
      if (error) nextErrors[key] = error
    }
    setErrors(nextErrors)

    const firstErrorKey = fieldOrder.find((key) => nextErrors[key])
    if (firstErrorKey) {
      document.getElementById(firstErrorKey)?.focus()
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/aanvragen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...values }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-3 border border-line bg-white p-10 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h3 className="font-body text-xl font-medium text-departure">Bedankt voor je aanvraag.</h3>
        <p className="font-body text-sm font-light leading-relaxed text-muted">
          We reageren binnen 1 werkdag met een programma en offerte.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 border border-line bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-10"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          label="Naam"
          name="name"
          required
          value={values.name}
          onChange={(v) => setValues((s) => ({ ...s, name: v }))}
          onBlur={() => handleBlur('name')}
          error={errors.name}
        />
        <FormField
          label="E-mail"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={(v) => setValues((s) => ({ ...s, email: v }))}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />
        <FormField
          label="Telefoon"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={(v) => setValues((s) => ({ ...s, phone: v }))}
        />
        <FormField
          label={groupSizeLabel}
          name="groupSize"
          placeholder={groupSizePlaceholder}
          value={values.groupSize}
          onChange={(v) => setValues((s) => ({ ...s, groupSize: v }))}
        />
        <SelectField
          label="Gewenste sport"
          name="sport"
          required
          placeholder="Kies een sport"
          value={values.sport}
          onChange={(v) => setValues((s) => ({ ...s, sport: v }))}
          onBlur={() => handleBlur('sport')}
          error={errors.sport}
          options={sportOptions}
        />
        <FormField
          label="Periode"
          name="period"
          placeholder="Bijv. mei — september"
          value={values.period}
          onChange={(v) => setValues((s) => ({ ...s, period: v }))}
        />
        <FormField
          label="Budgetindicatie"
          name="budget"
          placeholder="Bijv. € 750 — € 1.000 p.p."
          value={values.budget}
          onChange={(v) => setValues((s) => ({ ...s, budget: v }))}
        />
      </div>

      <FormField
        label="Toelichting"
        name="notes"
        type="textarea"
        rows={4}
        placeholder="Wat is de gelegenheid, en wat is voor jullie belangrijk?"
        value={values.notes}
        onChange={(v) => setValues((s) => ({ ...s, notes: v }))}
      />

      <div className="flex flex-col gap-2">
        <Button type="submit" variant="primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Versturen…' : submitLabel}
        </Button>
        <p className="font-body text-xs font-light text-muted">We reageren binnen 1 werkdag.</p>
        {status === 'error' && (
          <p className="font-body text-xs text-accent-label">
            Er ging iets mis bij het versturen. Probeer het opnieuw of bel ons direct.
          </p>
        )}
      </div>
    </form>
  )
}
