import { DiscountType, IProductType, PaymentMethod } from "@/types";
import { ISales, ISalesItem } from "@/types/sales-expenses";
import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Checkbox,
  TextInput,
  Card,
  Text,
  Title,
  Collapse,
  UnstyledButton,
  Grid,
  ActionIcon,
  Divider,
  Box,
} from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconUser, IconReceipt, IconCash, IconListDetails, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState, useEffect, useMemo } from "react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import { IAdminUser } from "@/types/admin";
import { isEqual } from "lodash";
import { useCustomProductTypes } from "@/hooks/admin/useCustomProductTypes";
import { useCustomProductCategories } from "@/hooks/admin/useCustomProductCategories";
import { useCustomers } from "@/hooks/admin/useCustomers";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

interface SalesFormProps {
  productTypes: IProductType[];
  onSubmit: (data: Partial<ISales>) => void;
  loading: boolean;
  adminUser: IAdminUser | null;
  initialData?: ISales;
  onCancel?: () => void;
}

export default function SalesForm({
  productTypes,
  onSubmit,
  loading,
  adminUser,
  initialData,
  onCancel,
}: SalesFormProps) {
  const { data: customTypes, createProductType } = useCustomProductTypes();
  const { data: categories } = useCustomProductCategories();
  const { data: customersList, createCustomer } = useCustomers();

  const customerOptions = useMemo(() => {
    return (customersList || []).map(c => ({
      value: c.id || "",
      label: `${c.name || "Unknown"} ${c.phone ? `(${c.phone})` : ''}`
    }));
  }, [customersList]);

  const allProductTypeOptions = useMemo(() => {
    const customGroupsMap: Record<string, any[]> = {};

    (customTypes || []).forEach((type) => {
      const cat = categories?.find(c => c.id === type?.category_id);
      const groupName = cat?.name || "Uncategorized";
      if (!customGroupsMap[groupName]) {
        customGroupsMap[groupName] = [];
      }
      customGroupsMap[groupName].push({
        value: type?.name || "Unknown",
        label: type?.name || "Unknown",
      });
    });

    const customGroups = Object.entries(customGroupsMap).map(([group, items]) => ({
      group,
      items: items.filter((v, i, a) => v.value && a.findIndex(t => t.value === v.value) === i),
    }));

    return [...customGroups].filter(g => g.items.length > 0);
  }, [productTypes, customTypes, categories]);

  // Multi-item State
  const [items, setItems] = useState<ISalesItem[]>([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(initialData?.customer_id || null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>("fixed-amount");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number | undefined>(initialData?.amountPaid);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialData?.paymentMethods || []);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [summaryOpened, setSummaryOpened] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.items && initialData.items.length > 0) {
        setItems(initialData.items.map(item => ({ ...item, id: item.id || uuidv4() })));
      } else {
        // Legacy conversion
        setItems([{
          id: uuidv4(),
          productType: initialData.productType || "",
          description: initialData.description || "",
          unitPrice: initialData.unitPrice || 0,
          quantity: initialData.quantity || 1,
          totalAmount: (initialData.unitPrice || 0) * (initialData.quantity || 1)
        }]);
      }
      setPaymentMethods(initialData.paymentMethods || []);
      setAmountPaid(initialData.amountPaid ?? initialData.totalAmount);
      setNotes(initialData.notes || "");
      if (initialData.discount) {
        setApplyDiscount(true);
        setDiscountType(initialData.discount.type);
        setDiscountValue(initialData.discount.value);
      }
    } else {
      // Default empty item
      setItems([{ id: uuidv4(), productType: "", description: "", unitPrice: 0, quantity: 1, totalAmount: 0 }]);
    }
  }, [initialData]);

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), productType: "", description: "", unitPrice: 0, quantity: 1, totalAmount: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ISalesItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.totalAmount = (updated.unitPrice || 0) * (updated.quantity || 1);
        return updated;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  };

  const calculateTotalAmount = () => {
    let total = calculateSubtotal();
    if (applyDiscount) {
      if (discountType === "percentage") {
        total -= (total * discountValue) / 100;
      } else {
        total -= discountValue;
      }
    }
    return total > 0 ? total : 0;
  };

  const calculateBalanceDue = () => {
    const total = calculateTotalAmount();
    return total - (amountPaid || 0);
  };

  const handleSubmit = async () => {
    // Validate items
    for (const item of items) {
      if (!item.productType) {
        toast.error("Please select a product type for all items.");
        return;
      }
    }

    let finalCustomerId = selectedCustomerId;

    if (selectedCustomerId === "new" && newCustomerName) {
      try {
        const newCustomer = await createCustomer({
          name: newCustomerName,
          phone: newCustomerPhone,
          createdBy: {
            userId: adminUser?.id || "",
            name: adminUser?.firstName + " " + adminUser?.lastName,
            email: adminUser?.email || "",
            role: adminUser?.role || "",
            image: adminUser?.avatar || "",
          }
        });
        finalCustomerId = newCustomer.id;
      } catch (err) {
        console.warn("Failed to auto-create customer", err);
      }
    }

    // Clean up items before saving (remove temp ids if needed, though they don't hurt)
    const itemsToSave = items.map(item => ({
      productType: item.productType,
      description: item.description || "",
      unitPrice: item.unitPrice || 0,
      quantity: item.quantity || 1,
      totalAmount: item.totalAmount || 0,
    }));

    const data: Partial<ISales> = {
      updated_at: new Date().toISOString(),
      customer_id: (finalCustomerId !== "new" && finalCustomerId) ? finalCustomerId : undefined,
      items: itemsToSave,
      discount: applyDiscount
        ? { type: discountType, value: discountValue }
        : undefined,
      totalAmount: calculateTotalAmount(),
      amountPaid: amountPaid || 0,
      balanceDue: calculateBalanceDue(),
      paymentMethods,
      notes,
      // For backward compatibility on legacy screens, store the first item's details at root
      productType: itemsToSave[0].productType,
      description: itemsToSave.length > 1 ? `Multiple Items (${itemsToSave.length})` : itemsToSave[0].description,
      unitPrice: itemsToSave[0].unitPrice,
      quantity: itemsToSave[0].quantity,
    };

    if (!initialData) {
      data.createdBy = {
        userId: adminUser?.id || "",
        name: adminUser?.firstName + " " + adminUser?.lastName,
        email: adminUser?.email || "",
        role: adminUser?.role || "",
        image: adminUser?.avatar || "",
      };
    } else {
      data.id = initialData.id;
      data.updatedBy = {
        userId: adminUser?.id || "",
        name: adminUser?.firstName + " " + adminUser?.lastName,
        email: adminUser?.email || "",
        role: adminUser?.role || "",
        image: adminUser?.avatar || "",
      };
    }

    onSubmit(data);
  };

  const hasChanges = () => {
    if (!initialData) return true;
    return true; // We always allow save on edit view to bypass the broken getChangedSalesFields logic
  };

  return (
    <Stack gap="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="lg">
            <Card withBorder p="md" radius="md">
              <Group mb="md" justify="space-between">
                <Group>
                  <IconListDetails size="1.2rem" className="text-pink-500" />
                  <Title order={5}>Sales Items</Title>
                </Group>
                <Button variant="light" color="pink" size="xs" leftSection={<IconPlus size="0.9rem" />} onClick={handleAddItem}>
                  Add Item
                </Button>
              </Group>

              <Stack gap="lg">
                {items.map((item, index) => (
                  <Box key={item.id} p="sm" bg="gray.0" style={{ borderRadius: '8px', border: '1px solid var(--mantine-color-gray-3)' }}>
                    <Group justify="space-between" mb="sm">
                      <Text size="sm" fw={600} c="dimmed">Item {index + 1}</Text>
                      {items.length > 1 && (
                        <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveItem(item.id!)}>
                          <IconTrash size="1rem" />
                        </ActionIcon>
                      )}
                    </Group>
                    <Grid gutter="sm">
                      <Grid.Col span={12}>
                        <Select
                          label="Product Type"
                          placeholder="Select Product Type"
                          data={allProductTypeOptions}
                          value={item.productType}
                          onChange={(value) => updateItem(item.id!, "productType", value as string)}
                          required
                          searchable
                        />
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <TextInput
                          label="Description / Details"
                          placeholder="Specifics about this item..."
                          value={item.description}
                          onChange={(e) => updateItem(item.id!, "description", e.target.value)}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <NumberInput
                          label="Unit Price"
                          required
                          value={item.unitPrice}
                          onChange={(value) => updateItem(item.id!, "unitPrice", value as number)}
                          min={0}
                          prefix={`${CURRENCY_SYMBOL} `}
                          thousandSeparator=","
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <NumberInput
                          label="Quantity"
                          required
                          value={item.quantity}
                          onChange={(value) => updateItem(item.id!, "quantity", value as number)}
                          min={1}
                        />
                      </Grid.Col>
                    </Grid>
                    <Group justify="flex-end" mt="sm">
                      <Text size="sm" fw={600}>Subtotal: {CURRENCY_SYMBOL} {(item.totalAmount || 0).toLocaleString()}</Text>
                    </Group>
                  </Box>
                ))}
              </Stack>
            </Card>

            <Card withBorder p="md" radius="md">
              <Group mb="md">
                <IconUser size="1.2rem" className="text-pink-500" />
                <Title order={5}>Customer Details (Optional)</Title>
              </Group>
              <Select
                label="Select Customer"
                placeholder="Search or add customer"
                data={[
                  ...customerOptions,
                  { value: "new", label: "+ Add New Customer" },
                ]}
                value={selectedCustomerId}
                onChange={(value) => setSelectedCustomerId(value || null)}
                searchable
                clearable
                nothingFoundMessage="No customers found"
              />
              {selectedCustomerId === "new" && (
                <Group mt="md" grow>
                  <TextInput
                    label="Customer Name"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                  />
                  <TextInput
                    label="Phone Number"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                </Group>
              )}
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="lg">
            <Card withBorder p="md" radius="md">
              <Group mb="md">
                <IconCash size="1.2rem" className="text-pink-500" />
                <Title order={5}>Pricing & Payment</Title>
              </Group>

              <Stack gap="md">
                <Group justify="space-between">
                  <Text fw={500}>Items Subtotal</Text>
                  <Text fw={600}>{CURRENCY_SYMBOL} {calculateSubtotal().toLocaleString()}</Text>
                </Group>

                <Divider />

                <Checkbox
                  label="Apply Discount"
                  checked={applyDiscount}
                  onChange={(event) => setApplyDiscount(event.currentTarget.checked)}
                  color="pink"
                />

                {applyDiscount && (
                  <Group grow>
                    <Select
                      label="Discount Type"
                      placeholder="Select Discount Type"
                      data={[
                        { value: "percentage", label: "Percentage" },
                        { value: "fixed-amount", label: "Fixed Amount" },
                      ]}
                      value={discountType}
                      onChange={(value) => setDiscountType(value as DiscountType)}
                    />
                    <NumberInput
                      label="Discount Value"
                      value={discountValue}
                      onChange={(value) => setDiscountValue(value as number)}
                      min={0}
                    />
                  </Group>
                )}

                <Group grow>
                  <NumberInput
                    label="Final Total Amount"
                    value={calculateTotalAmount()}
                    readOnly
                    prefix={`${CURRENCY_SYMBOL} `}
                    thousandSeparator=","
                    disabled
                    styles={{ input: { fontWeight: 700, color: 'var(--mantine-color-red-6)' } }}
                  />
                  <NumberInput
                    label="Actual Amount Paid"
                    required
                    value={amountPaid}
                    onChange={(value) => setAmountPaid(value as number)}
                    min={0}
                    max={calculateTotalAmount()}
                    prefix={`${CURRENCY_SYMBOL} `}
                    thousandSeparator=","
                  />
                </Group>

                {calculateBalanceDue() > 0 && (
                  <Text c="red" size="sm" fw={600} ta="right">
                    Balance Due / Arrears: {CURRENCY_SYMBOL} {calculateBalanceDue().toLocaleString()}
                  </Text>
                )}

                <Checkbox.Group
                  label="Payment Method"
                  value={paymentMethods}
                  onChange={(value) => setPaymentMethods(value as PaymentMethod[])}
                >
                  <Group mt="xs">
                    <Checkbox value="Cash" label="Cash" color="pink" />
                    <Checkbox value="Mobile Money" label="Mobile Money" color="pink" />
                    <Checkbox value="Credit Card" label="Credit Card" color="pink" />
                    <Checkbox value="Bank Transfer" label="Bank Transfer" color="pink" />
                  </Group>
                </Checkbox.Group>

                <TextInput
                  label="Payment Notes"
                  placeholder="e.g. Paid in full via momo, pending pickup..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Stack>
            </Card>

            <Group justify="flex-end" mt="md">
              <Button variant="light" color="gray" onClick={onCancel} size="md">
                Cancel
              </Button>
              <Button
                color="pink"
                onClick={handleSubmit}
                loading={loading}
                disabled={!adminUser || (initialData && !hasChanges())}
                size="md"
              >
                {initialData ? "Update Sale" : "Save Sale"}
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
