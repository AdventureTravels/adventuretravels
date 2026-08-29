type TrustStat = {
  value: string
  label: string
}

const defaultStats: TrustStat[] = [
  { value: '4,8', label: 'gemiddeld uit 412 beoordelingen' },
  { value: '2.900', label: 'reizigers sinds 2019' },
  { value: 'MAX 12', label: 'deelnemers per groep' },
  { value: 'SGR', label: '& Calamiteitenfonds aangesloten' },
]

export function TrustStrip({ stats = defaultStats }: { stats?: TrustStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-2 bg-paper px-6 py-8">
          <span className="font-display text-2xl leading-none text-departure">{stat.value}</span>
          <span className="font-body text-xs font-light leading-snug text-muted">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
