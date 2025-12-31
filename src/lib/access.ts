import { ClientUser } from "payload"

import { Tenant, User } from "@/payload-types"

export const isSuperAdmin = (user: User | ClientUser | null) => {
    return Boolean(user?.roles?.includes("super-admin"))
}

export const isSameUser = (
    user: User | ClientUser | null,
    id: string | number | undefined
) => {
    if (isSuperAdmin(user)) return true

    return Boolean(user?.id === id)
}

export const isStripeSubmitted = (
    user: User | ClientUser | null
) => {
    if (isSuperAdmin(user)) return true

    const tenant = user?.tenants?.[0].tenant as Tenant
    return Boolean(tenant?.stripeDetailsSubmitted)
}
