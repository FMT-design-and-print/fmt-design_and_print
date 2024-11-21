"use client";
import { TextEditor } from "@/components/TextEditor";
import { useCustomEditor } from "@/hooks/useCustomEditor";
import React, { useState } from "react";
import { QuoteReceptionOptions } from "./QuoteReceptionOptions";
import {
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { QuoteReceptionMedium } from "@/types";
import useSanitize from "@/hooks/useSanitize";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

const defaultEditorContent = "<p></p>";

export const Form = () => {
  const sanitize = useSanitize();
  const editor = useCustomEditor(defaultEditorContent);
  const [quoteReceptionMedium, setQuoteReceptionMedium] =
    useState<QuoteReceptionMedium>("email");
  const [quoteReceptionValue, setQuoteReceptionValue] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSendRequest = async () => {
    const editorContent = sanitize(editor?.getHTML() as string);
    const fieldErrors: string[] = [];

    if (!name.trim()) {
      fieldErrors.push("Individual/Business name is required");
    }

    if (!phone.trim()) {
      fieldErrors.push("Phone number is required");
    }

    if (
      !editorContent.trim() ||
      editorContent.trim() === defaultEditorContent
    ) {
      fieldErrors.push("Provide a description");
    }

    if (!quoteReceptionValue.trim()) {
      fieldErrors.push(
        `Enter ${quoteReceptionMedium === "email" ? "email address" : quoteReceptionMedium + " number"} to receive quote/invoice`
      );
    }

    if (fieldErrors.length === 0) {
      setIsSubmitting(true);
      const supabase = createClient();
      const { error } = await supabase
        .from("invoice-requests")
        .insert([
          {
            name,
            phone,
            email,
            description: editorContent,
            receptionMedium: quoteReceptionMedium,
            receptionValue: quoteReceptionValue,
          },
        ])
        .select();

      if (error) {
        toast.error("Could not send request. Try again later");
        return;
      }
      toast.success("Request sent successfully");
      setIsSubmitting(false);
      setName("");
      setPhone("");
      setEmail("");
      setQuoteReceptionValue("");
      setErrors([]);
    } else {
      setErrors(fieldErrors);
    }
  };

  return (
    <Stack gap={16} py="xl" pos="relative">
      <LoadingOverlay visible={isSubmitting} />
      <Flex gap={8} direction={{ base: "column", sm: "row" }}>
        <TextInput
          label="Individual/Business name"
          placeholder="name"
          className="flex-1"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <TextInput
          label="Phone"
          placeholder="phone number"
          className="flex-1"
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value)}
        />
        <TextInput
          label="Email(optional)"
          placeholder="email address"
          className="flex-1"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </Flex>
      <Box>
        <Text size="sm">Description</Text>
        <Text size="xs" mb="sm" c="gray">
          Describe all the items you need, including quantity and
          variations(sizes, colors etc.) where necessary and we will prepare
          invoice/quote for you.
        </Text>
        <TextEditor editor={editor} />
      </Box>

      <QuoteReceptionOptions
        label="How do you want to receive your quote/invoice?"
        medium={quoteReceptionMedium}
        value={quoteReceptionValue}
        setMedium={setQuoteReceptionMedium}
        setValue={setQuoteReceptionValue}
      />

      {errors.length > 0 && <ErrorsRenderer errors={errors} showTitle />}

      <Group justify="flex-end">
        <Button className="btn" onClick={handleSendRequest}>
          Send request
        </Button>
      </Group>
    </Stack>
  );
};
