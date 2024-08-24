import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Textarea } from "@mantine/core";

interface Props {
  quoteId: string;
}

export const RequestRevision = ({ quoteId }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [description, setDescription] = useState("");

  return (
    <>
      <Modal opened={opened} onClose={close} title="Request revision to quote">
        <Textarea
          rows={8}
          label="Description"
          placeholder="Please provide detailed description of what you want to change/review about this quote"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button size="xs" className="btn my-2 mr-auto">
          Send Request
        </Button>
      </Modal>

      <Button size="xs" variant="outline" color="gray" onClick={open}>
        Request revision
      </Button>
    </>
  );
};
