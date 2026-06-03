import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters"); // bcrypt hard limit

export const signupRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username may only contain lowercase letters, digits, and underscores",
    ),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: passwordSchema,
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;
