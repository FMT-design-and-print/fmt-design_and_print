import { createClient } from "@/utils/supabase/client";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";

export const CancelRequest = ({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleCancelRequest = async () => {
    const supabase = createClient();

    const { error: err } = await supabase
      .from("custom-orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (err) {
      // TODO: log error
    }

    toast.info("Order Cancelled");
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Cancel Custom Order">
        <Text size="sm" c="dimmed">
          Are you sure you want to cancel custom order with number (#
          {orderNumber})
        </Text>

        <Group justify="flex-end">
          <Button size="xs" mt="md" color="gray" onClick={handleCancelRequest}>
            Yes! Continue
          </Button>
        </Group>
      </Modal>

      <Button color="red" variant="subtle" size="compact-xs" onClick={open}>
        Cancel
      </Button>
    </>
  );
};
