import { CopyIcon } from "@/components/CopyIcon";
import { IOrderItem } from "@/types/order";
import {
  Accordion,
  Avatar,
  Badge,
  Card,
  Divider,
  Group,
  Text,
} from "@mantine/core";
import { ArtworkFiles } from "./ArtworkFiles";
import { InstructionsViewer } from "./InstructionsViewer";
import { formatString } from "@/functions";

interface Props {
  item: IOrderItem;
}

export const OrderItem = ({ item }: Props) => {
  const hasCustomizationDetails =
    item.isCustomizable &&
    ((item.artworkFiles && item.artworkFiles.length > 0) ||
      (item.artworkFilesMap && Object.keys(item.artworkFilesMap).length > 0) ||
      item.instructions);

  return (
    <Card withBorder my="sm">
      <Group gap="sm" wrap="nowrap">
        <Avatar size="lg" src={item.image} radius="xs" />

        <div style={{ flex: 1 }}>
          <Group gap={4}>
            {item.productNumber && (
              <>
                <Text c="gray.6" fw="bold" size="sm">
                  #{item.productNumber}
                </Text>
                <CopyIcon value={item.productNumber || ""} />
              </>
            )}
          </Group>

          <Text fz="sm" fw={500} lineClamp={2} mb="xs">
            {item.title}
          </Text>

          <Group wrap="wrap">
            {item.color && (
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Color:
                </Text>
                <Avatar src={item.color?.image} size="xs" />
              </Group>
            )}

            {item.size && (
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Size:
                </Text>
                <Text fz="xs" fw={500}>
                  {item.size}
                </Text>
              </Group>
            )}

            {item.selectedProductType && (
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Type:
                </Text>
                <Badge size="xs" color="pink">
                  {formatString(item.selectedProductType)}
                </Badge>
              </Group>
            )}

            <Group gap="5px">
              <Text fz="xs" c="dimmed">
                Quantity:
              </Text>
              <Text fz="xs" fw={500}>
                {item.quantity}
              </Text>
            </Group>

            <Group gap="5px">
              <Text fz="xs" c="dimmed">
                Price:
              </Text>
              <Text fz="xs" fw={500}>
                GHS {item.price * item.quantity}
              </Text>
            </Group>
          </Group>

          {item.note && (
            <Group mt="xs">
              <Text fz="xs" c="dimmed">
                Note:
              </Text>
              <Text fz="xs" style={{ fontStyle: "italic" }}>
                {item.note}
              </Text>
            </Group>
          )}
        </div>
      </Group>

      {hasCustomizationDetails && (
        <>
          <Divider my="sm" />
          <Accordion variant="contained">
            <Accordion.Item value="customization">
              <Accordion.Control>
                <Text size="sm" fw="bold">
                  Customization Details
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                {/* Artwork Files */}
                {((item.artworkFiles && item.artworkFiles.length > 0) ||
                  (item.artworkFilesMap &&
                    Object.keys(item.artworkFilesMap).length > 0)) && (
                  <ArtworkFiles
                    artworkFiles={item.artworkFiles}
                    artworkFilesMap={item.artworkFilesMap}
                  />
                )}

                {/* Instructions */}
                {item.instructions && (
                  <InstructionsViewer instructions={item.instructions} />
                )}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </>
      )}
    </Card>
  );
};
