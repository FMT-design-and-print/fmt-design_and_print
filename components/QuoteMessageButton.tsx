import { ActionIcon, Button } from "@mantine/core";
import { IconMessage2 } from "@tabler/icons-react";
import { useState } from "react";
import { QuoteMessageDrawer } from "./QuoteMessageDrawer";

interface QuoteMessageButtonProps {
  variant?: "button" | "icon";
  label?: string;
  title?: string;
  defaultMessage?: string;
  quoteUrl?: string;
  orderDetails?: {
    quoteReceptionMedium?: "email" | "whatsapp" | "sms";
    quoteReceptionValue?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  clientName?: string;
  quoteTitle?: string;
}

export function QuoteMessageButton({
  variant = "button",
  label = "Send Message",
  title = "Send Message",
  defaultMessage = "",
  quoteUrl,
  orderDetails,
  clientName = "",
  quoteTitle = "",
}: QuoteMessageButtonProps) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {variant === "button" ? (
        <Button
          onClick={() => setOpened(true)}
          color="pink"
          leftSection={<IconMessage2 size={16} />}
        >
          {label}
        </Button>
      ) : (
        <ActionIcon
          onClick={() => setOpened(true)}
          color="pink"
          variant="light"
          size="sm"
          title={label}
        >
          <IconMessage2 size={16} />
        </ActionIcon>
      )}

      <QuoteMessageDrawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        defaultRecipient={orderDetails?.quoteReceptionValue || ""}
        initialMessageType={orderDetails?.quoteReceptionMedium || "sms"}
        defaultMessage={defaultMessage}
        defaultName={clientName}
        quoteUrl={quoteUrl}
        defaultSubject={quoteTitle}
      />
    </>
  );
}
