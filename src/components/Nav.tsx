'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from './Button'

const navLinks = [
  { label: 'Reizen', href: '/reizen' },
  { label: 'Sporten', href: '/sporten' },
  { label: 'Bestemmingen', href: '/bestemmingen' },
  { label: 'Verblijf', href: '/verblijf' },
  { label: 'Groepen & bedrijven', href: '/groepen-bedrijven' },
  { label: 'Journal', href: '/journal' },
]

type NavProps = {
  variant?: 'solid' | 'transparent'
}

export function Nav({ variant = 'solid' }: NavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isTransparent = variant === 'transparent'

  return (
    <header className={`${isTransparent ? 'absolute inset-x-0 top-0 z-50' : 'relative'} w-full`}>
      <div className="flex items-center justify-between gap-6 bg-departure px-6 py-2 font-body text-[10px] font-medium uppercase tracking-[0.16em] text-dune md:px-10">
        <span className="hidden md:inline">Kleine groepen &middot; eigen gidsen &middot; verblijf zelf getest</span>
        <div className="flex gap-7">
          <span>NL / EN</span>
          <span>Spreek een gids &middot; +31 20 244 18 60</span>
        </div>
      </div>

      <div
        className={`flex items-center justify-between gap-6 px-6 py-5 md:px-10 ${
          isTransparent ? 'bg-transparent text-canvas' : 'border-b border-line bg-white text-departure'
        }`}
      >
        <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
          <svg
            width="26"
            height="26"
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
          <span className="font-display text-sm tracking-[0.09em]">ADVENTURETRAVELS</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-[11px] font-medium uppercase tracking-[0.14em] pb-[3px] ${
                  isActive ? 'border-b-2 border-compass' : ''
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" variant="primary">
            Plan je reis
          </Button>
        </div>

        <button
          type="button"
          aria-label="Menu openen"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span className={`block h-px w-6 ${isTransparent ? 'bg-canvas' : 'bg-departure'}`} />
          <span className={`block h-px w-6 ${isTransparent ? 'bg-canvas' : 'bg-departure'}`} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line bg-white px-6 py-4 text-departure lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 font-body text-sm uppercase tracking-[0.1em] border-b border-line last:border-none"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="py-3 font-body text-sm uppercase tracking-[0.1em]"
          >
            Plan je reis
          </Link>
        </nav>
      )}
    </header>
  )
}
