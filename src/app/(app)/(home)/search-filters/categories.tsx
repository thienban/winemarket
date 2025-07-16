"use client"

import { ListFilterIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { CategoryDropdown } from "./category-dropdown"
import { CustomCategory } from "../type"
import { CategoriesSidebar } from "./categories-sidebar"

interface Props {
    data: CustomCategory[]
}

export const Categories = ({ data }: Props) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const mesureRef = useRef<HTMLDivElement>(null)
    const viewAllRef = useRef<HTMLDivElement>(null)

    const [visibleCount, serVisibleCount] = useState(data.length)
    const [isAnyHovered, setIsAnyHovered] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const activeCategory = "all"

    const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory)
    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

    useEffect(() => {
        const calculateVisible = () => {
            if (!containerRef.current || !mesureRef.current || !viewAllRef.current) return

            const containerWidth = containerRef.current.offsetWidth
            const viewAllWidth = viewAllRef.current.offsetWidth
            const availableWidth = containerWidth - viewAllWidth

            const items = Array.from(mesureRef.current.children)
            let totalWidth = 0
            let visible = 0

            for (const item of items) {
                const width = item.getBoundingClientRect().width

                if (totalWidth + width > availableWidth) break
                totalWidth += width
                visible++
            }
            serVisibleCount(visible)
        }

        const resizeObserver = new ResizeObserver(calculateVisible)
        resizeObserver.observe(containerRef.current!)

        return () => resizeObserver.disconnect()
    }, [data.length])

    return (
        <div className="relative w-full">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>
            {/* hidden to mesure*/}
            <div
                ref={mesureRef}
                className="absolute opacity-0 pointer-events-none flex"
                style={{ position: "fixed", top: -9999, left: -9999 }}
            >
                {
                    data.map((category) => (
                        <div key={category.id}>
                            <CategoryDropdown
                                category={category}
                                isActive={activeCategory === category.slug}
                                isNavigationHovered={false}
                            />
                        </div>
                    ))
                }
            </div>
            <div
                ref={containerRef}
                className="flex flex-nowrap items-center"
                onMouseEnter={() => setIsAnyHovered(true)}
                onMouseLeave={() => setIsAnyHovered(false)}
            >
                {
                    data.slice(0, visibleCount).map((category) => (
                        <div key={category.id}>
                            <CategoryDropdown
                                category={category}
                                isActive={activeCategory === category.slug}
                                isNavigationHovered={isAnyHovered}
                            />
                        </div>
                    ))
                }
                <div ref={viewAllRef} className="shrink-0">
                    <Button
                        className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-primary hover:border-primary text-black",
                        isActiveCategoryHidden && !isAnyHovered && "bg-white border-")}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        View All
                        <ListFilterIcon className="ml-2" />
                    </Button>
                </div>
            </div>
        </div >
    )
}
