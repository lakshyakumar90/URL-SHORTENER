import { z } from "zod";

export const signupPostRequestSchema = z.object({
    firstname: z.string().min(3, "First name must be at least 3 characters long"),
    lastname: z.string().min(3, "Last name must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})