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
  Skeleton,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconEdit } from "@tabler/icons-react";
import { ReceivedFilesRenderer } from "@/components/Dropzone/ReceivedFilesRenderer";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getArtworkFiles,
  getArtworkFilesMap,
  SerializedFile,
} from "@/utils/storage";

export const ReviewItems = () => {
  const router = useRouter();
  const {
    details: { items },
    increaseQuantity,
    decreaseQuantity,
  } = useCheckout((state) => state);
  const { setIsEditingProduct } = useEditCheckoutItem((state) => state);
  const [openArtworks, setOpenArtworks] = useState<Record<string, boolean>>({});
  const [artworkData, setArtworkData] = useState<
    Record<
      string,
      {
        artworkFiles?: SerializedFile[];
        artworkFilesMap?: Record<string, SerializedFile[]>;
      }
    >
  >({});
  const [isLoadingArtwork, setIsLoadingArtwork] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    // Load artwork data for items that have them
    const loadArtworkData = async () => {
      const newArtworkData: Record<
        string,
        {
          artworkFiles?: SerializedFile[];
          artworkFilesMap?: Record<string, SerializedFile[]>;
        }
      > = {};

      // Set loading state for all items that have artwork
      const loadingState: Record<string, boolean> = {};
      items.forEach((item) => {
        if (item.hasArtworkFiles || item.hasArtworkFilesMap) {
          loadingState[item.id] = true;
        }
      });
      setIsLoadingArtwork(loadingState);

      await Promise.all(
        items.map(async (item) => {
          // Initialize the item's artwork data object
          newArtworkData[item.id] = {};

          if (item.hasArtworkFiles) {
            try {
              const files = await getArtworkFiles(item.id);
              if (files && files.length > 0) {
                // Convert files to match FileWithPath interface
                const convertedFiles = files.map((file) => ({
                  ...file,
                  lastModified: new Date().getTime(),
                  lastModifiedDate: new Date(),
                  webkitRelativePath: "",
                }));
                newArtworkData[item.id].artworkFiles = convertedFiles;
              }
            } catch (error) {
              console.error("Error loading artwork files:", error);
            }
          }

          if (item.hasArtworkFilesMap) {
            try {
              const filesMap = await getArtworkFilesMap(
                item.id,
                item.artworkLabels || []
              );
              if (filesMap && Object.keys(filesMap).length > 0) {
                // Convert files in the map
                const convertedMap = Object.fromEntries(
                  Object.entries(filesMap).map(([label, files]) => [
                    label,
                    files.map((file) => ({
                      ...file,
                      lastModified: new Date().getTime(),
                      lastModifiedDate: new Date(),
                      webkitRelativePath: "",
                    })),
                  ])
                );
                newArtworkData[item.id].artworkFilesMap = convertedMap;
              }
            } catch (error) {
              console.error("Error loading artwork files map:", error);
            }
          }

          // After processing each item, remove its loading state
          setIsLoadingArtwork((prev) => ({
            ...prev,
            [item.id]: false,
          }));
        })
      );

      setArtworkData(newArtworkData);
    };

    if (items.some((item) => item.hasArtworkFiles || item.hasArtworkFilesMap)) {
      loadArtworkData();
    }
  }, [items]);

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

  const getArtworkFilesForRenderer = (
    files: SerializedFile[] | undefined
  ): SerializedFile[] => {
    return files || [];
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
                    (item.hasArtworkFiles || item.hasArtworkFilesMap) && (
                      <Text fz="xs" c="dimmed">
                        Artworks:{" "}
                        {artworkData[item.id]?.artworkFiles?.length ||
                          (artworkData[item.id]?.artworkFilesMap
                            ? Object.values(
                                artworkData[item.id]?.artworkFilesMap || {}
                              ).reduce((acc, files) => acc + files.length, 0)
                            : 0)}
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

          {item.isCustomizable && (
            <>
              {!isLoadingArtwork[item.id] && (
                <UnstyledButton
                  onClick={() => toggleArtworks(item.id)}
                  mt="md"
                  style={{ width: "100%" }}
                >
                  <Group justify="space-between">
                    <Text size="xs" c="pink">
                      {openArtworks[item.id] ? "Hide" : "View"} Artwork Files
                      {` (${
                        artworkData[item.id]?.artworkFiles?.length ||
                        (artworkData[item.id]?.artworkFilesMap
                          ? Object.values(
                              artworkData[item.id]?.artworkFilesMap || {}
                            ).reduce((acc, files) => acc + files.length, 0)
                          : 0)
                      })`}
                    </Text>
                    {openArtworks[item.id] ? (
                      <IconChevronUp size={16} />
                    ) : (
                      <IconChevronDown size={16} />
                    )}
                  </Group>
                </UnstyledButton>
              )}

              <Collapse in={openArtworks[item.id]}>
                <Box mt="xs">
                  {isLoadingArtwork[item.id] ? (
                    <Skeleton height={100} radius="sm" />
                  ) : artworkData[item.id]?.artworkFilesMap ? (
                    <Group>
                      {Object.entries(
                        artworkData[item.id].artworkFilesMap || {}
                      ).map(([label, files]) => {
                        const rendererFiles = getArtworkFilesForRenderer(files);
                        return (
                          <Box key={label} mb="md">
                            <ReceivedFilesRenderer
                              files={rendererFiles}
                              title={`${label} (${rendererFiles.length})`}
                              requireOneFile={true}
                            />
                          </Box>
                        );
                      })}
                    </Group>
                  ) : artworkData[item.id]?.artworkFiles ? (
                    <ReceivedFilesRenderer
                      files={getArtworkFilesForRenderer(
                        artworkData[item.id].artworkFiles
                      )}
                      title={`Artwork Files (${artworkData[item.id].artworkFiles?.length || 0})`}
                      requireOneFile={true}
                    />
                  ) : null}
                </Box>
              </Collapse>
            </>
          )}
        </Card>
      ))}
    </Card>
  );
};
