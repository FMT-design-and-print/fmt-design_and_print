import { calculateTotal } from "@/functions";
import { getDateInDays } from "@/functions/durations";
import { IQuote, IQuoteItem, QuoteErrors } from "@/types/quote";
import { createClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { v4 as uid } from "uuid";
import { QuoteFormMode } from "./types";
import { validateQuote } from "./validate-quote";
import { useNextQuoteNumber } from "@/hooks/admin/useNextQuoteNumber";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  mode?: QuoteFormMode;
  orderId: string;
  data: IQuote | null;
  contactName: string;
  phone: string;
  email: string;
  setMode?: (mode: QuoteFormMode) => void;
  setData?: (data: IQuote | null) => void;
}

const initialQuoteItem: IQuoteItem = {
  id: uid(),
  description: "",
  quantity: 0,
  unitPrice: 0,
  totalAmount: 0,
};

export function CreateOrEditQuote({
  orderId,
  contactName,
  phone,
  email,
  mode = "create",
  data,
  setMode,
  setData,
}: Props) {
  const { nextQuoteNumber } = useNextQuoteNumber();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<QuoteErrors>({ items: {} });
  const [quoteTitle, setQuoteTitle] = useState<string>("");
  const [quoteNumber, setQuoteNumber] = useState<number>(nextQuoteNumber || 0);
  const [quoteItems, setQuoteItems] = useState<IQuoteItem[]>([
    initialQuoteItem,
  ]);
  const [clientName, setClientName] = useState<string>(contactName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(phone || "");
  const [emailAddress, setEmailAddress] = useState<string>(email || "");

  const handleCreateQuote = async () => {
    const { hasErrors, errors } = validateQuote(
      quoteTitle,
      quoteNumber,
      quoteItems
    );

    if (hasErrors) {
      setErrors(errors);
    } else {
      const supabase = createClient();
      const quote: Partial<IQuote> = {
        title: quoteTitle,
        items: quoteItems,
        order_id: orderId,
        dueDate: getDateInDays(30),
        totalAmount: calculateTotal(quoteItems.map((item) => item.totalAmount)),
        updated_at: new Date(),
        status: "created",
        quoteNumber,
        requestPayment: true,
        numberOfRevisionsRequested: 0,
        numberOfReactivationRequested: 0,
        clientName: contactName,
        contact: phone,
        email,
      };

      const { error } = await supabase.from("quotes").insert([quote]);
      if (error) {
        toast.error("Error creating quote");
      } else {
        toast.success("Quote created successfully");
        queryClient.invalidateQueries({ queryKey: ["quotes", orderId] });
        setQuoteTitle("");
        setQuoteNumber((prev) => prev + 1);
        setQuoteItems([initialQuoteItem]);
      }
    }
  };

  const resetFields = () => {
    const { errors } = validateQuote(quoteTitle, quoteNumber, quoteItems);
    setErrors(errors);
  };

  const handleUpdateQuote = async () => {
    const { hasErrors, errors } = validateQuote(
      quoteTitle,
      quoteNumber,
      quoteItems
    );

    if (hasErrors) {
      setErrors(errors);
    } else {
      const supabase = createClient();

      const updatedData: Partial<IQuote> = {};

      if (quoteTitle !== data?.title) {
        updatedData.title = quoteTitle;
      }

      if (quoteNumber !== data?.quoteNumber) {
        updatedData.quoteNumber = quoteNumber;
      }

      if (clientName !== data?.clientName) {
        updatedData.clientName = clientName;
      }

      if (phoneNumber !== data?.contact) {
        updatedData.contact = phoneNumber;
      }

      if (emailAddress !== data?.email) {
        updatedData.email = emailAddress;
      }

      const quote: Partial<IQuote> = {
        ...updatedData,
        items: quoteItems,
        totalAmount: calculateTotal(quoteItems.map((item) => item.totalAmount)),
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("quotes")
        .update(quote)
        .eq("id", data?.id);
      if (error) {
        toast.error("Error updating quote");
      } else {
        toast.success("Quote updated successfully");
        queryClient.invalidateQueries({ queryKey: ["quotes", orderId] });
        setQuoteTitle("");
        setQuoteNumber(nextQuoteNumber || 0);
        setQuoteItems([initialQuoteItem]);
        setClientName(contactName || "");
        setPhoneNumber(phone || "");
        setEmailAddress(email || "");
        if (setMode) {
          setMode("create");
        }
      }
    }
  };

  const handleAddNewQuoteItem = () => {
    setQuoteItems([...quoteItems, { ...initialQuoteItem, id: uid() }]);
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems(quoteItems.filter((item) => item.id !== id));
  };

  const handleQuoteItemFieldChange = (
    id: string,
    field: keyof IQuoteItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    setQuoteItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  useEffect(() => {
    setQuoteNumber(nextQuoteNumber || 0);
  }, [nextQuoteNumber]);

  useEffect(() => {
    if (mode === "edit" && data) {
      setQuoteTitle(data.title);
      setQuoteNumber(Number(data.quoteNumber));
      setQuoteItems(data.items);
      setClientName(data.clientName || "");
      setPhoneNumber(data.contact || "");
      setEmailAddress(data.email || "");
    }
  }, [mode, data]);

  return (
    <Box p="md">
      <Title order={3}>Create Quote</Title>
      <Divider my="sm" />

      <Group mb="sm" align="flex-start">
        <Box flex={1}>
          <TextInput
            label="Title"
            placeholder="Give this quote a title"
            size="xs"
            value={quoteTitle}
            onChange={(e) => setQuoteTitle(e.currentTarget.value)}
            onBlur={resetFields}
          />
          {errors?.title && (
            <Text size="10px" c="red" pt="5px">
              {errors.title}
            </Text>
          )}
        </Box>
        <Box w={"120px"}>
          <NumberInput
            m={0}
            label="Quote Number(#)"
            placeholder="Quote Number"
            size="xs"
            value={quoteNumber}
            onChange={(value) => setQuoteNumber(Number(value))}
            onBlur={resetFields}
          />
          {errors?.number && (
            <Text size="10px" c="red" pt="5px">
              {errors.number}
            </Text>
          )}
        </Box>
      </Group>

      {quoteItems.map((item, index) => (
        <Card withBorder my="xs" key={item.id} py={8}>
          <Stack gap={6}>
            <Group justify="space-between">
              <Text>Item {index + 1}</Text>
              {quoteItems.length > 1 && (
                <ActionIcon
                  size="xs"
                  color="red"
                  variant="light"
                  onClick={() => handleRemoveQuoteItem(item.id)}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              )}
            </Group>
            <TextInput
              size="xs"
              placeholder="Item Description"
              value={item.description}
              onChange={(e) =>
                handleQuoteItemFieldChange(
                  item.id,
                  "description",
                  e.currentTarget.value
                )
              }
              onBlur={resetFields}
            />
            <ItemFieldError errors={errors} field="description" index={index} />

            <Flex direction={{ base: "column", sm: "row" }} gap={8}>
              <Box>
                <NumberInput
                  size="xs"
                  placeholder="Quantity"
                  min={1}
                  flex={1}
                  label="Quantity"
                  value={item.quantity}
                  onChange={(value) => {
                    handleQuoteItemFieldChange(
                      item.id,
                      "quantity",
                      Number(value)
                    );

                    handleQuoteItemFieldChange(
                      item.id,
                      "totalAmount",
                      Number(value) * item.unitPrice
                    );
                  }}
                  onBlur={resetFields}
                />
                <ItemFieldError
                  errors={errors}
                  field="quantity"
                  index={index}
                />
              </Box>

              <Box>
                <NumberInput
                  size="xs"
                  placeholder="Unit Price"
                  min={1}
                  flex={1}
                  label="Unit Price"
                  value={item.unitPrice}
                  onChange={(value) => {
                    handleQuoteItemFieldChange(
                      item.id,
                      "unitPrice",
                      Number(value)
                    );
                    handleQuoteItemFieldChange(
                      item.id,
                      "totalAmount",
                      Number(value) * item.quantity
                    );
                  }}
                  onBlur={resetFields}
                />
                <ItemFieldError
                  errors={errors}
                  field="unitPrice"
                  index={index}
                />
              </Box>

              <Box>
                <NumberInput
                  size="xs"
                  placeholder="Total Amount"
                  min={1}
                  flex={1}
                  label="Total Amount"
                  value={item.totalAmount}
                  onChange={(value) =>
                    handleQuoteItemFieldChange(
                      item.id,
                      "totalAmount",
                      Number(value)
                    )
                  }
                  onBlur={resetFields}
                  readOnly
                />
                <ItemFieldError
                  errors={errors}
                  field="totalAmount"
                  index={index}
                />
              </Box>
            </Flex>
          </Stack>
        </Card>
      ))}

      <Button
        w="100%"
        leftSection={<IconPlus size="1rem" />}
        color="gray"
        variant="light"
        style={{ border: "1px dashed var(--mantine-color-gray-4)" }}
        radius={0}
        onClick={handleAddNewQuoteItem}
      >
        Add Item
      </Button>
      <Card withBorder bg="gray.1" mt={16}>
        <Flex gap={8} direction={{ base: "column", sm: "row" }}>
          <TextInput
            label="Individual/Business name"
            placeholder="name"
            className="flex-1"
            value={clientName}
            onChange={(e) => setClientName(e.currentTarget.value)}
          />
          <TextInput
            label="Phone(optional)"
            placeholder="phone number"
            className="flex-1"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.currentTarget.value)}
          />
          <TextInput
            label="Email(optional)"
            placeholder="email address"
            className="flex-1"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.currentTarget.value)}
          />
        </Flex>
      </Card>

      <Group justify="flex-end" align="center" w="100%" mt={16}>
        <Button
          className="btn"
          onClick={mode === "create" ? handleCreateQuote : handleUpdateQuote}
          size="xs"
          radius="lg"
        >
          {mode === "create" ? "Save Quote" : "Update Quote"}
        </Button>
        {mode === "edit" && (
          <Button
            onClick={() => {
              setMode?.("create");
              setData?.(null);
              setQuoteNumber(nextQuoteNumber || 0);
              setQuoteTitle("");
              setQuoteItems([initialQuoteItem]);
            }}
            radius="lg"
            variant="outline"
            color="gray"
            size="xs"
          >
            Cancel
          </Button>
        )}
      </Group>
    </Box>
  );
}

const ItemFieldError = ({
  errors,
  field,
  index,
}: {
  errors: QuoteErrors;
  field: string;
  index: number;
}) => {
  return (
    errors.items[index]?.[field] && (
      <Text size="10px" c="red" pt="5px">
        {errors.items[index]?.[field]}
      </Text>
    )
  );
};
