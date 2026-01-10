"use client"

import { useTRPC } from "@/trpc/client"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

import ReviewSidebar from "./review-sidebar"


interface Props {
    productId: string
}

const ProductView = ({ productId }: Props) => {

    const trpc = useTRPC()

    const { data } = useSuspenseQuery(trpc.library.getOne.queryOptions({
        productId
    }))

    return (
        <div className="min-h-screen bg-white">
            <nav className="p-4 bg-[#F4F4F0] w-full border-b">
                <div className="container mx-auto flex justify-between items-center">
                    <Link prefetch href="/library" className="flex items-center gap-2">
                        <ArrowLeftIcon className="size-4" />
                        <span className="text font-medium">Back to Library</span>
                    </Link>
                </div>
            </nav>
            <header className="p-8 bg-[#F4F4F0] w-full border-b">
                <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
                    <h1 className="text-[40PX] font-medium">
                        {data.name}
                    </h1>
                    <p className="font-medium">
                        Your purchases and review
                    </p>
                </div>
            </header>
            <section className="max-w-(--breakpoint-xl) mx-auto px-4 py-10 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                    <div className="lg:col-span-2">
                        <div className="p-4 bg-white rounded-md border gap-4">
                            <ReviewSidebar productId={productId} />
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        {
                            data.content ? (
                                <p>
                                    <RichText data={data.content} />
                                </p>
                            ) : (
                                <p className="font-medium italic text-muted-foreground">
                                    No special content
                                </p>
                            )
                        }
                    </div>
                </div>
            </section>
            Library View
        </div>
    )
}

export default ProductView
