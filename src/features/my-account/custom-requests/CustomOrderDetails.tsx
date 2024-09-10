import { TextEditor } from "@/components/TextEditor";
import { formatCamelCase, formatString, isLink } from "@/functions";
import { useCustomEditor } from "@/hooks/useCustomEditor";
import { Button, Drawer, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DOMPurify from "dompurify";
import Link from "next/link";

const generalFields = [
  "quantity",
  "artworkOption",
  "quoteReceptionMedium",
  "quoteReceptionValue",
  "instructions",
  "artworks",
];

interface Props {
  orderId: string;
  btnLabel?: string;
  orderDetails: any;
}
export const CustomOrderDetails = ({
  orderId,
  orderDetails,
  btnLabel,
}: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const editor = useCustomEditor(DOMPurify.sanitize(orderDetails.instructions));

  return (
    <>
      <Drawer
        position="right"
        size="lg"
        opened={opened}
        onClose={close}
        title={`ORDER: ${orderId}`}
      >
        <Title order={5} mb="sm">
          Order details
        </Title>

        {Object.entries(orderDetails).map(([key, value]) => {
          if (!generalFields.includes(key)) {
            return (
              <Group my="md" key={key}>
                <Text fw="bold">{formatString(formatCamelCase(key))}: </Text>

                {isLink(value as any) ? (
                  <Link
                    href={value || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatString(value as any)}
                  </Link>
                ) : (
                  <Text>{formatString(value as any)}</Text>
                )}
              </Group>
            );
          }
          return null;
        })}

        <Group my="md">
          <Text fw="bold">Quantity: </Text>
          <Text>{orderDetails.quantity}</Text>
        </Group>

        <Group>
          <Text fw="bold">Artwork Option: </Text>
          <Text>
            {orderDetails.artworkOption === "own-artwork"
              ? "You provided your own artwork"
              : orderDetails.artworkOption === "fmt-to-provide"
                ? "FMT to provide Artwork for me"
                : "No Artwork Needed"}
          </Text>
        </Group>

        <Group>
          <Text fw="bold">Number of Artworks Provided: </Text>
          <Text>{orderDetails.artworks.length}</Text>
        </Group>

        <Stack my="lg">
          <Text fw="bold">Instructions</Text>
          <TextEditor editor={editor} />
        </Stack>

        <Group my="md">
          <Text size="sm" c="dimmed">
            We will reach out to you via {orderDetails.quoteReceptionMedium} on{" "}
            {orderDetails.quoteReceptionValue}
          </Text>
        </Group>
      </Drawer>

      <Button onClick={open} size="xs" variant="subtle" color="pink">
        {btnLabel || "View Details"}
      </Button>
    </>
  );
};
