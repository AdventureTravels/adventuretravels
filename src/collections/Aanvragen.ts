import type { CollectionConfig } from 'payload'

export const Aanvragen: CollectionConfig = {
  slug: 'aanvragen',
  labels: {
    singular: 'Aanvraag',
    plural: 'Aanvragen',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'email', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Groepsreis', value: 'groepsreis' },
        { label: 'Op maat', value: 'op-maat' },
        { label: 'Bedrijven', value: 'bedrijven' },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'groupSize',
      type: 'text',
    },
    {
      name: 'sport',
      type: 'relationship',
      relationTo: 'sporten',
    },
    {
      name: 'period',
      type: 'text',
    },
    {
      name: 'budget',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
