import { Tabs } from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { BannersCalculator } from "./BannersCalculator";
import { CustomizedItemsCalculator } from "./CustomizedItemsCalculator";
import { FramingCalculator } from "./FramingCalculator";
import { PlainItemsCalculator } from "./PlainItemsCalculator";
import { OthersCalculator } from "./OthersCalculator";
import { useCalculatorSettings } from "./hooks/useCalculatorSettings";

// Map calculator IDs to their respective components
const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  "banners-stickers": BannersCalculator,
  "customized-items": CustomizedItemsCalculator,
  framing: FramingCalculator,
  "plain-items": PlainItemsCalculator,
  others: OthersCalculator,
};

export function Calculator() {
  const { data: settings } = useCalculatorSettings();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const sortedSettings = useMemo(() => {
    return settings?.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [settings]);

  // Set initial active tab when settings load
  useEffect(() => {
    if (sortedSettings?.length && !activeTab) {
      setActiveTab(sortedSettings[0].id);
    }
  }, [sortedSettings, activeTab]);

  if (!sortedSettings?.length) return null;

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        {sortedSettings.map((setting) => (
          <Tabs.Tab key={setting.id} value={setting.id}>
            {setting.displayName}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {sortedSettings.map((setting) => {
        const CalculatorComponent = CALCULATOR_COMPONENTS[setting.id];
        if (!CalculatorComponent) return null;

        return (
          <Tabs.Panel key={setting.id} value={setting.id}>
            <CalculatorComponent />
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
}
