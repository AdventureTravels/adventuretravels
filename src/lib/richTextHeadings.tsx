import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

export type Heading = { id: string; text: string }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getNodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; children?: unknown[] }
  if (typeof n.text === 'string') return n.text
  if (Array.isArray(n.children)) return n.children.map(getNodeText).join('')
  return ''
}

export function extractH2Headings(data: unknown): Heading[] {
  if (!data || typeof data !== 'object' || !('root' in data)) return []
  const root = (data as { root: { children?: unknown[] } }).root
  const headings: Heading[] = []
  for (const node of root.children ?? []) {
    const n = node as { type?: string; tag?: string }
    if (n.type === 'heading' && n.tag === 'h2') {
      const text = getNodeText(node)
      if (text) headings.push({ id: slugify(text), text })
    }
  }
  return headings
}

export const journalConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const NodeTag = node.tag
    if (NodeTag === 'h2') {
      const text = getNodeText(node)
      return <h2 id={slugify(text)}>{children}</h2>
    }
    return <NodeTag>{children}</NodeTag>
  },
})
