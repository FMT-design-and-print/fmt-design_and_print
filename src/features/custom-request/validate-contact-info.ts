export function validateContactInfo(contactName: string) {
  const errors: string[] = [];

  if (!contactName) {
    errors.push("Enter individual or business name that will receive quote");
  }

  return errors;
}
