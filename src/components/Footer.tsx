import Link from 'next/link'

const sportenLinks = [{ label: 'Wakeboarden', href: '/sporten/wakeboarden' }]
const bestemmingenLinks = [{ label: 'Turkije', href: '/bestemmingen/turkije' }]

export function Footer() {
  return (
    <footer className="bg-white text-departure">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="flex flex-col gap-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth={5.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 35 L24 11 L39 35" />
            <path d="M15.5 25 H32.5" />
            <path d="M24 25 V39" />
          </svg>
          <span className="font-display text-[13px] tracking-[0.09em]">ADVENTURETRAVELS</span>
          <p className="max-w-xs font-body text-sm font-light leading-relaxed text-muted">
            Actieve sportreizen met een verzorgde avond. Vanuit Amsterdam, door heel Europa.
          </p>
          <div className="flex gap-3 pt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
            <span className="border border-line px-3 py-2">VZR GARANT</span>
            <span className="border border-line px-3 py-2">KVK</span>
          </div>
        </div>

        <FooterColumn title="Sporten" links={sportenLinks} extra="Meer sporten volgen" />
        <FooterColumn title="Bestemmingen" links={bestemmingenLinks} extra="Meer bestemmingen volgen" />

        <div className="flex flex-col gap-3">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-departure">
            Contact
          </span>
          <ul className="flex flex-col gap-2 font-body text-sm font-light text-muted">
            <li>hallo@adventuretravels.nl</li>
            <li>+31 20 244 18 60</li>
            <li>
              <Link href="/journal" className="hover:text-departure">
                Journal
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-departure">
                Veelgestelde vragen
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-departure">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-2 px-6 py-6 text-[10px] font-medium uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:px-10">
          <span>&copy; {new Date().getFullYear()} AdventureTravels</span>
          <div className="flex gap-7">
            <span>Voorwaarden</span>
            <span>Privacy</span>
            <span>Annuleringsvoorwaarden</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
  extra,
}: {
  title: string
  links: { label: string; href: string }[]
  extra?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-departure">
        {title}
      </span>
      <ul className="flex flex-col gap-2 font-body text-sm font-light text-muted">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-departure">
              {link.label}
            </Link>
          </li>
        ))}
        {extra && <li>{extra}</li>}
      </ul>
    </div>
  )
}
