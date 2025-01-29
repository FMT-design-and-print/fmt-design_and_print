import { useState } from "react";
import {
  Table,
  TextInput,
  NumberInput,
  Button,
  Group,
  ActionIcon,
  Paper,
  Title,
  Box,
  Text,
  Stack,
} from "@mantine/core";
import {
  IconTrash,
  IconEdit,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { IQuoteItem } from "@/types/quote";
import { CURRENCY_SYMBOL } from "@/features/admin/PriceCalculator/constants";

interface QuoteItemsProps {
  type: "quote" | "invoice";
  items: IQuoteItem[];
  onChange: (items: IQuoteItem[]) => void;
  paymentPercentage: number;
  onInitialPaymentChange: (value: number) => void;
}

export function QuoteItems({
  type,
  items,
  onChange,
  paymentPercentage,
  onInitialPaymentChange,
}: QuoteItemsProps) {
  const [newItem, setNewItem] = useState<Partial<IQuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(items.length === 0);

  const handleAddItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.unitPrice) {
      return;
    }

    const item: IQuoteItem = {
      id: crypto.randomUUID(),
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalAmount: newItem.quantity * newItem.unitPrice,
    };

    onChange([...items, item]);
    setNewItem({ description: "", quantity: 1, unitPrice: 0 });

    // Only hide the form if we have items
    if (items.length > 0) {
      setShowAddForm(false);
    }
  };

  const handleCancel = () => {
    // Only allow canceling if we have items
    if (items.length > 0) {
      setShowAddForm(false);
      setNewItem({ description: "", quantity: 1, unitPrice: 0 });
    }
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    onChange(updatedItems);
    // Show form if we removed the last item
    if (updatedItems.length === 0) {
      setShowAddForm(true);
    }
  };

  const handleQuantityChange = (value: number | string | undefined) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value || 0;
    setNewItem({ ...newItem, quantity: numValue });
  };

  const handleUnitPriceChange = (value: number | string | undefined) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value || 0;
    setNewItem({ ...newItem, unitPrice: numValue });
  };

  const handleEditItem = (id: string, updates: Partial<IQuoteItem>) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              totalAmount:
                (updates.quantity || item.quantity) *
                (updates.unitPrice || item.unitPrice),
            }
          : item
      )
    );
  };

  const handleEditQuantity = (
    id: string,
    value: number | string | undefined
  ) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value || 0;
    handleEditItem(id, { quantity: numValue });
  };

  const handleEditUnitPrice = (
    id: string,
    value: number | string | undefined
  ) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value || 0;
    handleEditItem(id, { unitPrice: numValue });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleConfirmEdit = () => {
    setEditingItem(null);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        {type === "quote" ? "Quote" : "Invoice"} Items
      </Title>

      {items.length > 0 && (
        <>
          <Table mb="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Description</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Unit Price</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    {editingItem === item.id ? (
                      <TextInput
                        value={item.description}
                        onChange={(e) =>
                          handleEditItem(item.id, {
                            description: e.currentTarget.value,
                          })
                        }
                      />
                    ) : (
                      item.description
                    )}
                  </Table.Td>
                  <Table.Td>
                    {editingItem === item.id ? (
                      <NumberInput
                        value={item.quantity}
                        onChange={(value) => handleEditQuantity(item.id, value)}
                        min={1}
                        hideControls
                      />
                    ) : (
                      item.quantity
                    )}
                  </Table.Td>
                  <Table.Td>
                    {editingItem === item.id ? (
                      <NumberInput
                        value={item.unitPrice}
                        onChange={(value) =>
                          handleEditUnitPrice(item.id, value)
                        }
                        min={0}
                        decimalScale={2}
                        prefix={CURRENCY_SYMBOL}
                        hideControls
                      />
                    ) : (
                      `${CURRENCY_SYMBOL}${item.unitPrice.toFixed(2)}`
                    )}
                  </Table.Td>
                  <Table.Td>
                    {CURRENCY_SYMBOL}
                    {item.totalAmount.toFixed(2)}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {editingItem === item.id ? (
                        <>
                          <ActionIcon
                            color="green"
                            variant="subtle"
                            onClick={() => handleConfirmEdit()}
                          >
                            <IconCheck size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => handleCancelEdit()}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </>
                      ) : (
                        <>
                          <ActionIcon
                            color="pink"
                            variant="subtle"
                            onClick={() => setEditingItem(item.id)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group
            justify="flex-end"
            mb="sm"
            p="sm"
            bg="var(--mantine-color-gray-0)"
          >
            <Stack gap="xs">
              <Group>
                <Text fw={500} size="md">
                  Total Amount: {CURRENCY_SYMBOL}
                  {calculateTotal().toFixed(2)}
                </Text>
              </Group>
              <Group>
                <Text size="sm" c="dimmed">
                  Initial Payment:
                </Text>
                <Group gap="xs">
                  <NumberInput
                    value={paymentPercentage ?? 100}
                    onChange={(value) =>
                      onInitialPaymentChange(Number(value) || 100)
                    }
                    min={0}
                    max={100}
                    w={100}
                    hideControls
                    rightSection={<Text size="sm">%</Text>}
                  />
                  <Text size="sm" c="dimmed">
                    ({CURRENCY_SYMBOL}
                    {(
                      (calculateTotal() * (paymentPercentage ?? 100)) /
                      100
                    ).toFixed(2)}
                    )
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Group>

          {!showAddForm && (
            <Button
              fullWidth
              variant="outline"
              color="gray"
              leftSection={<IconPlus size={16} />}
              onClick={() => setShowAddForm(true)}
              styles={{
                root: {
                  borderStyle: "dashed",
                  height: "60px",
                  backgroundColor: "var(--mantine-color-gray-0)",
                  "&:hover": {
                    backgroundColor: "var(--mantine-color-gray-1)",
                  },
                },
                inner: {
                  fontSize: "var(--mantine-font-size-sm)",
                  fontWeight: 500,
                },
              }}
            >
              Add New {type === "quote" ? "Quote" : "Invoice"} Item
            </Button>
          )}
        </>
      )}

      {showAddForm && (
        <Box mt="md">
          <Title order={5} mb="md">
            {items.length === 0 ? "Add Your First Item" : "Add New Item"}
          </Title>
          <Group align="flex-end">
            <TextInput
              label="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.currentTarget.value })
              }
              style={{ flex: 2 }}
            />
            <NumberInput
              label="Quantity"
              value={newItem.quantity}
              onChange={handleQuantityChange}
              min={1}
              style={{ flex: 1 }}
              hideControls
            />
            <NumberInput
              label="Unit Price"
              value={newItem.unitPrice}
              onChange={handleUnitPriceChange}
              min={0}
              decimalScale={2}
              prefix={CURRENCY_SYMBOL}
              style={{ flex: 1 }}
              hideControls
            />
            <Group>
              <Button color="pink" onClick={handleAddItem}>
                Add Item
              </Button>
              {items.length > 0 && (
                <Button variant="subtle" color="gray" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </Group>
          </Group>
        </Box>
      )}
    </Paper>
  );
}
