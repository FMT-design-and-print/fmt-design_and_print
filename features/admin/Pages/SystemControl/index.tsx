"use client";

import { Tabs } from "@mantine/core";
import { WebsiteSettings } from "./WebsiteSettings";
import { ProductPriceManager } from "./ProductPriceManager";
import { IconSettings, IconCurrencyDollar } from "@tabler/icons-react";

export function SystemControl() {
  return (
    <Tabs defaultValue="website-settings">
      <Tabs.List>
        <Tabs.Tab
          value="website-settings"
          leftSection={<IconSettings size={16} />}
        >
          Website Settings
        </Tabs.Tab>
        <Tabs.Tab
          value="price-manager"
          leftSection={<IconCurrencyDollar size={16} />}
        >
          Product Price Manager
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="website-settings" pt="xl">
        <WebsiteSettings />
      </Tabs.Panel>

      <Tabs.Panel value="price-manager" pt="xl">
        <ProductPriceManager />
      </Tabs.Panel>
    </Tabs>
  );
}
