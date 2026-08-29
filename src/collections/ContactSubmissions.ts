import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contactaanvraag',
    plural: 'Contactaanvragen',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
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
      name: 'subject',
      type: 'select',
      required: true,
      options: [
        { label: 'Algemeen', value: 'algemeen' },
        { label: 'Boeking', value: 'boeking' },
        { label: 'Groepen & bedrijven', value: 'groepen-bedrijven' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
}
