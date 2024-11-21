import { IQuote } from "@/types/quote";
import React, { Dispatch, SetStateAction } from "react";
import { QuoteModalScreen } from "./types";
import { Button, Group, Text } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";

interface Props {
  mode?: "create" | "edit";
  orderId: string;
  data?: IQuote;
  setActiveScreen?: Dispatch<SetStateAction<QuoteModalScreen>>;
}

export const SendQuote = ({ setActiveScreen }: Props) => {
  return (
    <div>
      Send Quote
      {/* <Card withBorder my="lg" bg="gray.1">
          <Text size="sm" fw="bold" mb="md">
            Estimated Fulfillment Date
          </Text>
          <Flex>
            <SelectDate value={fulfillmentDate} setValue={setFulfillmentDate} />
          </Flex>
        </Card> */}
      <Group justify="space-between" align="center" w="100%" mt={16}>
        <Button onClick={() => setActiveScreen?.("form")} size="xs" radius="lg">
          <IconArrowBack size="1rem" />
          <Text component="span" size="xs" ml="xs">
            Back to form
          </Text>
        </Button>
        <Button className="btn" size="xs" radius="lg">
          Create Quote
        </Button>
      </Group>
    </div>
  );
};
