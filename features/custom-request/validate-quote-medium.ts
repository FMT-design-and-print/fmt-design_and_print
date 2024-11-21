import { isValidEmail } from "@/functions/validate-email";

export function validateQuoteMedium(
  quoteReceptionMedium?: "email" | "whatsapp" | "sms",
  value?: string
) {
  const errors: string[] = [];

  if (!value) {
    if (quoteReceptionMedium === "email") {
      errors.push("Enter email address");
    }

    if (quoteReceptionMedium === "whatsapp") {
      errors.push("Enter whatsapp number");
    }

    if (quoteReceptionMedium === "sms") {
      errors.push("Enter phone number");
    }
  } else {
    if (quoteReceptionMedium === "email" && !isValidEmail(value)) {
      errors.push("Enter valid email address");
    }

    if (
      (quoteReceptionMedium === "whatsapp" || quoteReceptionMedium === "sms") &&
      value.length !== 10
    ) {
      errors.push("Enter valid number. It should be 10 digits");
    }
  }

  return errors;
}
