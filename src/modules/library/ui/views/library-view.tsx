import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

import { ProductList, ProductListSkeleton } from "../components/product-list"
import { Suspense } from "react"

const LibraryView = () => {
    return (
        <div className="min-h-screen bg-white">
            <nav className="p-4 bg-[#F4F4F0] w-full border-b">
                <div className="container mx-auto flex justify-between items-center">
                    <Link prefetch href="/" className="flex items-center gap-2">
                        <ArrowLeftIcon className="size-4" />
                        <span className="text font-medium">Contiue Shopping</span>
                    </Link>
                </div>
            </nav>
            <header className="p-8 bg-[#F4F4F0] w-full border-b">
                <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
                    <h1 className="text-[40PX] font-medium">
                        Library
                    </h1>
                    <p className="font-medium">
                        Your purchases and review
                    </p>
                </div>
            </header>
            <section className="max-w-(--breakpoint-xl) mx-auto px-4 py-10 lg:px-12">
                <Suspense fallback={<ProductListSkeleton />}>
                    <ProductList />
                </Suspense>
            </section>
            Library View
        </div>
    )
}

export default LibraryView
