import type { CollectionConfig } from 'payload'

export const Sporten: CollectionConfig = {
  slug: 'sporten',
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
      name: 'forWho',
      type: 'richText',
    },
    {
      name: 'whatToExpect',
      type: 'richText',
    },
  ],
}
