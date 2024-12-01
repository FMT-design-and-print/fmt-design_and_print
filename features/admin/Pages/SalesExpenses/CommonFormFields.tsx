import { Textarea } from "@mantine/core";

interface CommonFormFieldsProps {
  description: string;
  setDescription: (value: string) => void;
}

export default function CommonFormFields({
  description,
  setDescription,
}: CommonFormFieldsProps) {
  return (
    <Textarea
      label="Description"
      required
      minRows={3}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  );
}
