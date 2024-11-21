import { useCheckout } from "@/store/checkout";
import { IShippingAddress } from "@/types";
import { Button, Card, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

interface Props {
  shippingAddresses: IShippingAddress[];
}
export function AvailableShippingAddresses({ shippingAddresses }: Props) {
  const { setDetails, update } = useCheckout();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [opened, { open, close }] = useDisclosure(false);

  const handleUseAddress = () => {
    const address = shippingAddresses.find(
      (address) => address.id === selectedId
    );

    if (!address) return;

    const defaultAddress: Partial<IShippingAddress> = {
      contactName: address.contactName,
      phone1: address.phone1,
      phone2: address.phone2,
      email: address.email,
      region: address.region,
      town: address.town,
      address: address.address,
    };

    setDetails(defaultAddress);
    update("saveAddress", false);
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Available Shipping Addresses"
      >
        {shippingAddresses.map((address) => (
          <Card
            key={address.id}
            style={{
              backgroundColor: "#fcfcfb",
              cursor: "pointer",
              borderColor:
                selectedId === address.id ? "var(--primary-100)" : "",
            }}
            withBorder
            onClick={() => setSelectedId(address.id)}
            my="md"
          >
            <Text>{address.contactName}</Text>
            <Text c="dimmed" size="sm">
              {address.region}, {address.town}, {address.address}
            </Text>
            <Group justify="space-between">
              <Text c="dimmed" size="sm" mt="sm">
                {address.phone1}
              </Text>
            </Group>
          </Card>
        ))}

        <Group justify="flex-end">
          <Button
            color="gray"
            variant="outline"
            size="xs"
            onClick={() => {
              setSelectedId(undefined);
              close();
            }}
          >
            Cancel{" "}
          </Button>
          <Button
            className="btn"
            size="xs"
            opacity={selectedId ? 1 : 0.5}
            disabled={!selectedId}
            onClick={handleUseAddress}
          >
            Use address
          </Button>
        </Group>
      </Modal>

      <Button
        variant="transparent"
        color="pink"
        onClick={open}
        w="fit-content"
        px="0"
        rightSection={<IconChevronDown size="1rem" />}
      >
        Select Shipping Address
      </Button>
    </>
  );
}
