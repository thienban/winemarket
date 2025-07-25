import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { BasePayload } from "payload";

import { loginSchema, registerSchema } from "../schema";
import { generateAuthCookies } from "../utils";

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

    await generateAuthCookies({
        prefix: ctx.payload.config.cookiePrefix,
        value: data.token
    })

    return data;
}
