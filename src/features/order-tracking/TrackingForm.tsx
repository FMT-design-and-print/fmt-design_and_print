"use client";
import { areAllowedOrderNumbers } from "@/functions";
import { Button, Group, Input, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const TrackingForm = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const trackStatus = () => {
    const orderNumbers = value.split(",").map((x) => x.trim());
    const areAllowedNumbers = areAllowedOrderNumbers(orderNumbers);

    if (!areAllowedNumbers) {
      toast.error("Please enter valid order numbers");
      return;
    }

    router.push(
      `/order-tracking/${value.replaceAll(" ", "").replaceAll(",", "-")}`
    );
  };

  return (
    <>
      <Input.Label htmlFor="orderNumber">Order Number(s):</Input.Label>
      <TextInput
        id="orderNumber"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder="34565,673466,7762256"
      />
      <Group justify="flex-end">
        <Button className="btn" my="md" onClick={trackStatus}>
          Track order status
        </Button>
      </Group>
    </>
  );
};
