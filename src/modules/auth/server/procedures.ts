import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { BasePayload } from "payload";

import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schema";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders()

        const session = await ctx.payload.auth({ headers });

        return session;
    }),
    register: baseProcedure
        .input(registerSchema).mutation(async ({ ctx, input }) => {

            const username = await ctx.payload.find({
                collection: "users",
                limit: 1,
                where: {
                    username: {
                        equals: input.username
                    }
                }
            })

            const existingUsername = username.docs[0]

            if (existingUsername) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Username already exists"
                })
            }
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
        .input(loginSchema)
        .mutation(async ({ ctx, input }) => {
            const data = await login(ctx, input);

            return data;
        }),
    logout: baseProcedure.mutation(async () => {
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
