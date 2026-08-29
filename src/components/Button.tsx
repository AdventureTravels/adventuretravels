import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-compass text-canvas hover:bg-departure hover:text-canvas',
  dark: 'bg-departure text-canvas hover:bg-compass hover:text-canvas',
  outline:
    'border border-departure text-departure bg-transparent hover:bg-departure hover:text-canvas',
  'outline-light':
    'border border-canvas text-canvas bg-transparent hover:bg-canvas hover:text-departure',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 px-6 py-3 font-body text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200'

type CommonProps = {
  variant?: Variant
  className?: string
}

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonProps = ButtonAsLink | ButtonAsButton

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  if ('href' in props && props.href) {
    const { href, ...rest } = props
    return (
      <Link href={href} className={classes} {...rest}>
        {props.children}
      </Link>
    )
  }

  const { children, ...rest } = props as ButtonAsButton
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
