import { createClient } from "@/utils/supabase/client";
import { Button, Group, Modal, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { toast } from "react-toastify";

export const CancelRequest = ({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [reason, setReason] = useState("");
  const [reasonErrorMessage, setReasonErrorMessage] = useState("");

  const handleCancelRequest = async () => {
    if (!reason) {
      setReasonErrorMessage("Please provide a reason");
      return;
    }

    setReasonErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("order-cancellation-requests")
      .insert([
        {
          order_id: orderId,
          reason,
          status: "pending",
          userConfirmation: "unconfirmed",
        },
      ]);

    if (error) {
      toast.error("Unable to send request. Please try again");
      close();
      return;
    }

    const { error: err } = await supabase
      .from("orders")
      .update({ status: "pending-cancellation" })
      .eq("id", orderId);

    if (err) {
      // TODO: log error
    }

    toast.info("Request sent successfully. Please wait for confirmation");
    setReason("");
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Order Cancellation Request">
        <Text size="sm" fw="bold" c="dimmed">
          You are requesting to Cancel this order (#{orderNumber})
        </Text>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
          label="Reason"
          placeholder="Why do you want to cancel your order?"
          size="xs"
        />

        {reasonErrorMessage && (
          <Text size="xs" c="red">
            {reasonErrorMessage}
          </Text>
        )}

        <Text size="xs" c="dimmed">
          NB: when your cancel request is confirmed, it could take up to 48
          hours to process your refund
        </Text>
        <Group justify="flex-end">
          <Button size="xs" mt="md" color="gray" onClick={handleCancelRequest}>
            Send Cancel Request
          </Button>
        </Group>
      </Modal>

      <Button color="red" variant="subtle" size="compact-xs" onClick={open}>
        Cancel
      </Button>
    </>
  );
};
