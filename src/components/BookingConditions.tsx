type ConditionItem = {
  label: string
}

const defaultItems: ConditionItem[] = [
  { label: '15% aanbetaling' },
  { label: 'Kosteloos annuleren tot 45 dagen voor vertrek' },
  { label: 'Gedekt via VZR Garant' },
]

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none text-compass"
    >
      <circle cx="24" cy="24" r="19" />
      <path d="M16 24 L22 30 L33 19" />
    </svg>
  )
}

export function BookingConditions({ items = defaultItems }: { items?: ConditionItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-px border-y border-line bg-line md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 bg-white px-8 py-6">
          <CheckIcon />
          <span className="font-body text-sm font-medium text-departure">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
