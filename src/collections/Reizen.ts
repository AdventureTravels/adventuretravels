import type { CollectionConfig } from 'payload'

export const Reizen: CollectionConfig = {
  slug: 'reizen',
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
      name: 'sport',
      type: 'relationship',
      relationTo: 'sporten',
      required: true,
    },
    {
      name: 'bestemming',
      type: 'relationship',
      relationTo: 'bestemmingen',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'priceUnit',
      type: 'text',
      defaultValue: 'p.p.',
    },
    {
      name: 'duration',
      type: 'text',
    },
    {
      name: 'level',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Gevorderd', value: 'gevorderd' },
        { label: 'Alle niveaus', value: 'alle_niveaus' },
      ],
      defaultValue: 'alle_niveaus',
    },
    {
      name: 'included',
      type: 'array',
      labels: { singular: 'Item', plural: 'Inbegrepen' },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'excluded',
      type: 'array',
      labels: { singular: 'Item', plural: 'Niet inbegrepen' },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'program',
      type: 'array',
      labels: { singular: 'Dag', plural: 'Programma' },
      fields: [
        {
          name: 'dag',
          type: 'number',
          required: true,
        },
        {
          name: 'titel',
          type: 'text',
          required: true,
        },
        {
          name: 'beschrijving',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'accommodationDescription',
      type: 'richText',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      index: true,
    },
  ],
}
