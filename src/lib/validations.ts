import { z } from "zod";

const BaseSchemaObject = {
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
};

export const LoginDataSchema = z.object({
  ...BaseSchemaObject,
});

export const SignUpDataSchema = z
  .object({
    ...BaseSchemaObject,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
