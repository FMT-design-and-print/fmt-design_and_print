import { Modal, Text, Group, Button } from "@mantine/core";

interface ConfirmationDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: ConfirmationDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text mb="xl">{message}</Text>
      <Group justify="flex-end">
        <Button
          variant="subtle"
          color="gray"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} loading={isLoading}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
}
