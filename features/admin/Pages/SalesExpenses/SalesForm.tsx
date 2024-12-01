import { DiscountType, IProductType, PaymentMethod } from "@/types";
import { ISales } from "@/types/sales-expenses";
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
} from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import CommonFormFields from "./CommonFormFields";
import { IAdminUser } from "@/types/admin";
import { getChangedSalesFields } from "@/features/admin/Pages/SalesExpenses/form-helpers";
import { isEqual } from "lodash";

interface SalesFormProps {
  productTypes: IProductType[];
  onSubmit: (data: ISales) => void;
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
  const [unitPrice, setUnitPrice] = useState<number | undefined>(
    initialData?.unitPrice
  );
  const [quantity, setQuantity] = useState<number>(initialData?.quantity || 1);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [customProductType, setCustomProductType] = useState("");
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountType, setDiscountType] =
    useState<DiscountType>("fixed-amount");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [description, setDescription] = useState("");
  const [summaryOpened, setSummaryOpened] = useState(false);

  useEffect(() => {
    if (initialData) {
      setUnitPrice(initialData.unitPrice);
      setQuantity(initialData.quantity);
      setSelectedProductType(initialData.productType);
      setDescription(initialData.description);
      setPaymentMethods(initialData.paymentMethods);
      if (initialData.discount) {
        setApplyDiscount(true);
        setDiscountType(initialData.discount.type);
        setDiscountValue(initialData.discount.value);
      }
    }
  }, [initialData]);

  const calculateSubtotal = () => {
    if (!unitPrice || !quantity) return 0;
    return unitPrice * quantity;
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
    return total;
  };

  const handleSubmit = () => {
    if (!initialData) {
      const data = {
        updated_at: new Date(),
        productType:
          selectedProductType === "other"
            ? customProductType
            : selectedProductType,
        description,
        unitPrice: unitPrice || 0,
        quantity,
        discount: applyDiscount
          ? { type: discountType, value: discountValue }
          : undefined,
        totalAmount: calculateTotalAmount(),
        paymentMethods,
        createdBy: {
          userId: adminUser?.id,
          name: adminUser?.firstName + " " + adminUser?.lastName,
          email: adminUser?.email || "",
          role: adminUser?.role || "",
          image: adminUser?.avatar || "",
        },
      };
      onSubmit(data as ISales);
      return;
    }

    const currentData = {
      productType:
        selectedProductType === "other"
          ? customProductType
          : selectedProductType,
      description,
      unitPrice: unitPrice || 0,
      quantity,
      discount: applyDiscount
        ? { type: discountType, value: discountValue }
        : undefined,
      paymentMethods,
    };

    const changes = getChangedSalesFields(
      currentData,
      initialData,
      calculateTotalAmount
    );
    onSubmit(changes as ISales);
  };

  const hasChanges = () => {
    if (!initialData) return true; // Allow save for new entries

    const currentData = {
      productType:
        selectedProductType === "other"
          ? customProductType
          : selectedProductType,
      description,
      unitPrice: unitPrice || 0,
      quantity,
      discount: applyDiscount
        ? { type: discountType, value: discountValue }
        : undefined,
      paymentMethods,
    };

    const originalData = {
      productType: initialData.productType,
      description: initialData.description,
      unitPrice: initialData.unitPrice,
      quantity: initialData.quantity,
      discount: initialData.discount,
      paymentMethods: initialData.paymentMethods,
    };

    return !isEqual(currentData, originalData);
  };

  return (
    <Stack gap="md">
      <Select
        label="Product Type"
        placeholder="Select Product Type"
        data={[
          ...productTypes.map((type) => ({
            value: type.title,
            label: type.title,
          })),
          { value: "other", label: "Other" },
        ]}
        value={selectedProductType}
        onChange={(value) => setSelectedProductType(value as string)}
        required
      />

      {selectedProductType === "other" && (
        <TextInput
          label="Custom Product Type"
          required
          value={customProductType}
          onChange={(e) => setCustomProductType(e.target.value)}
        />
      )}

      <CommonFormFields
        description={description}
        setDescription={setDescription}
      />

      <Group>
        <NumberInput
          label="Unit Price"
          required
          value={unitPrice}
          onChange={(value) => setUnitPrice(value as number)}
          min={0}
          prefix={`${CURRENCY_SYMBOL} `}
          thousandSeparator=","
        />
        <NumberInput
          label="Quantity"
          required
          value={quantity}
          onChange={(value) => setQuantity(value as number)}
          min={1}
        />
      </Group>

      <Checkbox
        label="Apply Discount"
        checked={applyDiscount}
        onChange={(event) => setApplyDiscount(event.currentTarget.checked)}
        color="pink"
      />

      {applyDiscount && (
        <Group>
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

      <Card withBorder>
        <UnstyledButton
          onClick={() => setSummaryOpened((o) => !o)}
          style={{ width: "100%" }}
        >
          <Group justify="space-between">
            <Title order={5}>Summary</Title>
            {summaryOpened ? (
              <IconChevronDown size="1.2rem" />
            ) : (
              <IconChevronRight size="1.2rem" />
            )}
          </Group>
        </UnstyledButton>

        <Collapse in={summaryOpened}>
          <Stack mt="md">
            <Text size="xs">
              <Text span fw={500} size="xs">
                Product Type:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {selectedProductType === "other"
                  ? customProductType
                  : selectedProductType}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Description:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {description}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Unit Price:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {CURRENCY_SYMBOL} {unitPrice?.toLocaleString()}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Quantity:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {quantity}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Subtotal:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {CURRENCY_SYMBOL} {calculateSubtotal().toLocaleString()}
              </Text>
            </Text>
            {applyDiscount && (
              <>
                <Text size="xs">
                  <Text span fw={500} size="xs">
                    Discount Type:
                  </Text>{" "}
                  <Text span fw={700} size="xs">
                    {discountType}
                  </Text>
                </Text>
                <Text size="xs">
                  <Text span fw={500} size="xs">
                    Discount Value:
                  </Text>{" "}
                  <Text span fw={700} size="xs">
                    {discountType === "percentage"
                      ? `${discountValue}%`
                      : `${CURRENCY_SYMBOL} ${discountValue}`}
                  </Text>
                </Text>
              </>
            )}
            <Text size="xs">
              <Text span fw={500} size="xs">
                Payment Methods:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {paymentMethods.join(", ")}
              </Text>
            </Text>
            <Text size="xs" mt="xs">
              <Text span fw={500} size="xs">
                Total Amount:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {CURRENCY_SYMBOL} {calculateTotalAmount().toLocaleString()}
              </Text>
            </Text>
          </Stack>
        </Collapse>
      </Card>

      <Group justify="flex-end">
        <Button variant="light" color="gray" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color="pink"
          onClick={handleSubmit}
          loading={loading}
          disabled={!adminUser || (initialData && !hasChanges())}
        >
          {initialData ? "Update" : "Save"}
        </Button>
      </Group>
    </Stack>
  );
}
