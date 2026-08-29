import Link from 'next/link'
import { Button } from './Button'
import { AvontuurIcon, BestemmingIcon, ChevronDownIcon, SeizoenIcon } from './icons'

type Option = { label: string; value: string }

const sportOptions: Option[] = [
  { label: 'Alle sporten', value: '' },
  { label: 'Wakeboarden', value: 'wakeboarden' },
]
const bestemmingOptions: Option[] = [
  { label: 'Alle bestemmingen', value: '' },
  { label: 'Turkije', value: 'turkije' },
]
const wanneerOptions = ['Hele jaar', 'April', 'Mei', 'Zomer', 'Najaar']
const niveauOptions: Option[] = [
  { label: 'Alle niveaus', value: '' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Gevorderd', value: 'gevorderd' },
]

type PopularFilter = { label: string; href: string }

const defaultPopularFilters: PopularFilter[] = [
  { label: 'Wakeboarden', href: '/reizen?sport=wakeboarden' },
  { label: 'Turkije', href: '/reizen?bestemming=turkije' },
  { label: 'Beginners welkom', href: '/reizen?niveau=beginner' },
]

type FilterFieldProps = {
  icon: React.ReactNode
  label: string
  name?: string
  defaultValue?: string
  options: Option[]
}

function FilterField({ icon, label, name, defaultValue = '', options }: FilterFieldProps) {
  return (
    <label className="flex flex-1 flex-col gap-1 border-b border-line px-4 py-3 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="flex items-center gap-2 font-body text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
        <span className="h-4 w-4 text-departure">{icon}</span>
        {label}
      </span>
      <span className="relative">
        <select
          name={name}
          defaultValue={defaultValue}
          className="w-full appearance-none bg-transparent font-body text-sm font-medium text-departure focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </span>
    </label>
  )
}

type FilterBlockProps = {
  title?: string
  summary?: string
  className?: string
  popularFilters?: PopularFilter[]
  defaultSport?: string
  defaultBestemming?: string
  defaultNiveau?: string
}

export function FilterBlock({
  title = 'Filter het aanbod',
  summary = '1 reis \u00b7 1 bestemming \u00b7 april tot oktober',
  className = '',
  popularFilters = defaultPopularFilters,
  defaultSport = '',
  defaultBestemming = '',
  defaultNiveau = '',
}: FilterBlockProps) {
  return (
    <div className={`w-full bg-white p-6 shadow-lg ${className}`}>
      <div className="mb-4 flex flex-col items-baseline justify-between gap-2 md:flex-row">
        <span className="font-body text-lg font-medium tracking-[-0.01em] text-departure">
          {title}
        </span>
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
          {summary}
        </span>
      </div>

      <form action="/reizen" method="get" className="flex flex-col md:flex-row md:items-stretch">
        <FilterField
          icon={<AvontuurIcon />}
          label="Sport"
          name="sport"
          defaultValue={defaultSport}
          options={sportOptions}
        />
        <FilterField
          icon={<BestemmingIcon />}
          label="Bestemming"
          name="bestemming"
          defaultValue={defaultBestemming}
          options={bestemmingOptions}
        />
        <label className="flex flex-1 flex-col gap-1 border-b border-line px-4 py-3 md:border-b-0 md:border-r md:last:border-r-0">
          <span className="flex items-center gap-2 font-body text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            <span className="h-4 w-4 text-departure">
              <SeizoenIcon />
            </span>
            Wanneer
          </span>
          <span className="relative">
            <select
              disabled
              defaultValue={wanneerOptions[0]}
              className="w-full appearance-none bg-transparent font-body text-sm font-medium text-departure focus:outline-none"
            >
              {wanneerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </span>
        </label>
        <FilterField
          icon={<AvontuurIcon />}
          label="Niveau"
          name="niveau"
          defaultValue={defaultNiveau}
          options={niveauOptions}
        />
        <div className="flex items-center justify-center p-3 md:pl-4">
          <Button type="submit" variant="primary" className="w-full md:w-auto">
            Zoek reizen
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Populair
        </span>
        {popularFilters.map((filter) => (
          <Link
            key={filter.href}
            href={filter.href}
            className="border border-line px-3 py-2 font-body text-[11px] font-medium uppercase tracking-[0.1em] text-departure hover:border-departure"
          >
            {filter.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
