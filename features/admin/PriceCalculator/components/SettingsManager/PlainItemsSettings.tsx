import {
  ActionIcon,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState, useCallback, useMemo } from "react";
import { useCalculatorSettings } from "../../hooks/useCalculatorSettings";
import { useSettingsUpdater } from "../../hooks/useSettingsUpdater";
import {
  PlainItemsSettings as PlainItemsSettingsType,
  PlainItem,
} from "../../types";
import { toast } from "react-toastify";
import { EditableItem } from "../EditableItem";

export function PlainItemsSettings() {
  const { data: settings } = useCalculatorSettings();
  const { mutate: updateSettings } = useSettingsUpdater();
  const [newItem, setNewItem] = useState<Partial<PlainItem>>({});
  const [editStates, setEditStates] = useState<Record<string, PlainItem>>({});

  const plainSettings = settings?.find((s) => s.id === "plain-items");
  const items = useMemo(
    () => (plainSettings?.options as PlainItemsSettingsType)?.items || [],
    [plainSettings?.options]
  );

  const handleUpdate = (updatedItems: PlainItem[]) => {
    if (!plainSettings) return;

    updateSettings({
      ...plainSettings,
      options: {
        ...(plainSettings.options as PlainItemsSettingsType),
        items: updatedItems,
      },
    });
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) return;

    const newPlainItem: PlainItem = {
      id: crypto.randomUUID(),
      name: newItem.name,
      price: newItem.price,
    };

    handleUpdate([...items, newPlainItem]);
    setNewItem({});
    toast.success(`Item "${newItem.name}" added successfully`);
  };

  const handleRemove = (id: string) => {
    const item = items.find((item) => item.id === id);
    handleUpdate(items.filter((item: PlainItem) => item.id !== id));
    toast.success(`Item "${item?.name}" removed successfully`);
  };

  const handleEdit = useCallback(
    (id: string, updates: Partial<PlainItem>) => {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;

      setEditStates((prev) => ({
        ...prev,
        [id]: { ...currentItem, ...updates },
      }));
    },
    [items]
  );

  const handleSaveEdit = (id: string) => {
    const updates = editStates[id];
    if (!updates) return;

    handleUpdate(items.map((item) => (item.id === id ? updates : item)));
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    toast.success("Item updated successfully");
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
          <Text fw={500}>Add New Plain Item</Text>
          <Group grow>
            <TextInput
              label="Name"
              placeholder="Enter item name"
              value={newItem.name || ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <NumberInput
              label="Price"
              placeholder="Enter price"
              value={newItem.price}
              onChange={(val) => setNewItem({ ...newItem, price: Number(val) })}
              min={0}
              decimalScale={2}
            />
          </Group>
          <Button onClick={handleAdd} variant="light" color="pink" radius={0}>
            Add Item
          </Button>
        </Stack>
      </Card>

      <Stack gap="md">
        {items.map((item: PlainItem) => {
          const editState = editStates[item.id];
          const currentValue = editState || item;

          return (
            <Card key={item.id} withBorder>
              <EditableItem
                initialValue={item}
                currentValue={currentValue}
                onSave={() => handleSaveEdit(item.id)}
                onDiscard={() => handleDiscardEdit(item.id)}
              >
                <TextInput
                  key={`name-${item.id}`}
                  label="Name"
                  value={currentValue.name}
                  onChange={(e) =>
                    handleEdit(item.id, { name: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
                <NumberInput
                  key={`price-${item.id}`}
                  label="Price"
                  value={currentValue.price}
                  onChange={(val) =>
                    handleEdit(item.id, { price: Number(val) })
                  }
                  min={0}
                  decimalScale={2}
                  style={{ width: 150 }}
                />
                <ActionIcon
                  key={`delete-${item.id}`}
                  color="red"
                  variant="light"
                  onClick={() => handleRemove(item.id)}
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
