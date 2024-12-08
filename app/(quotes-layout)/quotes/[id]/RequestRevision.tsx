import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Textarea, Text, Alert } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "@/functions/send-message";

interface Props {
  quoteId: string;
  quoteNumber: string | number;
  revisionReasons: string[];
  setRevisionRequested: (value: boolean) => void;
}

export const RequestRevision = ({
  quoteId,
  quoteNumber,
  revisionReasons,
  setRevisionRequested,
}: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRevisionRequest = async () => {
    setErrorMsg("");
    if (!description) {
      setErrorMsg("Provide description");
      return;
    }

    const supabase = createClient();
    setIsSending(true);
    try {
      const quotesRes = await supabase
        .from("quotes")
        .update({
          revisionReasons: [...revisionReasons, description],
          numberOfRevisionsRequested: revisionReasons.length + 1,
        })
        .eq("id", quoteId);

      if (quotesRes.error) {
        setRevisionRequested(false);
        console.error(quotesRes.error);
        throw new Error(quotesRes.error?.message);
      }

      await sendMessage({
        subject: `Quote revision request (Quote No. ${quoteNumber})`,
        content: description,
        source: "quote",
        metadata: {
          quoteId,
          quoteNumber,
        },
      });

      setErrorMsg("");
      setIsSent(true);
      setIsSending(false);
      setRevisionRequested(true);
      close();
    } catch (error) {
      setRevisionRequested(false);
      setErrorMsg("Failed to send request. Try again later");
      setIsSending(false);
      console.error(error);
    }
  };

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

        {errorMsg && (
          <Alert variant="light" color="red" py="xs" mt="sm">
            <Text size="xs">{errorMsg}</Text>
          </Alert>
        )}

        <Button
          onClick={handleRevisionRequest}
          size="xs"
          className="btn my-2 mr-auto"
          disabled={isSending}
          opacity={isSending ? 0.4 : 1}
        >
          {isSending ? "Sending..." : "Send Request"}
        </Button>
      </Modal>

      {isSent ? (
        <Text c="green.6" size="sm" fs="italic">
          Revision request sent
        </Text>
      ) : (
        <Button size="xs" variant="outline" color="gray" onClick={open}>
          Request revision
        </Button>
      )}
    </>
  );
};
