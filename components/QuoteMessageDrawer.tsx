import { QuoteReceptionMedium } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Drawer,
  Group,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconBrandWhatsapp, IconMail, IconMessage } from "@tabler/icons-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface QuoteMessageDrawerProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  defaultRecipient?: string;
  initialMessageType?: QuoteReceptionMedium;
  defaultMessage?: string;
  defaultName?: string;
  quoteUrl?: string;
  defaultSubject?: string;
}

// Zod schema for form validation
const createMessageSchema = (messageType: QuoteReceptionMedium) => {
  const baseSchema = {
    message: z.string().min(1, "Message is required"),
    name: z.string().min(1, "Name is required"),
  };

  if (messageType === "email") {
    return z.object({
      ...baseSchema,
      recipient: z.string().email("Invalid email address"),
      subject: z.string().min(1, "Subject is required"),
    });
  }

  return z.object({
    ...baseSchema,
    recipient: z
      .string()
      .regex(/^\+?[\d\s-]+$/, "Invalid phone number")
      .min(1, "Phone number is required"),
    subject: z.string().optional(),
  });
};

export function QuoteMessageDrawer({
  opened,
  onClose,
  title = "Send Message",
  defaultRecipient = "",
  initialMessageType = "sms",
  defaultMessage = "",
  defaultName = "",
  quoteUrl = "",
  defaultSubject = "",
}: QuoteMessageDrawerProps) {
  const [messageType, setMessageType] =
    useState<QuoteReceptionMedium>(initialMessageType);
  const [loading, setLoading] = useState(false);

  const schema = createMessageSchema(messageType);
  type FormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      recipient: defaultRecipient,
      subject: defaultSubject,
      message: defaultMessage,
      name: defaultName || "Customer",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const endpoints = {
        sms: "/api/quotes/send-sms",
        whatsapp: "/api/quotes/send-whatsapp-msg",
        email: "/api/quotes/send-email",
      };

      console.log(endpoints[messageType]);

      const response = await fetch(endpoints[messageType], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: values.recipient,
          message: values.message,
          recipientName: values.name,
          link: quoteUrl,
          ...(messageType === "email" && { subject: values.subject }),
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!data.error) {
        toast.success("Message sent successfully");
        reset();
        onClose();
      } else {
        throw new Error(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={title}
      position="right"
      padding="lg"
    >
      <Stack gap="md">
        <SegmentedControl
          fullWidth
          value={messageType}
          onChange={(value: string) => {
            setMessageType(value as QuoteReceptionMedium);
            reset(); // Reset form when changing message type
          }}
          data={[
            {
              label: (
                <Group gap="xs">
                  <IconMessage size={16} />
                  <Text size="sm">SMS</Text>
                </Group>
              ),
              value: "sms",
            },
            {
              label: (
                <Group gap="xs">
                  <IconBrandWhatsapp size={16} />
                  <Text size="sm">WhatsApp</Text>
                </Group>
              ),
              value: "whatsapp",
            },
            {
              label: (
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm">Email</Text>
                </Group>
              ),
              value: "email",
            },
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  required
                  label="Recipient Name"
                  placeholder="Enter recipient name"
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="recipient"
              control={control}
              render={({ field }) => (
                <TextInput
                  required
                  label={
                    messageType === "email"
                      ? "Email address"
                      : messageType === "whatsapp"
                        ? "WhatsApp number"
                        : "Phone number"
                  }
                  placeholder={
                    messageType === "email"
                      ? "recipient@example.com"
                      : "+1234567890"
                  }
                  error={errors.recipient?.message}
                  {...field}
                />
              )}
            />

            {messageType === "email" && (
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <TextInput
                    required
                    label="Subject"
                    placeholder="Enter email subject"
                    error={errors.subject?.message}
                    {...field}
                  />
                )}
              />
            )}

            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Textarea
                  required
                  label="Message"
                  placeholder="Type your message here"
                  minRows={8}
                  rows={8}
                  error={errors.message?.message}
                  {...field}
                />
              )}
            />

            <Button type="submit" loading={loading} color="pink" fullWidth>
              Send{" "}
              {messageType === "email" ? "Email" : messageType.toUpperCase()}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Drawer>
  );
}
