import type { CollectionConfig } from 'payload'

import { isStripeSubmitted, isSuperAdmin } from '@/lib/access'

export const Products: CollectionConfig = {
    slug: "products",
    access: {
        create: ({ req: { user } }) => isStripeSubmitted(user),
        delete: ({ req: { user } }) => isSuperAdmin(user),
    },
    admin: {
        useAsTitle: "name",
        description: "You must verify your account before creating products"
    },
    fields: [{
        name: "name",
        type: "text",
        required: true,
    },
    {
        name: "description",
        //TODO: Change to Rich Text
        type: "text",

    },
    {
        name: "price",
        type: "number",
        required: true,
    },
    {
        name: "currency",
        type: "select",
        options: ["USD", "EUR", "GBP", "JPY", "CNY"],
        defaultValue: "USD",
        required: true,
        admin: {
            description: "Currency of the price"
        }
    },
    {
        name: "tax",
        type: "select",
        options: ["5,5%", "10%", "20%", "30%", "40%", "50%"],
        defaultValue: "20%",
        required: true,
        admin: {
            description: "Tax rate"
        }
    },
    {
        name: "category",
        type: "relationship",
        relationTo: "categories",
        hasMany: false
    },
    {
        name: "image",
        type: "upload",
        relationTo: "media"
    },
    {
        name: "refundPolicy",
        type: "select",
        options: ["30-day", "14-day", "7-day", "1-day", "no-refunds"],
        defaultValue: "30-day"
    },
    {
        name: "tags",
        type: "relationship",
        relationTo: "tags",
        hasMany: true
    },
    {
        name: "content",
        //TODO: Change to Rich Text
        type: "textarea",
        admin: {
            description:
                "Protected content only visible to customers after purchase. Add product documentation, download files, or any other relevant information. Support Markdown formatting"
        }
    },
    {
        name: "isArchived",
        label: "Archive",
        defaultValue: false,
        type: "checkbox",
        admin: {
            description: "If checked, this product will be archived"
        }
    }

    ]

}