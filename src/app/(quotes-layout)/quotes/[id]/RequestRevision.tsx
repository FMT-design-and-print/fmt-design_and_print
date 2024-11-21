import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Textarea, Text, Alert } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/store";

interface Props {
  quoteId: string;
  quoteNumber: string | number;
  revisionReasons: string[];
}

export const RequestRevision = ({
  quoteId,
  quoteNumber,
  revisionReasons,
}: Props) => {
  const { user } = useSession();
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
      const [messagesRes, quotesRes] = await Promise.all([
        supabase.from("messages").insert([
          {
            subject: `Quote revision request (Quote No. ${quoteNumber})`,
            content: description,
            source: "quote",
            metadata: {
              quoteNumber,
              user_id: user?.id,
              email: user?.email,
              phone: user?.phone,
            },
          },
        ]),

        supabase
          .from("quotes")
          .update({
            revisionReasons: [...revisionReasons, description],
            numberOfRevisionsRequested: revisionReasons.length + 1,
          })
          .eq("id", quoteId),
      ]);

      if (messagesRes.error || quotesRes.error) {
        throw new Error(messagesRes.error?.message || quotesRes.error?.message);
      }

      setErrorMsg("");
      setIsSent(true);
      setIsSending(false);
      close();
    } catch (error) {
      setErrorMsg("Failed to send request. Try again later");
      setIsSending(false);
      // send error to sentry
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
