import { cn } from "@/lib/utils"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useCart } from "@/modules/checkout/hooks/use-cart"

interface Props {
    tenantSlug: string,
    productId: string,
    isPurchased?: boolean,
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {

    const cart = useCart(tenantSlug)

    if (isPurchased) {
        return (
            <Button
                variant="elevated"
                asChild
                className="flex-1 font-medium bg-white"
            >
                <Link prefetch href={`/library/${productId}`}>
                    View in Library
                </Link>
            </Button>
        )
    }
    
    return (
        <Button
            variant="elevated"
            className={cn("flex-1 bg-primary", cart.isProductInCart(productId) && "bg-white")}

            onClick={() => cart.toogleProduct(productId)}
        >
            {cart.isProductInCart(productId)
                ? "Remove from cart"
                : "Add to cart"

            }
        </Button>
    )

}
