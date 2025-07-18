import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { BasePayload } from "payload";
import z from "zod";

import { AUTH_COOKIE } from "../constants";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders()

        const session = await ctx.payload.auth({ headers });

        return session;
    }),
    register: baseProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string().min(8),
                username: z.string()
                    .min(3, "User must be at least 3 caracter")
                    .max(63, "User must be lest than 63 caracter")
                    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "User must be lowercase, numbers and hypens. It must start and end with letter or number")
                    .refine(
                        (val) => !val.includes("--"),
                        "User must not have double hypens"
                    )
                    .transform((val) => val.toLowerCase())
            })
        ).mutation(async ({ ctx, input }) => {
            await ctx.payload.create({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password,
                    username: input.username
                }
            })

            await login(ctx, input);
        }),
    login: baseProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string().min(8),
            })
        ).mutation(async ({ ctx, input }) => {
            const data = await login(ctx, input);

            return data;
        }),
    logout: baseProcedure.mutation(async ({ ctx }) => {
        const cookies = await getCookies();

        cookies.delete(AUTH_COOKIE);
    })
});

async function login(ctx: { payload: BasePayload }, input: { email: string; password: string; }) {
    const data = await ctx.payload.login({
        collection: "users",
        data: {
            email: input.email,
            password: input.password,
        }
    });

    if (!data.token) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials"
        });
    }

    const cookies = await getCookies();

    cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        path: "/",
        httpOnly: true,
    });
    return data;
}
