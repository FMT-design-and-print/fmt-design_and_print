import { IShippingAddress } from "@/types";
import { Button, Card, Group, Loader, Text } from "@mantine/core";
import { FaRegTrashCan } from "react-icons/fa6";
import { EditAddress } from "./EditAddress";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  address: IShippingAddress;
}

export const AddressCard = ({ address }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

  const deleteAddress = async () => {
    setOpened(false);
    const supabase = createClient();

    setLoading(true);

    const { error } = await supabase
      .from("shipping-addresses")
      .delete()
      .eq("id", address.id ?? "");

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    toast.success("Shipping address updated");
    close();
    router.refresh();
  };
  return (
    <Card style={{ backgroundColor: "#fcfcfb" }} withBorder>
      <Text>{address.contactName}</Text>
      <Text c="dimmed" size="sm">
        {address.region}, {address.town}, {address.address}
      </Text>
      <Group justify="space-between">
        <Text c="dimmed" size="sm" mt="sm">
          {address.phone1}
        </Text>
        <Group>
          <EditAddress address={address} />
          <ConfirmDelete
            opened={opened}
            onChange={setOpened}
            trigger={
              loading ? (
                <Loader color="pink" size="sm" />
              ) : (
                <Button
                  size="xs"
                  variant="transparent"
                  color="red.4"
                  rightSection={<FaRegTrashCan />}
                  onClick={() => setOpened((o) => !o)}
                >
                  Delete
                </Button>
              )
            }
          >
            <Text size="sm">Are you sure you want to delete this address?</Text>
            <Group justify="flex-end">
              <Button onClick={deleteAddress} className="btn" size="xs" mt="md">
                Yes
              </Button>
            </Group>
          </ConfirmDelete>
        </Group>
      </Group>
    </Card>
  );
};
