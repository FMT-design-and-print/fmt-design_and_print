import { useUpdateOrder } from "@/hooks/admin/useUpdateOrder";
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { SelectDate } from "./SelectDate";
import { v4 as uid } from "uuid";

interface Props {
  orderNumber: string;
  orderId: string;
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
}

const initialQuoteItem = {
  id: uid(),
  description: "",
  quantity: 0,
  unitAmount: 0,
  totalAmount: 0,
};

export function SendQuote({ orderId, orderNumber }: Props) {
  const { mutate: updateOrder, isPending: isLoading } = useUpdateOrder();
  const [opened, { open, close }] = useDisclosure(false);
  const [fulfillmentDate, setFulfillmentDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([initialQuoteItem]);

  const handleSendOrderQuote = async () => {
    console.log(orderId);
  };

  const handleAddNewQuoteItem = () => {
    setQuoteItems([...quoteItems, { ...initialQuoteItem, id: uid() }]);
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems(quoteItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title={
          <Text>
            Create Order Quote{" "}
            <Text fw="bold" size="sm" component="span">
              (#{orderNumber})
            </Text>
          </Text>
        }
      >
        <Divider />
        {quoteItems.map((item, index) => (
          <Card withBorder my="xs" key={item.id}>
            <Stack>
              <Group justify="space-between">
                <Text>Item {index + 1}</Text>
                {quoteItems.length > 1 && (
                  <ActionIcon
                    size="xs"
                    color="red"
                    variant="light"
                    onClick={() => handleRemoveQuoteItem(item.id)}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                )}
              </Group>

              <TextInput placeholder="Item Description" />
              <Flex direction={{ base: "column", sm: "row" }} gap={8}>
                <NumberInput placeholder="Quantity" min={1} />
                <TextInput placeholder="Unit Amount" />
                <TextInput placeholder="Total Amount" />
              </Flex>
            </Stack>
          </Card>
        ))}

        <Button
          w="100%"
          leftSection={<IconPlus size="1rem" />}
          color="gray"
          variant="light"
          style={{ border: "1px dashed var(--mantine-color-gray-4)" }}
          radius={0}
          onClick={handleAddNewQuoteItem}
        >
          Add Item
        </Button>

        <Card withBorder my="lg" bg="gray.1">
          <Text size="sm" fw="bold" mb="md">
            Estimated Fulfillment Date
          </Text>
          <SelectDate value={fulfillmentDate} setValue={setFulfillmentDate} />
        </Card>
        {error && <Alert color="red" variant="light" title={error} mb="md" />}
        <Button
          className="btn"
          w="100%"
          onClick={handleSendOrderQuote}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          {isLoading ? (
            <>
              <Loader color="white" size="xs" /> Sending quote...{" "}
            </>
          ) : (
            "Send Quote"
          )}
        </Button>
      </Modal>

      <Button
        onClick={open}
        size="compact-xs"
        py="5px"
        variant="transparent"
        color="cyan"
        leftSection={<IconArrowRight size="0.7rem" />}
      >
        Create Quote
      </Button>
    </>
  );
}
