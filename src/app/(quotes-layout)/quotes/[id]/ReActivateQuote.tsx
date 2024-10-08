"use client";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Textarea, Alert, Text } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/store";

interface Props {
  quoteId: string;
  quoteNumber: string | number;
  reactivationReasons: string[];
}

export const ReActivateQuote = ({
  quoteId,
  quoteNumber,
  reactivationReasons,
}: Props) => {
  const { user } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReactivationRequest = async () => {
    // TODO: Implement reactivation request
    if (!reason) {
      setErrorMsg("Provide reason");
      return;
    }

    const supabase = createClient();
    setIsSending(true);
    try {
      const [messagesRes, quotesRes] = await Promise.all([
        supabase.from("messages").insert([
          {
            subject: `Quote reactivation request (Quote No. ${quoteNumber})`,
            content: reason,
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
            reactivationReasons: [...reactivationReasons, reason],
            numberOfReactivationRequested: reactivationReasons.length + 1,
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
      <Modal opened={opened} onClose={close} title="Reactivate Quote">
        <Textarea
          label="Reason"
          placeholder="Please provide a description/reason why you want to reactivate this quote"
          value={reason}
          required
          onChange={(e) => setReason(e.target.value)}
        />
        {errorMsg && (
          <Alert variant="light" color="red" py="xs" mt="sm">
            <Text size="xs">{errorMsg}</Text>
          </Alert>
        )}

        <Button
          onClick={handleReactivationRequest}
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
          Request sent
        </Text>
      ) : (
        <Button size="xs" className="btn" onClick={open}>
          Re-activate Quote
        </Button>
      )}
    </>
  );
};
