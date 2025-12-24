
"use client"

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { generateTenantUrl } from "@/lib/utils";
import { EmptyProduct, LoadingProduct } from "@/modules/products/ui/components/empty-product";
import { useCart } from "../../hooks/use-cart";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

interface Props {
    tenantSlug: string;
}


export const CheckoutView = ({ tenantSlug }: Props) => {

    const router = useRouter()

    const [states, setStates] = useCheckoutStates()

    const { productIds, removeProduct, clearCart } = useCart(tenantSlug)

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productIds
    }))

    const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
        onMutate: () => {
            setStates({ success: false, cancel: false })
        },
        onSuccess: (data) => {
            window.location.href = data.url
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                router.push("/sign-in")
            }
            toast.error(error.message)
        }
    }))

    useEffect(() => {
        if (states.success) {
            setStates({ success: false, cancel: false })
            clearCart()
            queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter())
            router.push("/library")
        }
    }, [
        states.success,
        clearCart,
        router,
        setStates,
        queryClient,
        trpc.library.getMany
    ])

    useEffect(() => {
        if (error?.data?.code === "NOT_FOUND") {
            console.log(error)
            clearCart()
            toast.warning("Invalid products found, cart cleared")
        }
    }, [error, clearCart])

    if (isLoading) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <LoadingProduct />
            </div>
        )

    }

    if (data?.totalDocs === 0) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <EmptyProduct />
            </div>
        )
    }


    return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
            <div className=" grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">

                <div className="lg:col-span-4">
                    <div className="border rounded-md overflow-hidden bg-white">
                        {data?.docs.map((product, index) => (
                            <CheckoutItem
                                key={product.id}
                                isLast={index === data?.docs.length - 1}
                                imageUrl={product.image?.url}
                                name={product.name}
                                productUrl={`${generateTenantUrl(product.tenant.slug)}/products/${product.id}`}
                                tenantUrl={generateTenantUrl(product.tenant.slug)}
                                tenantName={product.tenant.name}
                                price={product.price}
                                currency={product.currency}
                                onRemove={() => {
                                    removeProduct(product.id)
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <CheckoutSidebar
                        total={data?.totalPrice || 0}
                        currency={data?.currency}
                        onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
                        isCanceled={states.cancel}
                        isDisabled={purchase.isPending}
                    />
                </div>
            </div>
        </div>
    )
}