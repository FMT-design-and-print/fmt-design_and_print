import {
  ActionIcon,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState, useCallback, useMemo } from "react";
import { useCalculatorSettings } from "../../hooks/useCalculatorSettings";
import { useSettingsUpdater } from "../../hooks/useSettingsUpdater";
import {
  FramingSettings as FramingSettingsType,
  FrameType,
  FrameSize,
} from "../../types";
import { toast } from "react-toastify";
import { EditableItem } from "../EditableItem";

type EditState = {
  frameTypes: Record<string, FrameType | null>;
  sizes: Record<string, FrameSize | null>;
};

export function FramingSettings() {
  const { data: settings } = useCalculatorSettings();
  const { mutate: updateSettings } = useSettingsUpdater();
  const [newFrameType, setNewFrameType] = useState<Partial<FrameType>>({});
  const [newSize, setNewSize] = useState<Partial<FrameSize>>({});
  const [selectedFrameType, setSelectedFrameType] = useState<string | null>(
    null
  );
  const [editStates, setEditStates] = useState<EditState>({
    frameTypes: {},
    sizes: {},
  });

  const framingSettings = settings?.find((s) => s.id === "framing");
  const frameTypes = useMemo(
    () => (framingSettings?.options as FramingSettingsType)?.frameTypes || [],
    [framingSettings?.options]
  );

  const handleUpdateFrameTypes = (updatedFrameTypes: FrameType[]) => {
    if (!framingSettings) return;

    updateSettings({
      ...framingSettings,
      options: {
        ...(framingSettings.options as FramingSettingsType),
        frameTypes: updatedFrameTypes,
      },
    });
  };

  // Frame Type Handlers
  const handleEditFrameType = useCallback(
    (id: string, updates: Partial<FrameType>) => {
      const currentType = frameTypes.find((type) => type.id === id);
      if (!currentType) return;

      setEditStates((prev) => ({
        ...prev,
        frameTypes: {
          ...prev.frameTypes,
          [id]: { ...currentType, ...updates },
        },
      }));
    },
    [frameTypes]
  );

  const handleSaveFrameType = (id: string) => {
    const updates = editStates.frameTypes[id];
    if (!updates) return;

    handleUpdateFrameTypes(
      frameTypes.map((type) => (type.id === id ? updates : type))
    );
    setEditStates((prev) => ({
      ...prev,
      frameTypes: {
        ...prev.frameTypes,
        [id]: null,
      },
    }));
    toast.success("Frame type updated successfully");
  };

  const handleDiscardFrameType = (id: string) => {
    setEditStates((prev) => ({
      ...prev,
      frameTypes: {
        ...prev.frameTypes,
        [id]: null,
      },
    }));
    toast.info("Changes discarded");
  };

  // Size Handlers
  const handleEditSize = useCallback(
    (frameTypeId: string, sizeId: string, updates: Partial<FrameSize>) => {
      const frameType = frameTypes.find((type) => type.id === frameTypeId);
      const currentSize = frameType?.sizes.find((size) => size.id === sizeId);
      if (!currentSize) return;

      setEditStates((prev) => ({
        ...prev,
        sizes: {
          ...prev.sizes,
          [sizeId]: { ...currentSize, ...updates },
        },
      }));
    },
    [frameTypes]
  );

  const handleSaveSize = (frameTypeId: string, sizeId: string) => {
    const updates = editStates.sizes[sizeId];
    if (!updates) return;

    handleUpdateFrameTypes(
      frameTypes.map((type) =>
        type.id === frameTypeId
          ? {
              ...type,
              sizes: type.sizes.map((size) =>
                size.id === sizeId ? updates : size
              ),
            }
          : type
      )
    );
    setEditStates((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [sizeId]: null,
      },
    }));
    toast.success("Size updated successfully");
  };

  const handleDiscardSize = (sizeId: string) => {
    setEditStates((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [sizeId]: null,
      },
    }));
    toast.info("Changes discarded");
  };

  const handleAddFrameType = () => {
    if (!newFrameType.name) return;

    const newType: FrameType = {
      id: crypto.randomUUID(),
      name: newFrameType.name,
      sizes: [],
    };

    handleUpdateFrameTypes([...frameTypes, newType]);
    setNewFrameType({});
    toast.success(`Frame type "${newFrameType.name}" added successfully`);
  };

  const handleRemoveFrameType = (id: string) => {
    const frameType = frameTypes.find((type) => type.id === id);
    handleUpdateFrameTypes(frameTypes.filter((type) => type.id !== id));
    if (selectedFrameType === id) {
      setSelectedFrameType(null);
    }
    toast.success(`Frame type "${frameType?.name}" removed successfully`);
  };

  const handleAddSize = () => {
    if (
      !selectedFrameType ||
      !newSize.name ||
      !newSize.width ||
      !newSize.height ||
      !newSize.price ||
      !newSize.unit
    )
      return;

    const frameType = frameTypes.find((type) => type.id === selectedFrameType);
    if (!frameType) return;

    const newFrameSize: FrameSize = {
      id: crypto.randomUUID(),
      ...(newSize as Omit<FrameSize, "id">),
    };

    handleUpdateFrameTypes(
      frameTypes.map((type) =>
        type.id === selectedFrameType
          ? { ...type, sizes: [...type.sizes, newFrameSize] }
          : type
      )
    );
    setNewSize({});
    toast.success(`Size "${newSize.name}" added to ${frameType.name}`);
  };

  const handleRemoveSize = (frameTypeId: string, sizeId: string) => {
    const frameType = frameTypes.find((type) => type.id === frameTypeId);
    const size = frameType?.sizes.find((size) => size.id === sizeId);

    handleUpdateFrameTypes(
      frameTypes.map((type) =>
        type.id === frameTypeId
          ? { ...type, sizes: type.sizes.filter((size) => size.id !== sizeId) }
          : type
      )
    );

    toast.success(`Size "${size?.name}" removed from ${frameType?.name}`);
  };

  const selectedFrame = frameTypes.find(
    (type) => type.id === selectedFrameType
  );

  return (
    <Stack gap="lg" mt="md">
      <Card withBorder>
        <Stack gap="md">
          <Text fw={500}>Add New Frame Type</Text>
          <Group>
            <TextInput
              label="Name"
              placeholder="Enter frame type name"
              value={newFrameType.name || ""}
              onChange={(e) => setNewFrameType({ name: e.target.value })}
              style={{ flex: 1 }}
            />
            <Button
              onClick={handleAddFrameType}
              style={{ alignSelf: "flex-end" }}
              color="pink"
            >
              Add Frame Type
            </Button>
          </Group>
        </Stack>
      </Card>

      <Select
        label="Select Frame Type to Add Sizes"
        placeholder="Choose a frame type"
        value={selectedFrameType}
        onChange={setSelectedFrameType}
        data={frameTypes.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
      />

      {selectedFrameType && (
        <Card withBorder>
          <Stack gap="md">
            <Text fw={500}>Add New Size for {selectedFrame?.name}</Text>
            <Group grow>
              <TextInput
                label="Name"
                placeholder="e.g., A4, 20x30"
                value={newSize.name || ""}
                onChange={(e) =>
                  setNewSize({ ...newSize, name: e.target.value })
                }
              />
              <NumberInput
                label="Width"
                value={newSize.width}
                onChange={(val) =>
                  setNewSize({ ...newSize, width: Number(val) })
                }
                min={0}
                decimalScale={2}
              />
              <NumberInput
                label="Height"
                value={newSize.height}
                onChange={(val) =>
                  setNewSize({ ...newSize, height: Number(val) })
                }
                min={0}
                decimalScale={2}
              />
              <NumberInput
                label="Price"
                value={newSize.price}
                onChange={(val) =>
                  setNewSize({ ...newSize, price: Number(val) })
                }
                min={0}
                decimalScale={2}
              />
              <Select
                label="Unit"
                value={newSize.unit}
                onChange={(val) =>
                  setNewSize({
                    ...newSize,
                    unit: val as FrameSize["unit"],
                  })
                }
                data={[
                  { value: "mm", label: "Millimeters" },
                  { value: "cm", label: "Centimeters" },
                  { value: "inch", label: "Inches" },
                ]}
              />
            </Group>
            <Button onClick={handleAddSize} color="pink">
              Add Size
            </Button>
          </Stack>
        </Card>
      )}

      <Stack gap="md">
        {frameTypes.map((frameType) => {
          const editState = editStates.frameTypes[frameType.id];
          const currentFrameValue = editState || frameType;

          return (
            <Card key={frameType.id} withBorder>
              <Stack gap="md">
                <EditableItem
                  initialValue={frameType}
                  currentValue={currentFrameValue}
                  onSave={() => handleSaveFrameType(frameType.id)}
                  onDiscard={() => handleDiscardFrameType(frameType.id)}
                >
                  <Group justify="space-between" style={{ flex: 1 }}>
                    <TextInput
                      key={`name-${frameType.id}`}
                      label="Name"
                      value={currentFrameValue.name}
                      onChange={(e) =>
                        handleEditFrameType(frameType.id, {
                          name: e.target.value,
                        })
                      }
                      style={{ flex: 1 }}
                    />
                    <ActionIcon
                      key={`delete-${frameType.id}`}
                      color="red"
                      variant="light"
                      onClick={() => handleRemoveFrameType(frameType.id)}
                      size="lg"
                      style={{ alignSelf: "flex-end" }}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Group>
                </EditableItem>

                <Stack gap="xs">
                  {frameType.sizes.map((size) => {
                    const sizeEditState = editStates.sizes[size.id];
                    const currentSizeValue = sizeEditState || size;

                    return (
                      <Card key={size.id} withBorder>
                        <EditableItem
                          initialValue={size}
                          currentValue={currentSizeValue}
                          onSave={() => handleSaveSize(frameType.id, size.id)}
                          onDiscard={() => handleDiscardSize(size.id)}
                        >
                          <TextInput
                            key={`sizeName-${size.id}`}
                            label="Name"
                            value={currentSizeValue.name}
                            onChange={(e) =>
                              handleEditSize(frameType.id, size.id, {
                                name: e.target.value,
                              })
                            }
                            style={{ flex: 1 }}
                          />
                          <NumberInput
                            key={`width-${size.id}`}
                            label="Width"
                            value={currentSizeValue.width}
                            onChange={(val) =>
                              handleEditSize(frameType.id, size.id, {
                                width: Number(val),
                              })
                            }
                            min={0}
                            decimalScale={2}
                            style={{ width: 120 }}
                          />
                          <NumberInput
                            key={`height-${size.id}`}
                            label="Height"
                            value={currentSizeValue.height}
                            onChange={(val) =>
                              handleEditSize(frameType.id, size.id, {
                                height: Number(val),
                              })
                            }
                            min={0}
                            decimalScale={2}
                            style={{ width: 120 }}
                          />
                          <NumberInput
                            key={`price-${size.id}`}
                            label="Price"
                            value={currentSizeValue.price}
                            onChange={(val) =>
                              handleEditSize(frameType.id, size.id, {
                                price: Number(val),
                              })
                            }
                            min={0}
                            decimalScale={2}
                            style={{ width: 120 }}
                          />
                          <Select
                            key={`unit-${size.id}`}
                            label="Unit"
                            value={currentSizeValue.unit}
                            onChange={(val) =>
                              handleEditSize(frameType.id, size.id, {
                                unit: val as FrameSize["unit"],
                              })
                            }
                            data={[
                              { value: "mm", label: "Millimeters" },
                              { value: "cm", label: "Centimeters" },
                              { value: "inch", label: "Inches" },
                            ]}
                            style={{ width: 150 }}
                          />
                          <ActionIcon
                            key={`delete-${size.id}`}
                            color="red"
                            variant="light"
                            onClick={() =>
                              handleRemoveSize(frameType.id, size.id)
                            }
                            size="lg"
                            style={{ alignSelf: "flex-end" }}
                          >
                            <IconTrash size={20} />
                          </ActionIcon>
                        </EditableItem>
                      </Card>
                    );
                  })}
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}
