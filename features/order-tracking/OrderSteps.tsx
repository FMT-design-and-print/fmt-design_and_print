import React, { useEffect, useState } from "react";
import {
  IconBox,
  IconCircleCheck,
  IconFile3d,
  IconTruckDelivery,
  IconUserCheck,
} from "@tabler/icons-react";
import { Stepper, Text, rem } from "@mantine/core";
import { OrderStatus } from "@/types/order";

interface Props {
  orientation?: "vertical" | "horizontal";
  status: OrderStatus;
}

export const OrderSteps = ({ orientation, status }: Props) => {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (status === "placed") {
      setActive(0);
    }
    if (status === "processing") {
      setActive(1);
    }
    if (status === "shipped") {
      setActive(2);
    }

    if (status === "delivered") {
      setActive(3);
    }

    if (status === "completed") {
      setActive(4);
    }
  }, [status]);

  return (
    <Stepper
      orientation={orientation}
      color="pink"
      active={active}
      completedIcon={
        <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
      }
    >
      <Stepper.Step
        icon={<IconUserCheck style={{ width: rem(18), height: rem(18) }} />}
        label="Order Placed"
        description={<Text size="xs">Your order has been confirmed</Text>}
      />
      <Stepper.Step
        icon={<IconFile3d style={{ width: rem(18), height: rem(18) }} />}
        label="Processing"
        description={<Text size="xs">We are working on your order</Text>}
      />
      <Stepper.Step
        icon={<IconTruckDelivery style={{ width: rem(18), height: rem(18) }} />}
        label="In Transit"
        description={
          <Text size="xs">Your order is on it&apos;s way to you</Text>
        }
      />
      <Stepper.Step
        icon={<IconBox style={{ width: rem(18), height: rem(18) }} />}
        label="Delivered"
        description={
          <Text size="xs">Your order is delivered and marked complete</Text>
        }
      />
    </Stepper>
  );
};
