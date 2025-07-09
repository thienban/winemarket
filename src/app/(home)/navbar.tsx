"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
})

interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
}

const NavbarItem = ({
    href,
    children,
    isActive,
}: NavbarItemProps) => {
    return (
        <Button
            variant="outline"
            className={cn(
                "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
                isActive && "bg-black text-white hover:bg-black hover:text-white",
            )}>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    )
}

const navbarItems = [
    {
        href: "/",
        children: "Home",
    },
    {
        href: "/about",
        children: "About",
    },
    {
        href: "/features",
        children: "Features",
    },
    {
        href: "/pricing",
        children: "Pricing",
    },
    {
        href: "/contact",
        children: "Contact",
    },
]

export const Navbar = () => {

    const pathName = usePathname()

    return (
        <nav className="h-20 flex border-b justify-between font-medium bg-white">
            <Link href="/" className="pl-6 flex items-center">
                <span className={cn("text-5xl font-semibold", poppins.className)}>
                    winemarket
                </span>
            </Link>

            <div className="items-center gap-4 hidden lg:flex">
                {navbarItems.map((item) => (
                    <NavbarItem
                        key={item.href}
                        href={item.href}
                        isActive={pathName === item.href}
                    >
                        {item.children}
                    </NavbarItem>
                ))}
            </div>

            <div className="hidden lg:flex">
                <Button
                    asChild
                    variant="secondary"
                    className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-primary transition-colors text-lg">
                    <Link href="/sign-in">
                        login
                    </Link>
                </Button>
                <Button
                    asChild
                    className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:text-black hover:bg-primary transition-colors text-lg">
                    <Link href="/sign-up">
                        start selling
                    </Link>
                </Button>
            </div>
        </nav>
    )
}