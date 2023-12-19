import { z } from "zod";

const email = z
  .string({ required_error: "Email is required" })
  .email({ message: "Invalid email address" });
const password = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });

const BaseSchemaObject = {
  email,
  password,
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

export const ResetPasswordDataSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
