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
  }

  return errors;
}
