import z from "zod";
import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const tagssRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.number().default(1), //infiniteQueryOptions
                limit: z.number().default(DEFAULT_LIMIT),

            })
        ).query(async ({ ctx, input }) => {

            const data = await ctx.payload.find({
                collection: "tags",
                depth: 1,
                page: input.cursor,
                limit: input.limit
            })

            return data
        }),
});