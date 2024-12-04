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
} from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { IQuoteItem } from "@/types/quote";
import { CURRENCY_SYMBOL } from "@/features/admin/PriceCalculator/constants";

interface QuoteItemsProps {
  type: "quote" | "invoice";
  items: IQuoteItem[];
  onChange: (items: IQuoteItem[]) => void;
}

export function QuoteItems({ type, items, onChange }: QuoteItemsProps) {
  const [newItem, setNewItem] = useState<Partial<IQuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);

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
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
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

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">
        {type === "quote" ? "Quote" : "Invoice"} Items
      </Title>

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
                    onChange={(value) => handleEditUnitPrice(item.id, value)}
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
                  <ActionIcon
                    color="pink"
                    variant="subtle"
                    onClick={() =>
                      setEditingItem(editingItem === item.id ? null : item.id)
                    }
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
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

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
        <Button color="pink" onClick={handleAddItem}>
          Add Item
        </Button>
      </Group>
    </Paper>
  );
}
