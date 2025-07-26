import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";

interface NavbarItem {
    href: string;
    children: React.ReactNode;
}

interface NavbarItemProps {
    items: NavbarItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: NavbarItemProps) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="p-0 transition-none">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Menu
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {items.map((item) => (
                        <Link key={item.href} href={item.href}
                            onClick={() => onOpenChange(false)}
                            className="w-full text-left p-4 hover:bg-black 
                        hover:text-white flex item-center text-base font-medium">
                            {item.children}
                        </Link>
                    ))}
                    <div className="border-t">
                        <Link href="/sign-in"
                            onClick={() => onOpenChange(false)}
                            className="w-full text-left p-4 hover:bg-black 
                        hover:text-white flex item-center text-base font-medium">
                            Log in
                        </Link>
                        <Link href="/sign-in"
                            onClick={() => onOpenChange(false)}
                            className="w-full text-left p-4 hover:bg-black 
                        hover:text-white flex item-center text-base font-medium">
                            Start selling
                        </Link>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}