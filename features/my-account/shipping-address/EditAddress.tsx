import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group } from "@mantine/core";
import { IShippingAddress } from "@/types";
import { ShippingAddress } from "@/components/ShippingAddress";
import { CiEdit } from "react-icons/ci";
import { createClient } from "@/utils/supabase/client";
import { getChangedDetails } from "@/functions/user";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/LoadingOverlay";

interface Props {
  address: IShippingAddress;
}
export const EditAddress = ({ address }: Props) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [editedAddress, setEditedAddress] = useState<IShippingAddress>(address);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof IShippingAddress, value: any) => {
    setEditedAddress((prevState) => ({ ...prevState, [key]: value }));
  };

  const updateDetailsInDB = async () => {
    const supabase = createClient();

    const changedDetails = getChangedDetails(address, editedAddress);
    if (Object.keys(changedDetails).length > 0) {
      setLoading(true);

      const { error } = await supabase
        .from("shipping-addresses")
        .update(changedDetails)
        .eq("id", address.id as string);

      setLoading(false);

      if (error) {
        console.error(error);
        return;
      }

      toast.success("Shipping address updated");
      close();
      router.refresh();
    }
  };

  return (
    <>
      <Modal
        size="lg"
        opened={opened}
        onClose={close}
        title="Edit Shipping Address"
        centered
        pos="relative"
      >
        <LoadingOverlay visible={loading} />
        <ShippingAddress
          {...editedAddress}
          update={update}
          deliveryType="delivery"
        />

        <Group justify="flex-end" grow>
          <Button onClick={updateDetailsInDB} className="btn" maw={100} my="md">
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
