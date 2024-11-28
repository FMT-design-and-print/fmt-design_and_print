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
  OthersSettings as OthersSettingsType,
  OtherCategory,
  OtherItem,
} from "../../types";
import { toast } from "react-toastify";
import { EditableItem } from "../EditableItem";

type EditState = {
  categories: Record<string, OtherCategory | null>;
  items: Record<string, OtherItem | null>;
};

export function OthersSettings() {
  const { data: settings } = useCalculatorSettings();
  const { mutate: updateSettings } = useSettingsUpdater();
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState<Partial<OtherItem>>({});
  const [editStates, setEditStates] = useState<EditState>({
    categories: {},
    items: {},
  });

  const othersSettings = settings?.find((s) => s.id === "others");
  const categories = useMemo(
    () => (othersSettings?.options as OthersSettingsType)?.categories || [],
    [othersSettings?.options]
  );

  const handleUpdateCategories = (updatedCategories: OtherCategory[]) => {
    if (!othersSettings) return;

    updateSettings({
      ...othersSettings,
      options: {
        ...(othersSettings.options as OthersSettingsType),
        categories: updatedCategories,
      },
    });
  };

  // Category Handlers
  const handleEditCategory = useCallback(
    (id: string, updates: Partial<OtherCategory>) => {
      const currentCategory = categories.find((cat) => cat.id === id);
      if (!currentCategory) return;

      setEditStates((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [id]: { ...currentCategory, ...updates },
        },
      }));
    },
    [categories]
  );

  const handleSaveCategory = (id: string) => {
    const updates = editStates.categories[id];
    if (!updates) return;

    handleUpdateCategories(
      categories.map((cat) => (cat.id === id ? updates : cat))
    );
    setEditStates((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [id]: null,
      },
    }));
    toast.success("Category updated successfully");
  };

  const handleDiscardCategory = (id: string) => {
    setEditStates((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [id]: null,
      },
    }));
    toast.info("Changes discarded");
  };

  // Item Handlers
  const handleEditItem = useCallback(
    (categoryId: string, itemId: string, updates: Partial<OtherItem>) => {
      const category = categories.find((cat) => cat.id === categoryId);
      const currentItem = category?.items.find((item) => item.id === itemId);
      if (!currentItem) return;

      setEditStates((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          [itemId]: { ...currentItem, ...updates },
        },
      }));
    },
    [categories]
  );

  const handleSaveItem = (categoryId: string, itemId: string) => {
    const updates = editStates.items[itemId];
    if (!updates) return;

    handleUpdateCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? updates : item
              ),
            }
          : cat
      )
    );
    setEditStates((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: null,
      },
    }));
    toast.success("Item updated successfully");
  };

  const handleDiscardItem = (itemId: string) => {
    setEditStates((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: null,
      },
    }));
    toast.info("Changes discarded");
  };

  const handleAddCategory = () => {
    if (!newCategory) return;

    const newCat: OtherCategory = {
      id: newCategory.toLowerCase().replace(/\s+/g, "-"),
      name: newCategory,
      items: [],
    };

    handleUpdateCategories([...categories, newCat]);
    setNewCategory("");
    toast.success(`Category "${newCategory}" added successfully`);
  };

  const handleRemoveCategory = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    handleUpdateCategories(categories.filter((cat) => cat.id !== id));
    toast.success(`Category "${category?.name}" removed successfully`);
  };

  const handleRemoveItem = (categoryId: string, itemId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const item = category?.items.find((item) => item.id === itemId);

    handleUpdateCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      )
    );

    toast.success(`Item "${item?.name}" removed successfully`);
  };

  return (
    <Stack gap="lg" mt="md">
      <Card withBorder>
        <Stack gap="md">
          <Text fw={500}>Add New Category</Text>
          <Group>
            <TextInput
              label="Category Name"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              onClick={handleAddCategory}
              style={{ alignSelf: "flex-end" }}
              color="pink"
            >
              Add Category
            </Button>
          </Group>
        </Stack>
      </Card>

      <Stack gap="md">
        {categories.map((category) => {
          const editState = editStates.categories[category.id];
          const currentValue = editState || category;

          return (
            <Card key={category.id} withBorder>
              <Stack gap="md">
                <EditableItem
                  initialValue={category}
                  currentValue={currentValue}
                  onSave={() => handleSaveCategory(category.id)}
                  onDiscard={() => handleDiscardCategory(category.id)}
                >
                  <Group justify="space-between" style={{ flex: 1 }}>
                    <TextInput
                      key={`name-${category.id}`}
                      label="Name"
                      value={currentValue.name}
                      onChange={(e) =>
                        handleEditCategory(category.id, {
                          name: e.target.value,
                        })
                      }
                      style={{ flex: 1 }}
                    />
                    <ActionIcon
                      key={`delete-${category.id}`}
                      color="red"
                      variant="light"
                      onClick={() => handleRemoveCategory(category.id)}
                      size="lg"
                      style={{ alignSelf: "flex-end" }}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Group>
                </EditableItem>

                <Card withBorder>
                  <Stack gap="md">
                    <Text fw={500}>Add New Item to {category.name}</Text>
                    <Group grow>
                      <TextInput
                        label="Name"
                        placeholder="Enter item name"
                        value={newItem.name || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                      />
                      <NumberInput
                        label="Price"
                        placeholder="Enter price"
                        value={newItem.price}
                        onChange={(val) =>
                          setNewItem({ ...newItem, price: Number(val) })
                        }
                        min={0}
                        decimalScale={2}
                      />
                    </Group>
                    <Button
                      onClick={() => {
                        if (!newItem.name || !newItem.price) return;

                        const newOtherItem: OtherItem = {
                          id: crypto.randomUUID(),
                          name: newItem.name,
                          price: newItem.price,
                        };

                        handleUpdateCategories(
                          categories.map((cat) =>
                            cat.id === category.id
                              ? {
                                  ...cat,
                                  items: [...cat.items, newOtherItem],
                                }
                              : cat
                          )
                        );
                        setNewItem({});
                        toast.success(
                          `Item "${newItem.name}" added to ${category.name}`
                        );
                      }}
                      variant="light"
                      color="pink"
                      radius={0}
                    >
                      Add Item
                    </Button>
                  </Stack>
                </Card>

                <Stack gap="xs">
                  {category.items.map((item) => {
                    const itemEditState = editStates.items[item.id];
                    const currentItemValue = itemEditState || item;

                    return (
                      <Card key={item.id} withBorder>
                        <EditableItem
                          initialValue={item}
                          currentValue={currentItemValue}
                          onSave={() => handleSaveItem(category.id, item.id)}
                          onDiscard={() => handleDiscardItem(item.id)}
                        >
                          <TextInput
                            key={`itemName-${item.id}`}
                            label="Name"
                            value={currentItemValue.name}
                            onChange={(e) =>
                              handleEditItem(category.id, item.id, {
                                name: e.target.value,
                              })
                            }
                            style={{ flex: 1 }}
                          />
                          <NumberInput
                            key={`price-${item.id}`}
                            label="Price"
                            value={currentItemValue.price}
                            onChange={(val) =>
                              handleEditItem(category.id, item.id, {
                                price: Number(val),
                              })
                            }
                            min={0}
                            decimalScale={2}
                            style={{ width: 150 }}
                          />
                          <ActionIcon
                            key={`delete-${item.id}`}
                            color="red"
                            variant="light"
                            onClick={() =>
                              handleRemoveItem(category.id, item.id)
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
