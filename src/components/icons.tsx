import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function BergsportIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 34 L18 16 L24 24 L30 14 L42 34 Z" />
      <path d="M16 24 L20 24" />
    </svg>
  )
}

export function WatersportIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 20 L24 8 L30 20 L20 34 Z" />
      <path d="M6 38c4 3 8 3 12 0s8-3 12 0 8 3 12 0" />
    </svg>
  )
}

export function MountainbikeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="32" r="7" />
      <circle cx="36" cy="32" r="7" />
      <path d="M12 32 L20 16 L28 16 M20 16 L28 32 M28 32 L36 32 M28 16 L34 16 L36 32" />
    </svg>
  )
}

export function VerblijfIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 22 L24 10 L40 22" />
      <path d="M12 20 V38 H36 V20" />
      <path d="M20 38 V28 H28 V38" />
    </svg>
  )
}

export function BestemmingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 42c8-9 14-16.5 14-24a14 14 0 1 0-28 0c0 7.5 6 15 14 24Z" />
      <circle cx="24" cy="18" r="5" />
    </svg>
  )
}

export function AvontuurIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="16" />
      <path d="M30 18 L22 22 L18 30 L26 26 Z" />
    </svg>
  )
}

export function SeizoenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="8" />
      <path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M9.5 9.5 L14 14 M34 34 L38.5 38.5 M9.5 38.5 L14 34 M34 14 L38.5 9.5" />
    </svg>
  )
}

export function VluchtIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 26 L42 14 L38 20 L20 26 L26 38 L21 40 L14 28 L6 30 Z" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 9 L12 16 L19 9" />
    </svg>
  )
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path transform="rotate(90 24 24)" d="M12 24 L36 24 M26 14 L36 24 L26 34" />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M12 2 L14.9 8.6 L22 9.3 L16.7 14 L18.2 21 L12 17.4 L5.8 21 L7.3 14 L2 9.3 L9.1 8.6 Z" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 5 L40 11 V24 C40 34, 32 41, 24 44 C16 41, 8 34, 8 24 V11 Z" />
      <path d="M17 24 L22 29 L31 19" />
    </svg>
  )
}

export function DocumentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 6 H28 L34 12 V42 H14 Z" />
      <path d="M28 6 V12 H34" />
      <path d="M19 22 H29 M19 28 H29 M19 34 H25" />
    </svg>
  )
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 42 V10 H30 V42" />
      <path d="M30 22 H38 V42" />
      <path d="M16 16 H18 M22 16 H24 M16 24 H18 M22 24 H24 M16 32 H18 M22 32 H24" />
      <path d="M20 42 V34 H24 V42" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 8c1 0 3.5 0 4.5 5s-3 5.5-2 8 4.5 8 8 9.5 6-3.5 8-2.5 5 3.5 5 4.5-2 6-4 6c-4 0-11-2-17-8s-8-13-8-17c0-2 4-6 5.5-5Z" />
    </svg>
  )
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 12 H42 V36 H6 Z" />
      <path d="M6 12 L24 26 L42 12" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 14 V24 L32 30" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="18" />
      <path d="M16 25 L21 30 L32 18" />
    </svg>
  )
}

export function ErrorIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 15 V27" />
      <path d="M24 33 V33.5" />
    </svg>
  )
}
