import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/lib/access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true
    }
  ],
}
