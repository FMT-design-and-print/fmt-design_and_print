import { Button, Group, Stack, Tabs, Title } from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { BannersStickersSettings } from "./BannersStickersSettings";
import { CustomizedItemsSettings } from "./CustomizedItemsSettings";
import { FramingSettings } from "./FramingSettings";
import { OthersSettings } from "./OthersSettings";
import { PlainItemsSettings } from "./PlainItemsSettings";
import { useCalculatorSettings } from "../../hooks/useCalculatorSettings";

// Map calculator IDs to their respective settings components
const SETTINGS_COMPONENTS: Record<string, React.ComponentType> = {
  "banners-stickers": BannersStickersSettings,
  "customized-items": CustomizedItemsSettings,
  framing: FramingSettings,
  "plain-items": PlainItemsSettings,
  others: OthersSettings,
};

type Props = {
  onClose: () => void;
};

export function SettingsManager({ onClose }: Props) {
  const { data: settings } = useCalculatorSettings();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const sortedSettings = useMemo(() => {
    return settings?.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [settings]);

  useEffect(() => {
    if (sortedSettings?.length && !activeTab) {
      setActiveTab(sortedSettings[0].id);
    }
  }, [sortedSettings, activeTab]);

  if (!sortedSettings?.length) return null;

  return (
    <Stack>
      <Group justify="space-between" mb="lg">
        <Title order={3}>Calculator Settings</Title>
        <Button variant="light" onClick={onClose} color="pink">
          Back to Calculator
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          {sortedSettings.map((setting) => (
            <Tabs.Tab key={setting.id} value={setting.id}>
              {setting.displayName}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {sortedSettings.map((setting) => {
          const SettingsComponent = SETTINGS_COMPONENTS[setting.id];
          if (!SettingsComponent) return null;

          return (
            <Tabs.Panel key={setting.id} value={setting.id}>
              <SettingsComponent />
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Stack>
  );
}
