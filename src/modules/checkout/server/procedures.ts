import type Stripe from "stripe";
import z from "zod";

import { stripe } from "@/lib/stripe";
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { PLATFORM_FEE_PERCENTAGE } from "@/constants";
import { CheckoutMetaData, ProductMetaData } from "../types";

export const checkoutRouter = createTRPCRouter({

    verify: protectedProcedure
        .mutation(async ({ ctx }) => {
            const user = await ctx.payload.findByID({
                collection: "users",
                id: ctx.session.user.id,
                depth: 0
            })

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                })
            }

            const tenantId = user.tenants?.[0]?.tenant as string
            const tenant = await ctx.payload.findByID({
                collection: "tenants",
                id: tenantId,
                depth: 0
            })

            if (!tenant) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant not found"
                })
            }

            if (!tenant.stripeDetailsSubmitted) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant not allowed to sell products"
                })
            }

            const accountLink = await stripe.accountLinks.create({
                account: tenant.stripeAccountId,
                refresh_url: `${process.env.NEXT_PUBLIC_APP_UR!}/admin`,
                return_url: `${process.env.NEXT_PUBLIC_APP_UR!}/admin`,
                type: "account_onboarding",
            })

            if (!accountLink) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create verification link"
                })
            }

            return {
                url: accountLink.url
            }
        }),
    purchase: protectedProcedure
        .input(
            z.object({
                productIds: z.array(z.string()).min(1),
                tenantSlug: z.string().min(1)
            })
        ).mutation(async ({ ctx, input }) => {
            const products = await ctx.payload.find({
                collection: "products",
                depth: 2,
                where: {
                    and: [
                        {
                            id: {
                                in: input.productIds
                            }
                        },
                        {
                            "tenant.slug": {
                                equals: input.tenantSlug
                            }
                        }
                    ]
                }
            })

            if (products.totalDocs !== input.productIds.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" })
            }

            const tenantsData = await ctx.payload.find({
                collection: "tenants",
                limit: 1,
                pagination: false,
                depth: 2,
                where: {
                    slug: {
                        equals: input.tenantSlug
                    }
                }
            })

            const tenant = tenantsData.docs[0]

            if (!tenant) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant not found"
                })
            }

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
                products.docs.map((product) => ({
                    quantity: 1,
                    price_data: {
                        currency: product.currency,
                        product_data: {
                            name: product.name,
                            metadata: {
                                stripeAccountId: tenant.stripeAccountId,
                                id: product.id,
                                name: product.name,
                                price: product.price
                            } as ProductMetaData
                        },
                        unit_amount: Number(product.price) * 100 //Stripe handles price in cents
                    },
                }))

            const totalAmount = products.docs.reduce((acc, product) => acc + product.price * 100, 0)

            const platformFeeAmount = Math.round(totalAmount * PLATFORM_FEE_PERCENTAGE)

            const checkout = await stripe.checkout.sessions.create({
                customer_email: ctx.session.user.email,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=false`,
                line_items: lineItems,
                mode: "payment",
                invoice_creation: {
                    enabled: true,
                },
                payment_method_types: ["card"],
                metadata: {
                    userId: ctx.session.user.id,
                    //stripeAccountId: tenant.stripeAccountId || ''
                } as CheckoutMetaData,
                payment_intent_data: {
                    application_fee_amount: platformFeeAmount,
                }
            }, {
                stripeAccount: tenant.stripeAccountId
            })

            console.log(checkout.url)

            if (!checkout.url) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create a checkout session"
                })
            }

            return {
                url: checkout.url
            }

        }),
    getProducts: baseProcedure
        .input(
            z.object({
                ids: z.array(z.string())
            })
        ).query(async ({ ctx, input }) => {

            const data = await ctx.payload.find({
                collection: "products",
                depth: 2, //populate category, image, tenant & tenant.image
                where: {
                    id: {
                        in: input.ids
                    }

                }
            })

            if (data.totalDocs !== input.ids.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" })
            }

            const totalPrice = data.docs.reduce((acc, product) => {
                const price = Number(product.price)
                return acc + (isNaN(price) ? 0 : price)
            }, 0)

            return {
                ...data,
                totalPrice: totalPrice,
                currency: data.docs[0]?.currency || "USD",
                docs: data.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & { image: Media | null }
                }))

            }
        }),
});