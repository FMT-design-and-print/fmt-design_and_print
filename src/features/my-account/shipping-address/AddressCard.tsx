import { IShippingAddress } from "@/types";
import { Button, Card, Group, Text, Title } from "@mantine/core";
import { FaRegTrashCan } from "react-icons/fa6";
import { EditAddress } from "./EditAddress";

interface Props {
  address: IShippingAddress;
}

export const AddressCard = ({ address }: Props) => {
  return (
    <Card style={{ backgroundColor: "#fcfcfb" }} withBorder>
      <Title order={4}>{address.contactName}</Title>
      <Text c="dimmed">
        {address.region}, {address.town}, {address.address}
      </Text>
      <Group justify="space-between">
        <Text c="dimmed" size="sm" mt="sm">
          {address.phone1}
        </Text>
        <Group>
          <EditAddress address={address} />
          <Button
            size="xs"
            variant="transparent"
            color="gray"
            rightSection={<FaRegTrashCan />}
          >
            Delete
          </Button>
        </Group>
      </Group>
    </Card>
  );
};
