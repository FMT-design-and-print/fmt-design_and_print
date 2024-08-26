import { IQuote } from "@/types/quote";
import { Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
// import { v4 as uid } from "uuid";
import { SendQuote } from "./SendQuote";
import { QuoteFormMode, QuoteModalScreen } from "./types";

// const initialQuoteItem = {
//   id: uid(),
//   description: "",
//   quantity: 0,
//   unitAmount: 0,
//   totalAmount: 0,
// };

interface Props {
  mode?: QuoteFormMode;
  title: string;
  orderNumber: string;
  triggerLabel: string;
  screen?: QuoteModalScreen;
  orderId: string;
  data?: IQuote;
}

export const QuoteModal = ({
  title,
  orderNumber,
  triggerLabel,
  screen = "form",
  mode,
  orderId,
  data,
}: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeScreen, setActiveScreen] = useState<QuoteModalScreen>(screen);
  // const [quoteDetails, setQuoteDetails] = useState<IQuote>();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title={
          <Text>
            {title}{" "}
            <Text fw="bold" size="sm" component="span">
              (#{orderNumber})
            </Text>
          </Text>
        }
      >
        {/* {activeScreen === "form" && (
          <>
            <CreateOrEditQuote
              orderId={orderId}
              data={data}
              mode={mode}
              setActiveScreen={setActiveScreen}
            />
          </>
        )} */}

        {activeScreen === "send" && (
          <SendQuote orderId={orderId} setActiveScreen={setActiveScreen} />
        )}
      </Modal>

      <Button
        onClick={open}
        size="compact-xs"
        py="5px"
        variant="transparent"
        color="cyan"
        leftSection={<IconArrowRight size="0.7rem" />}
      >
        {triggerLabel}
      </Button>
    </>
  );
};
