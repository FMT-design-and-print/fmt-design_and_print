import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  MultiSelect,
  Paper,
  Stack,
  TextInput,
  Title,
  SegmentedControl,
  Text,
  Select,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useQuoteWithOrder } from "../hooks/useQuoteWithOrder";
import { useProductTypes } from "@/hooks/useProductTypes";
import {
  ARTWORK_OPTIONS,
  QuoteFormValues,
  RECEPTION_MEDIUMS,
  quoteFormSchema,
} from "../schemas/quoteFormSchema";
import { QuoteItems } from "./QuoteItems";
import { ArtworksDropzone } from "@/components/Dropzone/ArtworksDropzone";
import { ReceivedFilesRenderer } from "@/components/Dropzone/ReceivedFilesRenderer";
import { uploadArtworkFiles } from "@/functions/upload-files";
import { getOrderId } from "@/functions";
import { FileWithPath } from "@mantine/dropzone";
import { IQuote } from "@/types/quote";
import { ICustomOrder } from "@/types/order";
import { compareChanges } from "../utils/compareChanges";
import { useNextQuoteNumber } from "@/hooks/admin/useNextQuoteNumber";

interface QuoteFormProps {
  quoteId?: string;
  onSuccess: () => void;
}

export function QuoteForm({ quoteId, onSuccess }: QuoteFormProps) {
  const { nextQuoteNumber } = useNextQuoteNumber();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { data, isLoading } = useQuoteWithOrder(quoteId || "");
  const { productTypes } = useProductTypes();
  const [artworkFiles, setArtworkFiles] = useState<FileWithPath[]>([]);
  const [existingArtworks, setExistingArtworks] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<QuoteFormValues>({
    defaultValues: {
      type: "quote",
      title: "",
      clientName: "",
      email: "",
      contact: "",
      dueDate: new Date(),
      items: [],
      estimatedFulfillmentDate: new Date(),
      itemTypes: [],
      contactName: "",
      phone: "",
      note: "",
      orderDetails: [{ key: "", value: "" }],
      artworkOption: ARTWORK_OPTIONS.NONE,
      receptionMedium: RECEPTION_MEDIUMS.EMAIL,
      receptionValue: "",
    },
    resolver: zodResolver(quoteFormSchema),
  });

  useEffect(() => {
    if (data) {
      const {
        quote,
        customOrder,
        artworkFiles,
        artworkOption,
        receptionMedium,
        receptionValue,
      } = data;
      setValue("type", quote.type);
      setValue("title", quote.title);
      setValue("clientName", quote.clientName || "");
      setValue("email", quote.email || "");
      setValue("contact", quote.contact || "");
      setValue("dueDate", new Date(quote.dueDate));
      setValue("items", quote.items);
      setValue("itemTypes", customOrder.itemTypes);
      setValue("contactName", customOrder.contactName);
      setValue("phone", customOrder.phone);
      setValue("note", quote.note || "");
      setValue(
        "estimatedFulfillmentDate",
        customOrder.estimatedFulfillmentDate
          ? new Date(customOrder.estimatedFulfillmentDate)
          : new Date()
      );
      setValue("orderDetails", customOrder.orderDetails);
      setValue("receptionMedium", receptionMedium);
      setValue("receptionValue", receptionValue);
      setValue("artworkOption", artworkOption);
      setExistingArtworks(artworkFiles);
      if (artworkFiles.length > 0) {
        setValue("artworkOption", ARTWORK_OPTIONS.OWN);
      }
    }
  }, [data, setValue]);

  useEffect(() => {
    if (quoteId && data) {
      const { hasQuoteChanges, hasOrderChanges } = compareChanges(
        watch(),
        data.quote,
        data.customOrder,
        data.customOrder.orderDetails
      );
      const hasNewArtworks = artworkFiles.length > 0;
      setHasChanges(hasQuoteChanges || hasOrderChanges || hasNewArtworks);
    }
  }, [watch, artworkFiles, data, quoteId]);

  if (quoteId && isLoading) {
    return (
      <Center h={200}>
        <Loader color="pink" />
      </Center>
    );
  }

  const addOrderDetail = () => {
    setValue("orderDetails", [
      ...watch("orderDetails"),
      { key: "", value: "" },
    ]);
  };

  const removeOrderDetail = (index: number) => {
    setValue(
      "orderDetails",
      watch("orderDetails").filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      if (quoteId && data) {
        const { hasQuoteChanges, hasOrderChanges } = compareChanges(
          values,
          data.quote,
          data.customOrder,
          data.customOrder.orderDetails
        );
        const hasNewArtworks = artworkFiles.length > 0;

        if (!hasQuoteChanges && !hasOrderChanges && !hasNewArtworks) {
          toast.info("No changes detected");
          onSuccess();
          return;
        }
      }

      if (
        new Set(values.orderDetails.map((d) => d.key.toLowerCase())).size !==
        values.orderDetails.length
      ) {
        toast.error("Duplicate field names are not allowed");
        return;
      }

      if (values.items.length > 50) {
        toast.error("Maximum of 50 items allowed per quote");
        return;
      }

      const totalAmount = values.items.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      );
      if (totalAmount <= 0) {
        toast.error("Total amount must be greater than 0");
        return;
      }

      // Generate order ID
      const orderId = getOrderId();

      // Upload artwork files first if present
      let artworkUrls: string[] = [];
      if (
        values.artworkOption === ARTWORK_OPTIONS.OWN &&
        artworkFiles.length > 0
      ) {
        artworkUrls = await uploadArtworkFiles(artworkFiles);
      }

      const allArtworkUrls = [...existingArtworks, ...(artworkUrls || [])];

      const orderDetails = Object.fromEntries([
        ...values.orderDetails.map(({ key, value }) => [key, value]),
        ...(allArtworkUrls.length > 0 ? [["artworks", allArtworkUrls]] : []),
        ["artworkOption", values.artworkOption],
        ["quoteReceptionMedium", values.receptionMedium],
        ["quoteReceptionValue", values.receptionValue],
      ]);

      const supabase = createClient();

      // Create custom order first
      const { data: orderData, error: orderError } = await supabase
        .from("custom-orders")
        .insert({
          orderId,
          itemTypes: values.itemTypes,
          contactName: values.contactName,
          phone: values.phone,
          email: values.email,
          orderDetails,
          estimatedFulfillmentDate: values.estimatedFulfillmentDate,
          status: "requested",
        } as Partial<ICustomOrder>)
        .select()
        .single();

      if (orderError) {
        if (orderError.code === "23505") {
          throw new Error("A quote with this number already exists");
        }
        throw orderError;
      }

      // Create or update quote
      const quoteData: Partial<IQuote> = {
        type: values.type,
        title: values.title,
        clientName: values.clientName,
        email: values.email,
        contact: values.contact,
        dueDate: values.dueDate,
        items: values.items,
        order_id: orderData.id,
        status: quoteId ? data?.quote.status : "created",
        requestPayment: true,
        note: values.note,
        totalAmount: values.items.reduce(
          (sum, item) => sum + item.totalAmount,
          0
        ),
      };

      const { error: quoteError } = quoteId
        ? await supabase.from("quotes").update(quoteData).eq("id", quoteId)
        : await supabase.from("quotes").insert({
            ...quoteData,
            quoteNumber: nextQuoteNumber,
          });

      if (quoteError) throw quoteError;

      toast.success(`Quote ${quoteId ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${quoteId ? "update" : "create"} quote`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isSubmitting} />
      <Title order={3} mb="md">
        {quoteId ? `Edit ${watch("type")}` : `Create New ${watch("type")}`}
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Paper p="md" withBorder>
            <Title order={4} mb="md">
              {watch("type") === "quote" ? "Quote" : "Invoice"} Details
            </Title>
            <Stack>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Stack gap="xs" maw={300}>
                    <Text size="sm">Type</Text>
                    <SegmentedControl
                      data={[
                        { label: "Quote", value: "quote" },
                        { label: "Invoice", value: "invoice" },
                      ]}
                      {...field}
                    />
                  </Stack>
                )}
              />
              <TextInput
                label="Title"
                required
                {...register("title")}
                error={errors.title?.message}
              />
              <TextInput
                label="Client Name"
                required
                {...register("clientName")}
                error={errors.clientName?.message}
              />
              <Group grow>
                <TextInput
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <TextInput
                  label="Contact Number"
                  {...register("contact")}
                  error={errors.contact?.message}
                />
              </Group>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    label="Due Date"
                    required
                    error={errors.dueDate?.message}
                    {...field}
                  />
                )}
              />
            </Stack>
          </Paper>

          <QuoteItems
            type={watch("type")}
            items={watch("items")}
            onChange={(items) => setValue("items", items)}
          />

          <Paper p="md" withBorder>
            <Title order={4} mb="md">
              Custom Order Details
            </Title>
            <Stack>
              <Controller
                name="estimatedFulfillmentDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    label="Estimated Fulfillment Date"
                    required
                    error={errors.estimatedFulfillmentDate?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="itemTypes"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label="Item Types"
                    data={
                      productTypes?.map((type) => ({
                        value: type.slug,
                        label: type.title,
                      })) ?? []
                    }
                    searchable
                    withAsterisk
                    error={errors.itemTypes?.message}
                    {...field}
                  />
                )}
              />
              <TextInput
                label="Contact Name"
                required
                {...register("contactName")}
                error={errors.contactName?.message}
              />
              <Group grow>
                <TextInput
                  label="Phone"
                  required
                  {...register("phone")}
                  error={errors.phone?.message}
                />
                <TextInput
                  label="Email"
                  type="email"
                  required
                  {...register("email")}
                  error={errors.email?.message}
                />
              </Group>

              {/* Dynamic Order Details Fields */}
              {watch("orderDetails").map((_, index) => (
                <Group key={index} grow>
                  <Controller
                    name={`orderDetails.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        label="Field Name"
                        error={errors.orderDetails?.[index]?.key?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name={`orderDetails.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        label="Value"
                        error={errors.orderDetails?.[index]?.value?.message}
                        {...field}
                      />
                    )}
                  />
                  <Button
                    color="red"
                    variant="subtle"
                    onClick={() => removeOrderDetail(index)}
                  >
                    Remove
                  </Button>
                </Group>
              ))}

              <Button variant="subtle" color="pink" onClick={addOrderDetail}>
                Add Order Detail
              </Button>

              <Controller
                name="artworkOption"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Artwork Option"
                    data={[
                      {
                        value: ARTWORK_OPTIONS.OWN,
                        label: "I have my own artwork",
                      },
                      {
                        value: ARTWORK_OPTIONS.FMT,
                        label: "FMT to provide artwork",
                      },
                      {
                        value: ARTWORK_OPTIONS.NONE,
                        label: "No artwork needed",
                      },
                    ]}
                    {...field}
                  />
                )}
              />

              {watch("artworkOption") === ARTWORK_OPTIONS.OWN && (
                <Box>
                  {existingArtworks.length > 0 && (
                    <Text size="sm" mb="xs">
                      Previously uploaded: {existingArtworks.join(", ")}
                    </Text>
                  )}
                  <ArtworksDropzone
                    files={artworkFiles}
                    onFilesChange={setArtworkFiles}
                    renderFiles={() => (
                      <ReceivedFilesRenderer
                        files={artworkFiles}
                        onRemove={(file) =>
                          setArtworkFiles((prev) =>
                            prev.filter((f) => f.name !== file.name)
                          )
                        }
                      />
                    )}
                  />
                </Box>
              )}

              <Controller
                name="receptionMedium"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Quote Reception Medium"
                    data={[
                      { value: RECEPTION_MEDIUMS.EMAIL, label: "Email" },
                      { value: RECEPTION_MEDIUMS.SMS, label: "SMS" },
                      { value: RECEPTION_MEDIUMS.WHATSAPP, label: "WhatsApp" },
                    ]}
                    {...field}
                  />
                )}
              />

              <TextInput
                label="Reception Value"
                {...register("receptionValue")}
                error={errors.receptionValue?.message}
                placeholder={
                  watch("receptionMedium") === RECEPTION_MEDIUMS.EMAIL
                    ? "Enter email"
                    : "Enter phone number"
                }
              />

              <Textarea
                label="Note"
                placeholder="Enter any additional notes, payment terms, or special instructions"
                {...register("note")}
                error={errors.note?.message}
                minRows={3}
              />
            </Stack>
          </Paper>

          <Group justify="flex-end">
            <Button variant="subtle" onClick={onSuccess} color="gray">
              Cancel
            </Button>
            <Button
              type="submit"
              color="pink"
              loading={isSubmitting}
              disabled={!!quoteId && !hasChanges}
            >
              {quoteId ? `Update ${watch("type")}` : `Create ${watch("type")}`}
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
