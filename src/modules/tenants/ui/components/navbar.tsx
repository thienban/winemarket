"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

import { generateTenantUrl } from "@/lib/utils"

const CheckoutButton = dynamic(
    () => import("@/modules/checkout/ui/components/checkout-button").then(
        (mod) => mod.CheckoutButton
    ),
    {
        ssr: false,
        loading: () => <Skeleton className="h-12 w-10" />,

    }
)

interface Props {
    slug: string
}

export const Navbar = ({ slug }: Props) => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }))

    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center 
            h-full px-4 lg:px-12">
                <Link href={generateTenantUrl(slug)} className="flex items-center gap-2">
                    {
                        data?.image?.url && (
                            <Image
                                src={data?.image?.url}
                                alt={data?.name}
                                width={32}
                                height={32}
                                className="rounded-full border shrink-0 size-[32px]"
                            />
                        )

                    }
                    <p className="text-xl">{data?.name}</p>
                </Link>
                <CheckoutButton tenantSlug={slug} />
            </div>
        </nav>
    )
}

export const NavBarSkeleton = () => {
    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justift-between items-center 
            h-full px-4 lg:px-12">
                <div />
                <Skeleton className="h-12 w-10" />
            </div>
        </nav>
    )
}
