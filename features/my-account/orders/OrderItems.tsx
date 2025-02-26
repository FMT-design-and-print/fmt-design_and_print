"use client";
import { IOrderItem, IOrder } from "@/types/order";
import {
  Button,
  Drawer,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useUser } from "@/hooks/useUser";
import { OrderItem } from "./OrderItem";
import { useState } from "react";
import { IShippingAddress } from "@/types";
import { RegionSelect } from "@/components/RegionSelect";
import { TownCombobox } from "@/components/TownCombobox";

interface Props {
  orderId: string;
  orderNumber: string;
  items: IOrderItem[];
  order: IOrder;
  btnLabel?: string;
  onUpdateDeliveryDetails?: (
    orderId: string,
    details: IShippingAddress
  ) => Promise<void>;
  onUpdateNote?: (orderId: string, note: string) => Promise<void>;
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  cod: "Cash On Delivery",
  momo: "Mobile Money",
  card: "Card Payment",
};

export const OrderItems = ({
  orderId,
  orderNumber,
  items,
  order,
  btnLabel,
  onUpdateDeliveryDetails,
  onUpdateNote,
}: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<IShippingAddress>(
    order.deliveryDetails
  );
  const [note, setNote] = useState(order.note || "");

  const canEdit = order.status === "pending" || order.status === "placed";

  const handleSave = async () => {
    if (onUpdateDeliveryDetails) {
      await onUpdateDeliveryDetails(orderId, deliveryDetails);
    }
    setIsEditing(false);
  };

  const handleUpdateNote = async () => {
    if (onUpdateNote) {
      await onUpdateNote(orderId, note);
    }
  };

  return (
    <>
      <Drawer
        position="right"
        size="lg"
        opened={opened}
        onClose={close}
        title={<Title order={4}>ORDER: {orderNumber}</Title>}
      >
        <Stack>
          <div>
            <Title order={5} mb="sm">
              Payment Information
            </Title>
            <Group>
              <Badge
                color={
                  order.paymentStatus === "paid"
                    ? "green"
                    : order.paymentStatus === "partly-paid"
                      ? "yellow"
                      : "red"
                }
              >
                {order.paymentStatus}
              </Badge>
              <Text size="sm">
                {PAYMENT_TYPE_LABELS[order.paymentType] || order.paymentType}
              </Text>
            </Group>
          </div>

          <div>
            <Group justify="space-between" mb="sm">
              <Title order={5}>Delivery Details</Title>
              {canEdit && !isEditing && (
                <Button
                  variant="subtle"
                  color="pink"
                  size="xs"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
              {isEditing && (
                <Group>
                  <Button
                    variant="subtle"
                    size="xs"
                    color="gray"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="filled"
                    color="pink"
                    size="xs"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Group>
              )}
            </Group>

            {isEditing ? (
              <Stack>
                <TextInput
                  label="Contact Name"
                  value={deliveryDetails.contactName}
                  onChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      contactName: e.target.value,
                    })
                  }
                />
                <TextInput
                  label="Phone 1"
                  value={deliveryDetails.phone1}
                  onChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      phone1: e.target.value,
                    })
                  }
                />
                <TextInput
                  label="Phone 2 (Optional)"
                  value={deliveryDetails.phone2}
                  onChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      phone2: e.target.value,
                    })
                  }
                />
                <TextInput
                  label="Email"
                  value={deliveryDetails.email}
                  onChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      email: e.target.value,
                    })
                  }
                />
                <TextInput
                  label="Street Address"
                  value={deliveryDetails.address}
                  onChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      address: e.target.value,
                    })
                  }
                />
                <RegionSelect
                  value={deliveryDetails.region?.id?.toString()}
                  onChange={(region) =>
                    setDeliveryDetails({ ...deliveryDetails, region })
                  }
                  showCustomRequestLink={false}
                />
                <TownCombobox
                  value={deliveryDetails.town}
                  onChange={(town) =>
                    setDeliveryDetails({ ...deliveryDetails, town })
                  }
                  regionId={deliveryDetails.region?.id}
                />
              </Stack>
            ) : (
              <Stack>
                <Text size="sm">
                  <b>Contact:</b> {deliveryDetails.contactName}
                </Text>
                <Text size="sm">
                  <b>Phone:</b> {deliveryDetails.phone1}
                </Text>
                {deliveryDetails.phone2 && (
                  <Text size="sm">
                    <b>Alternative Phone:</b> {deliveryDetails.phone2}
                  </Text>
                )}
                {deliveryDetails.email && (
                  <Text size="sm">
                    <b>Email:</b> {deliveryDetails.email}
                  </Text>
                )}
                <Text size="sm">
                  <b>Address:</b> {deliveryDetails.address}
                  {deliveryDetails.town?.name &&
                    `, ${deliveryDetails.town.name}`}
                </Text>
                {deliveryDetails.region?.name && (
                  <Text size="sm">
                    <b>Region:</b> {deliveryDetails.region.name}
                  </Text>
                )}
              </Stack>
            )}
          </div>

          {canEdit && (
            <div>
              <Title order={5} mb="sm">
                Order Note
              </Title>
              <Stack>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note to this order"
                  minRows={3}
                />
                <Button variant="light" color="pink" onClick={handleUpdateNote}>
                  Update Note
                </Button>
              </Stack>
            </div>
          )}

          <div>
            <Title order={5} mb="sm">
              Order Items
            </Title>
            {items.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                user={user ?? null}
                orderId={orderId}
              />
            ))}
          </div>
        </Stack>
      </Drawer>

      <Button onClick={open} size="xs" variant="subtle" color="pink">
        {btnLabel || "View Details"}
      </Button>
    </>
  );
};
