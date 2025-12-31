import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields"
import type { CollectionConfig } from 'payload'

import { isSameUser, isSuperAdmin } from "@/lib/access"

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
  }
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user }, id }) => isSameUser(user, id),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: true,
  fields: [
    {
      name: "username",
      required: true,
      type: "text",
      unique: true,
    },
    {
      admin: {
        position: "sidebar"
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
      access: {
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar"
      }
    }
  ],
}
