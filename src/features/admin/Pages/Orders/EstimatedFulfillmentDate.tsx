import { getFormattedDaysToFuture } from "@/functions/durations";
import { OrderStatus } from "@/types/order";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Badge, Group, Loader, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  orderId: string;
  orderStatus: OrderStatus;
  defaultFulfillmentDate: Date | undefined;
}

export const EstimatedFulfillmentDate = ({
  orderId,
  orderStatus,
  defaultFulfillmentDate,
}: Props) => {
  const initialFulfillmentDate = defaultFulfillmentDate
    ? new Date(defaultFulfillmentDate)
    : null;
  const [editFulfillmentDate, setEditFulfillmentDate] = useState(false);
  const [fulfillmentDate, setFulfillmentDate] = useState(
    initialFulfillmentDate
  );
  const [loading, setLoading] = useState(false);

  const isOrderActive = ![
    "delivered",
    "completed",
    "cancelled",
    "pending-cancellation",
  ].includes(orderStatus);

  const updateFulfillmentDate = async () => {
    if (!fulfillmentDate) {
      toast.error("Please select valid estimated fulfillment date");
      return;
    }

    const supabase = createClient();
    setLoading(true);
    const { error } = await supabase
      .from("custom-orders")
      .update({ estimatedFulfillmentDate: new Date(fulfillmentDate) })
      .eq("id", orderId);

    setLoading(false);
    setEditFulfillmentDate(false);

    if (error) {
      toast.error("Failed to update fulfillment date. Try again!");
    } else {
      toast.success("Fulfillment date updated successfully");
    }
  };

  return (
    <Group my="sm">
      <Text size="sm">Estimated Fulfillment Date: </Text>
      <Group gap={4}>
        <DateInput
          size="xs"
          placeholder="Set Date"
          readOnly={!editFulfillmentDate}
          value={fulfillmentDate}
          onChange={(value) => setFulfillmentDate(value)}
          valueFormat="ddd, MMM DD YYYY"
          minDate={new Date()}
        />
        {fulfillmentDate && isOrderActive && (
          <Badge variant="light" color="gray" size="xs">
            {getFormattedDaysToFuture(fulfillmentDate)}
          </Badge>
        )}
        {isOrderActive && !editFulfillmentDate && (
          <ActionIcon
            title="edit"
            variant="light"
            color="gray"
            onClick={() => setEditFulfillmentDate(true)}
          >
            <IconPencil size="1rem" />
          </ActionIcon>
        )}
        {editFulfillmentDate && (
          <>
            <ActionIcon
              variant="light"
              color="green"
              onClick={() => updateFulfillmentDate()}
              disabled={!fulfillmentDate}
            >
              {loading ? (
                <Loader size="12px" color="pink" />
              ) : (
                <IconCheck size="1rem" />
              )}
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="gray"
              onClick={() => setEditFulfillmentDate(false)}
            >
              <IconX size="1rem" />
            </ActionIcon>
          </>
        )}
      </Group>
    </Group>
  );
};
