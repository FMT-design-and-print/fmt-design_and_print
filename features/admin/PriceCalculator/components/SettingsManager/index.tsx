import { Button, Group, Stack, Tabs, Title } from "@mantine/core";
import { BannersStickersSettings } from "./BannersStickersSettings";
import { CustomizedItemsSettings } from "./CustomizedItemsSettings";
import { FramingSettings } from "./FramingSettings";
import { OthersSettings } from "./OthersSettings";
import { PlainItemsSettings } from "./PlainItemsSettings";

type Props = {
  onClose: () => void;
};

export function SettingsManager({ onClose }: Props) {
  return (
    <Stack>
      <Group justify="space-between" mb="lg">
        <Title order={3}>Calculator Settings</Title>
        <Button variant="light" onClick={onClose} color="pink">
          Back to Calculator
        </Button>
      </Group>

      <Tabs defaultValue="banners-stickers">
        <Tabs.List>
          <Tabs.Tab value="banners-stickers">Banners & Stickers</Tabs.Tab>
          <Tabs.Tab value="customized-items">Customized Items</Tabs.Tab>
          <Tabs.Tab value="framing">Framing</Tabs.Tab>
          <Tabs.Tab value="plain-items">Plain Items</Tabs.Tab>
          <Tabs.Tab value="others">Others</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="banners-stickers">
          <BannersStickersSettings />
        </Tabs.Panel>
        <Tabs.Panel value="customized-items">
          <CustomizedItemsSettings />
        </Tabs.Panel>
        <Tabs.Panel value="framing">
          <FramingSettings />
        </Tabs.Panel>
        <Tabs.Panel value="plain-items">
          <PlainItemsSettings />
        </Tabs.Panel>
        <Tabs.Panel value="others">
          <OthersSettings />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
