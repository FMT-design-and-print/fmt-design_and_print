import { useUpdateOrder } from "@/hooks/admin/useUpdateOrder";
import {
  Alert,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { SelectDate } from "./SelectDate";

interface Props {
  orderNumber: string;
  orderId: string;
  totalAmount: number;
  numberOfItems: number;
}

export function ConfirmOrder({
  orderId,
  orderNumber,
  totalAmount,
  numberOfItems,
}: Props) {
  const { mutate: updateOrder, isPending: isLoading } = useUpdateOrder();
  const [opened, { open, close }] = useDisclosure(false);
  const [fulfillmentDate, setFulfillmentDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    if (!fulfillmentDate) {
      setError("Please select estimated fulfillment date");
      return;
    }

    updateOrder(
      {
        orderId,
        update: { status: "placed", estimatedFulfillmentDate: fulfillmentDate },
      },
      {
        onSuccess: () => close(),
        onError: () => setError("Failed to confirm order. Try again"),
      }
    );
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text>
            Confirm Order{" "}
            <Text fw="bold" size="sm" component="span">
              (#{orderNumber})
            </Text>
          </Text>
        }
      >
        <Divider />
        <Group my="md">
          <Text size="sm" fw="bold">
            Number of items:{" "}
          </Text>
          <Text size="sm">{numberOfItems}</Text>
        </Group>

        <Group>
          <Text size="sm" fw="bold">
            Total Amount:{" "}
          </Text>
          <Text size="sm">{totalAmount.toFixed(2)}</Text>
        </Group>

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
          onClick={handleConfirmOrder}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          {isLoading ? (
            <>
              <Loader color="white" size="xs" /> Confirming...{" "}
            </>
          ) : (
            "Confirm Order"
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
        Confirm
      </Button>
    </>
  );
}
