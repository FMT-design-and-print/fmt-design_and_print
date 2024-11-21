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

export const PickupSteps = ({ orientation, status }: Props) => {
  const [active, setActive] = useState(2);

  useEffect(() => {
    if (status.trim() === "placed") {
      setActive(0);
    }

    if (status.trim() === "processing") {
      setActive(1);
    }
    if (status.trim() === "packaging") {
      setActive(2);
    }

    if (status.trim() === "ready") {
      setActive(3);
    }

    if (status.trim() === "completed") {
      setActive(4);
    }
  }, [status]);

  return (
    <>
      <Stepper
        orientation={orientation}
        color="pink"
        active={active}
        onStepClick={setActive}
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
          icon={
            <IconTruckDelivery style={{ width: rem(18), height: rem(18) }} />
          }
          label="Preparing for Pickup"
          description={
            <Text size="xs">We are getting your ready for pickup</Text>
          }
        />
        <Stepper.Step
          icon={<IconBox style={{ width: rem(18), height: rem(18) }} />}
          label="Ready for Pickup"
          description={
            <Text size="xs">You can pick your order up at our store</Text>
          }
        />
      </Stepper>
    </>
  );
};
