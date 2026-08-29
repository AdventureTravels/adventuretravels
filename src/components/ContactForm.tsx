'use client'

import { useState } from 'react'
import { Button } from './Button'
import { FormField, SelectField } from './FormField'

type FieldKey = 'name' | 'email' | 'subject' | 'message'

type FormState = Record<FieldKey, string>

const emptyState: FormState = { name: '', email: '', subject: '', message: '' }

const subjectOptions = [
  { label: 'Algemeen', value: 'algemeen' },
  { label: 'Boeking', value: 'boeking' },
  { label: 'Groepen & bedrijven', value: 'groepen-bedrijven' },
]

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
  if (key === 'subject' && !value.trim()) {
    return 'Kies een onderwerp.'
  }
  if (key === 'message' && !value.trim()) {
    return 'Laat ons weten waar we mee kunnen helpen.'
  }
  return null
}

const fieldOrder: FieldKey[] = ['name', 'email', 'subject', 'message']

export function ContactForm() {
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
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-3 border border-line bg-white p-10 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h3 className="font-body text-xl font-medium text-departure">Bericht verstuurd.</h3>
        <p className="font-body text-sm font-light leading-relaxed text-muted">
          We reageren binnen 1 werkdag.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 border border-line bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-10"
    >
      <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-accent-label">
        Formulier
      </span>

      {errorCount > 0 && (
        <p className="border border-accent-label bg-[#FDF6F3] px-4 py-3 font-body text-sm text-accent-label">
          {errorCount === 1
            ? 'Eén veld vraagt nog aandacht. Controleer het gemarkeerde veld en verstuur opnieuw.'
            : 'Twee velden vragen nog aandacht. Controleer de gemarkeerde velden en verstuur opnieuw.'}
        </p>
      )}

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
      <SelectField
        label="Onderwerp"
        name="subject"
        required
        placeholder="Algemeen / boeking / groepen & bedrijven"
        value={values.subject}
        onChange={(v) => setValues((s) => ({ ...s, subject: v }))}
        onBlur={() => handleBlur('subject')}
        error={errors.subject}
        options={subjectOptions}
      />
      <FormField
        label="Bericht"
        name="message"
        type="textarea"
        rows={5}
        required
        value={values.message}
        onChange={(v) => setValues((s) => ({ ...s, message: v }))}
        onBlur={() => handleBlur('message')}
        error={errors.message}
      />

      <div className="flex flex-col gap-2">
        <Button type="submit" variant="primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Versturen…' : 'Verstuur'}
        </Button>
        {status === 'error' && (
          <p className="font-body text-xs text-accent-label">
            Er ging iets mis bij het versturen. Probeer het opnieuw of bel ons direct.
          </p>
        )}
      </div>
    </form>
  )
}
