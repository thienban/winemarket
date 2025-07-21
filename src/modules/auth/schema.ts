import z from "zod";

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(4),
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

export const loginSchema = z.object({
    email: z.string(),
    password: z.string().min(4),
})
