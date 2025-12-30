import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/lib/access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: "name",
      required: true,
      type: "text",
      label: "Store Name",
      admin: {
        description: "This is the name of the store (e.g Antonio's Store)"
      }
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      access: {
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
      admin: {
        description: "This is the subdomain of the store (e.g [slug].antonio-store)"
      }

    },
    {
      name: "image",
      type: "upload",
      relationTo: "media"
    },
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      admin: {
        //readOnly: true
      },
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      admin: {
        //readOnly: true,
        description: "You cannot create products until you submit your Stripe details"
      },
    },

  ]
}
