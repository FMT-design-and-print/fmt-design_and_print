import { isValidEmail } from "@/functions/validate-email";

export function validateQuoteMedium(
  quoteReceptionMedium?: "email" | "whatsapp" | "sms",
  value?: string
) {
  const errors: string[] = [];

  if (!quoteReceptionMedium) {
    errors.push("Select how you want to receive your quote");
  }

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

    if (quoteReceptionMedium === "whatsapp" || quoteReceptionMedium === "sms") {
      // Check if the phone number is in one of the allowed formats:
      // 1. +233267866768 (with country code and plus)
      // 2. 233267866768 (with country code, no plus)
      // 3. 0267866768 (local format starting with 0)
      const isValidFormat = /^(\+\d{10,12}|\d{10,12})$/.test(value);

      if (!isValidFormat) {
        errors.push(
          "Enter valid number format (e.g., +233xxxxxxxxx, 233xxxxxxxxx, or 024xxxxxxx)"
        );
      }
    }
  }

  return errors;
}
