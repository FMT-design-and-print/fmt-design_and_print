import { Tabs } from "@mantine/core";
import { BannersCalculator } from "./BannersCalculator";
import { CustomizedItemsCalculator } from "./CustomizedItemsCalculator";
import { FramingCalculator } from "./FramingCalculator";
import { PlainItemsCalculator } from "./PlainItemsCalculator";
import { OthersCalculator } from "./OthersCalculator";

export function Calculator() {
  return (
    <Tabs defaultValue="banners-stickers">
      <Tabs.List>
        <Tabs.Tab value="banners-stickers">Banners & Stickers</Tabs.Tab>
        <Tabs.Tab value="customized-items">Customized Items</Tabs.Tab>
        <Tabs.Tab value="framing">Framing</Tabs.Tab>
        <Tabs.Tab value="plain-items">Plain Items</Tabs.Tab>
        <Tabs.Tab value="others">Others</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="banners-stickers">
        <BannersCalculator />
      </Tabs.Panel>
      <Tabs.Panel value="customized-items">
        <CustomizedItemsCalculator />
      </Tabs.Panel>
      <Tabs.Panel value="framing">
        <FramingCalculator />
      </Tabs.Panel>
      <Tabs.Panel value="plain-items">
        <PlainItemsCalculator />
      </Tabs.Panel>
      <Tabs.Panel value="others">
        <OthersCalculator />
      </Tabs.Panel>
    </Tabs>
  );
}
