import type { CollectionConfig } from 'payload'

export const Bestemmingen: CollectionConfig = {
  slug: 'bestemmingen',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'whySpecial',
      type: 'richText',
    },
    {
      name: 'flightTime',
      type: 'text',
    },
    {
      name: 'bestPeriod',
      type: 'text',
    },
    {
      name: 'sports',
      type: 'relationship',
      relationTo: 'sporten',
      hasMany: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
