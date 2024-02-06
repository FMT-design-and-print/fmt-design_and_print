import { useCheckout } from "@/store/checkout";
import { Card, Select, SimpleGrid, TextInput, Title } from "@mantine/core";

export const DeliveryInformation = () => {
  const {
    details: { fullName, email, phone, country, address, region },
    update,
  } = useCheckout((state) => state);

  return (
    <Card withBorder my="sm">
      <Title order={3} py={16} c="dimmed">
        Delivery Information
      </Title>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <TextInput
          value={fullName}
          onChange={(e) => update("fullName", e.currentTarget.value)}
          label="Full name"
          placeholder="John Doe"
          autoComplete="on"
        />
        <TextInput
          type="email"
          value={email}
          onChange={(e) => update("email", e.currentTarget.value)}
          label="Email"
          placeholder="qI8gM@example.com"
        />

        <TextInput
          value={phone}
          onChange={(e) => update("phone", e.currentTarget.value)}
          label="Phone"
          placeholder="+233555555555 or 0555555555"
        />

        <Select
          value={country}
          onChange={(value) => update("country", value || "")}
          comboboxProps={{ withinPortal: true }}
          data={["Ghana"]}
          placeholder="Ghana"
          label="Country"
        />

        <TextInput
          value={region}
          onChange={(e) => update("region", e.currentTarget.value)}
          label="Region"
          placeholder="Greater Accra"
        />

        <TextInput
          value={address}
          onChange={(e) => update("address", e.currentTarget.value)}
          label="Home address"
          placeholder="Soko Park, Tantra Hills, Accra"
        />
      </SimpleGrid>
    </Card>
  );
};
