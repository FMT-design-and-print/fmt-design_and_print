import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group } from "@mantine/core";
import { IShippingAddress } from "@/types";
import { ShippingAddress } from "@/components/ShippingAddress";
import { CiEdit } from "react-icons/ci";

interface Props {
  address: IShippingAddress;
}
export const EditAddress = ({ address }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editedAddress, setEditedAddress] = useState<IShippingAddress>(address);

  const update = (key: keyof IShippingAddress, value: any) => {
    setEditedAddress({ ...editedAddress, [key]: value });
  };

  return (
    <>
      <Modal
        size="lg"
        opened={opened}
        onClose={close}
        title="Edit Shipping Address"
        centered
      >
        <ShippingAddress {...address} update={update} />

        <Group justify="flex-end" grow>
          <Button className="btn" maw={100} my="md">
            Update
          </Button>
        </Group>
      </Modal>

      <Button
        onClick={open}
        size="xs"
        variant="transparent"
        color="gray"
        rightSection={<CiEdit />}
      >
        Edit
      </Button>
    </>
  );
};
