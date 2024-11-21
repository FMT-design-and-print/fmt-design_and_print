import { RichTextComponents } from "@/components/RichTextComponent";
import { Tabs } from "@mantine/core";
import { PortableText } from "@portabletext/react";

interface Props {
  description?: string;
  details: any;
}
export const ProductDescription = ({ description, details }: Props) => {
  return (
    <Tabs
      variant="outline"
      color="gray"
      radius="sm"
      defaultValue="description"
      px="xl"
      mt="xl"
    >
      <Tabs.List py="md">
        <Tabs.Tab value="description" px="xl" py="md">
          Description
        </Tabs.Tab>
        <Tabs.Tab value="details" px="xl" py="md">
          Product Details
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description" py="md">
        {description}
      </Tabs.Panel>
      <Tabs.Panel value="details" py="md">
        <PortableText value={details} components={RichTextComponents} />
      </Tabs.Panel>
    </Tabs>
  );
};
