'use client'

import { useState } from 'react'
import { ChevronDownIcon } from './icons'

export type AccordionItem = {
  question: string
  answer: string
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex flex-col border-t border-line">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-body text-lg font-medium text-departure">{item.question}</span>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-departure transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <p className="max-w-2xl pb-6 font-body text-sm font-light leading-relaxed text-muted">
                {item.answer}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
