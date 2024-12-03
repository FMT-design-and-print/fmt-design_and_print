import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import { PaymentMethod } from "@/types";
import { Receipt } from "@/types/receipts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendar, IconPlus, IconTrash } from "@tabler/icons-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useReceipts } from "./hooks/useReceipts";
import { ReceiptFormData, receiptFormSchema } from "./schema";

interface ReceiptFormProps {
  receipt?: Receipt | null;
  onSubmit: (data: Receipt) => void;
  onCancel: () => void;
}

export default function ReceiptForm({
  receipt,
  onSubmit,
  onCancel,
}: ReceiptFormProps) {
  const { adminUser } = useCurrentAdminUser();
  const { upsertReceipt } = useReceipts();

  const defaultValues: ReceiptFormData = {
    customerName: receipt?.customerName ?? "",
    customerAddress: receipt?.customerAddress ?? "",
    customerPhone: receipt?.customerPhone ?? "",
    customerEmail: receipt?.customerEmail ?? "",
    date: receipt?.date ?? new Date().toISOString().split("T")[0],
    items: receipt?.items ?? [],
    subtotal: receipt?.subtotal ?? 0,
    taxRate: receipt?.taxRate ?? 0,
    taxAmount: receipt?.taxAmount ?? 0,
    totalAmount: receipt?.totalAmount ?? 0,
    paymentMethod: receipt?.paymentMethod ?? "Cash",
    paymentStatus: receipt?.paymentStatus ?? "paid",
    notes: receipt?.notes ?? "",
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const calculateTotals = () => {
    const items = watch("items") || [];
    const taxRate = watch("taxRate");

    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    setValue("subtotal", subtotal);
    setValue("taxAmount", taxAmount);
    setValue("totalAmount", total);
  };

  const onFormSubmit = async (data: ReceiptFormData) => {
    const toastId = toast.loading(
      receipt ? "Updating receipt..." : "Creating receipt..."
    );

    try {
      const result = await upsertReceipt.mutateAsync({
        ...data,
        id: receipt?.id,
        receiptNumber: receipt?.receiptNumber ?? `RCP-${Date.now()}`,
        items: data.items.map((item) => ({
          ...item,
          id: item.id || crypto.randomUUID(),
        })),
        updated_at: new Date().toISOString(),
        created_at: receipt?.created_at ?? new Date().toISOString(),
        createdBy: {
          userId: adminUser?.id ?? "",
          name: adminUser?.firstName + " " + adminUser?.lastName,
          email: adminUser?.email ?? "",
          role: adminUser?.role ?? "",
          image: adminUser?.avatar ?? "",
        },
      });

      toast.update(toastId, {
        render: receipt
          ? "Receipt updated successfully!"
          : "Receipt created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      onSubmit(result);
    } catch (error) {
      toast.update(toastId, {
        render:
          error instanceof Error ? error.message : "Failed to save receipt",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack gap="md">
        <Group grow>
          <TextInput
            label="Customer Name"
            required
            error={errors.customerName?.message}
            {...register("customerName")}
          />
          <TextInput
            label="Customer Phone"
            error={errors.customerPhone?.message}
            {...register("customerPhone")}
          />
        </Group>

        <TextInput
          label="Customer Address"
          error={errors.customerAddress?.message}
          {...register("customerAddress")}
        />

        <TextInput
          label="Customer Email"
          type="email"
          error={errors.customerEmail?.message}
          {...register("customerEmail")}
        />

        <Group grow>
          <DateInput
            label="Date"
            required
            error={errors.date?.message}
            value={watch("date") ? new Date(watch("date")) : null}
            onChange={(value) =>
              setValue("date", value?.toISOString().split("T")[0] || "")
            }
            rightSection={<IconCalendar size={16} />}
          />
          <Select
            label="Payment Method"
            data={[
              { value: "Cash", label: "Cash" },
              { value: "Mobile Money", label: "Mobile Money" },
              { value: "Credit Card", label: "Credit Card" },
              { value: "Bank Transfer", label: "Bank Transfer" },
            ]}
            error={errors.paymentMethod?.message}
            value={watch("paymentMethod")}
            onChange={(value) =>
              setValue("paymentMethod", value as PaymentMethod)
            }
          />
          <Select
            label="Payment Status"
            data={[
              { value: "paid", label: "Paid" },
              { value: "pending", label: "Pending" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            error={errors.paymentStatus?.message}
            value={watch("paymentStatus")}
            onChange={(value) =>
              setValue(
                "paymentStatus",
                value as "paid" | "pending" | "cancelled"
              )
            }
          />
        </Group>

        <Box>
          <Table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td>
                    <TextInput
                      error={errors.items?.[index]?.description?.message}
                      {...register(`items.${index}.description`)}
                    />
                  </td>
                  <td>
                    <NumberInput
                      min={1}
                      error={errors.items?.[index]?.quantity?.message}
                      value={watch(`items.${index}.quantity`)}
                      onChange={(value) => {
                        setValue(`items.${index}.quantity`, Number(value) || 0);
                        calculateTotals();
                      }}
                    />
                  </td>
                  <td>
                    <NumberInput
                      min={0}
                      error={errors.items?.[index]?.unitPrice?.message}
                      value={watch(`items.${index}.unitPrice`)}
                      onChange={(value) => {
                        setValue(
                          `items.${index}.unitPrice`,
                          Number(value) || 0
                        );
                        calculateTotals();
                      }}
                    />
                  </td>
                  <td>
                    <Text px="10px">
                      {(
                        watch(`items.${index}.quantity`) *
                        watch(`items.${index}.unitPrice`)
                      ).toFixed(2)}
                    </Text>
                  </td>
                  <td>
                    <ActionIcon
                      color="red"
                      onClick={() => {
                        remove(index);
                        calculateTotals();
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button
            variant="subtle"
            color="pink"
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              append({
                description: "",
                quantity: 1,
                unitPrice: 0,
                total: 0,
              })
            }
            mt="sm"
          >
            Add Item
          </Button>
        </Box>

        <Group grow>
          <NumberInput
            label="Tax Rate (%)"
            min={0}
            max={100}
            error={errors.taxRate?.message}
            value={watch("taxRate")}
            onChange={(value) => {
              setValue("taxRate", Number(value) || 0);
              calculateTotals();
            }}
          />
          <NumberInput label="Subtotal" readOnly value={watch("subtotal")} />
          <NumberInput label="Tax Amount" readOnly value={watch("taxAmount")} />
          <NumberInput
            label="Total Amount"
            readOnly
            value={watch("totalAmount")}
          />
        </Group>

        <TextInput
          label="Notes"
          error={errors.notes?.message}
          {...register("notes")}
        />

        <Group justify="space-between">
          <Button variant="subtle" color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="btn">
            {receipt ? "Update Receipt" : "Save Receipt"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
