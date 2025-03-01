import { useCheckout, useEditCheckoutItem } from "@/store/checkout";
import {
  Card,
  Flex,
  Group,
  Avatar,
  Button,
  Text,
  NumberInput,
  Title,
  Collapse,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconEdit } from "@tabler/icons-react";
import { ReceivedFilesRenderer } from "@/components/Dropzone/ReceivedFilesRenderer";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const ReviewItems = () => {
  const router = useRouter();
  const {
    details: { items },
    increaseQuantity,
    decreaseQuantity,
  } = useCheckout((state) => state);
  const { setIsEditingProduct } = useEditCheckoutItem((state) => state);
  const [openArtworks, setOpenArtworks] = useState<Record<string, boolean>>({});

  const toggleArtworks = (itemId: string) => {
    setOpenArtworks((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleEditItem = (itemId: string) => {
    setIsEditingProduct(true);
    router.push(`/services/print/${itemId}`);
  };

  return (
    <Card withBorder>
      <Title order={3} py={16} c="dimmed">
        Review Items
      </Title>

      {items.map((item) => (
        <Card key={item.id}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            wrap="nowrap"
          >
            <Group gap="sm" wrap="nowrap">
              <Avatar size="lg" src={item.image} radius="xs" />

              <div>
                <Text fz="sm" fw={500} lineClamp={1} mb="xs">
                  {item.title}
                </Text>

                <Group>
                  {item.color && (
                    <Group gap="5px">
                      <Text fz="xs" c="dimmed">
                        Color:
                      </Text>
                      <Avatar src={item.color?.image} size="xs" />
                    </Group>
                  )}
                  {item.size && (
                    <Text fz="xs" c="dimmed">
                      Size: {item.size}
                    </Text>
                  )}
                  {item.isCustomizable &&
                    item.artworkFiles &&
                    item.artworkFiles.length > 0 && (
                      <Text fz="xs" c="dimmed">
                        Artworks: {item.artworkFiles.length}
                      </Text>
                    )}
                </Group>
              </div>
            </Group>

            <Flex
              gap={4}
              pt="xs"
              direction={{ base: "row", md: "column" }}
              justify="space-between"
              wrap="wrap"
            >
              <Group>
                <Button
                  onClick={() => decreaseQuantity(item.id)}
                  variant="light"
                  color="gray"
                  size="xs"
                >
                  -
                </Button>
                <NumberInput
                  w={40}
                  placeholder="1"
                  value={item.quantity}
                  min={1}
                  hideControls
                  size="xs"
                />
                <Button
                  onClick={() => increaseQuantity(item.id)}
                  variant="light"
                  color="gray"
                  size="xs"
                >
                  +
                </Button>
                <Button
                  onClick={() => handleEditItem(item.id)}
                  variant="subtle"
                  color="pink"
                  size="xs"
                  leftSection={<IconEdit size={14} />}
                >
                  Edit
                </Button>
              </Group>

              <Group>
                <Text fz="sm" c="dimmed">
                  Price:
                </Text>
                <Text fz="sm" fw={500}>
                  GHS {item.price * item.quantity}
                </Text>
              </Group>
            </Flex>
          </Flex>

          {item.isCustomizable &&
            ((item.artworkFiles && item.artworkFiles.length > 0) ||
              (item.artworkFilesMap &&
                Object.keys(item.artworkFilesMap).length > 0)) && (
              <>
                <UnstyledButton
                  onClick={() => toggleArtworks(item.id)}
                  mt="md"
                  style={{ width: "100%" }}
                >
                  <Group justify="space-between">
                    <Text size="xs" c="pink">
                      {openArtworks[item.id] ? "Hide" : "View"} Artwork Files
                    </Text>
                    {openArtworks[item.id] ? (
                      <IconChevronUp size={16} />
                    ) : (
                      <IconChevronDown size={16} />
                    )}
                  </Group>
                </UnstyledButton>

                <Collapse in={openArtworks[item.id]}>
                  <Box mt="xs">
                    {item.artworkFilesMap &&
                    Object.keys(item.artworkFilesMap).length > 0 ? (
                      <Group>
                        {Object.entries(item.artworkFilesMap).map(
                          ([label, files]) => (
                            <Box key={label} mb="md">
                              <ReceivedFilesRenderer
                                files={files}
                                title={`${label} (${files.length})`}
                                requireOneFile={true}
                              />
                            </Box>
                          )
                        )}
                      </Group>
                    ) : (
                      <ReceivedFilesRenderer
                        files={item.artworkFiles || []}
                        title={`Artwork Files (${item.artworkFiles?.length || 0})`}
                        requireOneFile={true}
                      />
                    )}
                  </Box>
                </Collapse>
              </>
            )}
        </Card>
      ))}
    </Card>
  );
};
