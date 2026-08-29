import type { CollectionConfig } from 'payload'

export const Journal: CollectionConfig = {
  slug: 'journal',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: ['sporten', 'bestemmingen'],
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedDate',
      type: 'date',
    },
    {
      name: 'readingTime',
      type: 'text',
      admin: {
        description: 'Bijv. "5 min"',
      },
    },
  ],
}
