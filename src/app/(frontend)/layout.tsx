import React from 'react'
import { Archivo, Michroma } from 'next/font/google'
import './styles.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '500', '600'],
  variable: '--font-archivo',
})

const michroma = Michroma({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-michroma',
})

export const metadata = {
  title: 'AdventureTravels — Actieve sportreizen',
  description:
    'AdventureTravels — premium reismerk voor actieve sportreizen. Overdag sport, \'s avonds verzorgd verblijf.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="nl" className={`${archivo.variable} ${michroma.variable}`}>
      <body>{children}</body>
    </html>
  )
}
