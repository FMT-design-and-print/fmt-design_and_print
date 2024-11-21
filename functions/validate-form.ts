import { ZodError, ZodSchema } from "zod";

export function validateForm(
  data: Record<string, string | number | boolean>,
  schema: ZodSchema
) {
  try {
    schema.parse(data);
    return { success: true, errors: null };
  } catch (e) {
    if (e instanceof ZodError) {
      const errors = e.errors.reduce(
        (acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        },
        {} as Record<string, string>
      );
      return { success: false, errors };
    }

    // Unexpected error, rethrow it
    throw e;
  }
}
