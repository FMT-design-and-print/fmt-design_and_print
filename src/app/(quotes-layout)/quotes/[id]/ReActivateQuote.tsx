import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Textarea } from "@mantine/core";

export const ReActivateQuote = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [reason, setReason] = useState("");

  return (
    <>
      <Modal opened={opened} onClose={close} title="Reactivate Quote">
        <Textarea
          label="Reason"
          placeholder="Please provide a description/reason why you want to reactivate this quote"
          value={reason}
          required
          onChange={(e) => setReason(e.target.value)}
        />

        <Button size="xs" className="btn my-2 mr-auto">
          Send Request
        </Button>
      </Modal>

      <Button size="xs" className="btn" onClick={open}>
        Re-activate Quote
      </Button>
    </>
  );
};
