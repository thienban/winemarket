import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTenantUrl(tenantSlug: string) {
  return `/tenants/${tenantSlug}`
}

export function formatCurrency(value: number | string | undefined, currency: string = "USD") {
  if (!value) {
    return ""
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(Number(value))
}
