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
  BannersStickersSettings as BannersStickersSettingsType,
  PrintType,
} from "../../types";
import { toast } from "react-toastify";
import { EditableItem } from "../EditableItem";

export function BannersStickersSettings() {
  const { data: settings } = useCalculatorSettings();
  const { mutate: updateSettings } = useSettingsUpdater();
  const [newItem, setNewItem] = useState<Partial<PrintType>>({});
  const [editStates, setEditStates] = useState<Record<string, PrintType>>({});

  const bannersSettings = settings?.find((s) => s.id === "banners-stickers");
  const printTypes = useMemo(
    () =>
      (bannersSettings?.options as BannersStickersSettingsType)?.printTypes ||
      [],
    [bannersSettings?.options]
  );

  const handleUpdate = (updatedPrintTypes: PrintType[]) => {
    if (!bannersSettings) return;

    updateSettings({
      ...bannersSettings,
      options: {
        ...(bannersSettings.options as BannersStickersSettingsType),
        printTypes: updatedPrintTypes,
      },
    });
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.rate || !newItem.category) return;

    const newPrintType: PrintType = {
      id: crypto.randomUUID(),
      name: newItem.name,
      category: newItem.category,
      rate: newItem.rate,
    };

    handleUpdate([...printTypes, newPrintType]);
    setNewItem({});
    toast.success(`Print type "${newItem.name}" added successfully`);
  };

  const handleRemove = (id: string) => {
    const item = printTypes.find((type) => type.id === id);
    handleUpdate(printTypes.filter((type: PrintType) => type.id !== id));
    toast.success(`Print type "${item?.name}" removed successfully`);
  };

  const handleEdit = useCallback(
    (id: string, updates: Partial<PrintType>) => {
      const currentType = printTypes.find((type) => type.id === id);
      if (!currentType) return;

      setEditStates((prev) => ({
        ...prev,
        [id]: { ...currentType, ...updates },
      }));
    },
    [printTypes]
  );

  const handleSaveEdit = (id: string) => {
    const updates = editStates[id];
    if (!updates) return;

    handleUpdate(printTypes.map((type) => (type.id === id ? updates : type)));
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    toast.success("Print type updated successfully");
  };

  const handleDiscardEdit = (id: string) => {
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    toast.info("Changes discarded");
  };

  return (
    <Stack gap="lg" mt="md">
      <Card withBorder>
        <Stack gap="md">
          <Text fw={500}>Add New Print Type</Text>
          <Group grow>
            <TextInput
              label="Name"
              placeholder="Enter name"
              value={newItem.name || ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Select
              label="Category"
              placeholder="Select category"
              value={newItem.category}
              onChange={(val) =>
                setNewItem({
                  ...newItem,
                  category: val as "banner" | "sticker",
                })
              }
              data={[
                { value: "banner", label: "Banner" },
                { value: "sticker", label: "Sticker" },
              ]}
            />
            <NumberInput
              label="Rate"
              placeholder="Enter rate"
              value={newItem.rate}
              onChange={(val) => setNewItem({ ...newItem, rate: Number(val) })}
              min={0}
              decimalScale={2}
            />
          </Group>
          <Button onClick={handleAdd} variant="light" color="pink" radius={0}>
            Add Print Type
          </Button>
        </Stack>
      </Card>

      <Stack gap="md">
        {printTypes.map((type: PrintType) => {
          const editState = editStates[type.id];
          const currentValue = editState || type;

          return (
            <Card key={type.id} withBorder>
              <EditableItem
                initialValue={type}
                currentValue={currentValue}
                onSave={() => handleSaveEdit(type.id)}
                onDiscard={() => handleDiscardEdit(type.id)}
              >
                <TextInput
                  key={`name-${type.id}`}
                  label="Name"
                  value={currentValue.name}
                  onChange={(e) =>
                    handleEdit(type.id, { name: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
                <Select
                  key={`category-${type.id}`}
                  label="Category"
                  value={currentValue.category}
                  onChange={(val) =>
                    handleEdit(type.id, {
                      category: val as "banner" | "sticker",
                    })
                  }
                  data={[
                    { value: "banner", label: "Banner" },
                    { value: "sticker", label: "Sticker" },
                  ]}
                  style={{ width: 200 }}
                />
                <NumberInput
                  key={`rate-${type.id}`}
                  label="Rate"
                  value={currentValue.rate}
                  onChange={(val) => handleEdit(type.id, { rate: Number(val) })}
                  min={0}
                  decimalScale={2}
                  style={{ width: 150 }}
                />
                <ActionIcon
                  key={`delete-${type.id}`}
                  color="red"
                  variant="light"
                  onClick={() => handleRemove(type.id)}
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
  );
}
