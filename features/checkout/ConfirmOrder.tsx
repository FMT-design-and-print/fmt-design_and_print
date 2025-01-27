import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Divider,
  Paper,
  Group,
  Stack,
  Text,
  Badge,
} from "@mantine/core";
import { DeliveryType } from "@/types/order";
import { IShippingAddress, PaymentType } from "@/types";
import { IconUser } from "@tabler/icons-react";
import { IconPhone } from "@tabler/icons-react";
import { IconMapPin } from "@tabler/icons-react";
import { IconMail } from "@tabler/icons-react";

interface ConfirmOrderProps {
  total: number;
  shippingAddress: IShippingAddress;
  deliveryType: DeliveryType;
  paymentType: PaymentType;
  onConfirm: () => void;
}

export const ConfirmOrder = ({
  total,
  shippingAddress,
  deliveryType,
  paymentType,
  onConfirm,
}: ConfirmOrderProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Confirm Order">
        <Stack>
          <Text fw={600} size="lg">
            Order Summary
          </Text>

          <Paper withBorder p="md" radius="sm">
            <Stack gap="xs">
              <Text fw={500}>Delivery Details</Text>

              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm">{shippingAddress.contactName}</Text>
              </Group>

              <Group gap="xs">
                <IconPhone size={16} />
                <Text size="sm">{shippingAddress.phone1}</Text>
                {shippingAddress.phone2 && (
                  <Text size="sm">, {shippingAddress.phone2}</Text>
                )}
              </Group>

              {shippingAddress.email && (
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm">{shippingAddress.email}</Text>
                </Group>
              )}

              <Group gap="xs">
                <IconMapPin size={16} />
                <Text size="sm">
                  {shippingAddress.address}, {shippingAddress.region?.name},{" "}
                  {shippingAddress.country}
                </Text>
              </Group>
            </Stack>
          </Paper>

          <Paper withBorder p="md" radius="sm">
            <Stack gap="xs">
              <Text fw={500}>Order Details</Text>

              <Group justify="space-between">
                <Text size="sm">Delivery Method:</Text>
                <Badge color="pink">
                  {deliveryType === "pickup" ? "Pickup" : "Delivery"}
                </Badge>
              </Group>

              <Group justify="space-between">
                <Text size="sm">Payment Method:</Text>
                <Badge color="pink">
                  {paymentType === "cod"
                    ? "Cash on Delivery"
                    : paymentType === "momo"
                      ? "Mobile Money"
                      : "Card"}
                </Badge>
              </Group>

              <Divider my="xs" />

              <Group justify="space-between">
                <Text fw={500}>Total Amount:</Text>
                <Text fw={600} size="lg">
                  GHS {total.toFixed(2)}
                </Text>
              </Group>
            </Stack>
          </Paper>

          <Group justify="flex-end" mt="md">
            <Button variant="light" color="pink" onClick={close}>
              Cancel
            </Button>
            <Button
              className="btn"
              onClick={() => {
                onConfirm();
                close();
              }}
            >
              Confirm Order
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Button
        onClick={open}
        className="btn"
        w={{ base: "100%", sm: "fit-content" }}
      >
        Confirm Order
      </Button>
    </>
  );
};
