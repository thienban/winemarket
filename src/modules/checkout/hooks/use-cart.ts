import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
    const {
        addProduct,
        removeProduct,
        clearCart,
        clearAllCart,
        getCartByTenant,
    } = useCartStore()

    const productIds = getCartByTenant(tenantSlug)

    const toogleProduct = (productId: string) => {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId)
        } else {
            addProduct(tenantSlug, productId)
        }
    }

    const isProductInCart = (productId: string) => {
        return productIds.includes(productId)
    }

    const clearTenantCart = () => {
        clearCart(tenantSlug)
    }

    return {
        productIds,
        addProduct: (productId: string) => addProduct(tenantSlug, productId),
        removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
        clearCart: clearTenantCart,
        clearAllCart,
        toogleProduct,
        isProductInCart,
        totalItems: productIds.length,
    }

}

