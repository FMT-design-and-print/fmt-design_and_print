"use client";
import {
  Box,
  ComboboxData,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { ArtworkOptions } from "../ArtworkOptions";
import { ArtworksDropzone } from "../ArtworksDropzone";
import { DesignInstructions } from "../DesignInstructions";
import { BrandSelect } from "../BrandSelect";
import { useState } from "react";
import { useCustomRequest } from "..";
import { Quantity } from "../Quantity";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { validateQuoteMedium } from "../validate-quote-medium";
import { ErrorsRenderer } from "../ErrorsRenderer";
import { uploadArtworkFiles } from "../upload-files";
import { createClient } from "@/utils/supabase/client";
import { ICustomOrder } from "@/types/order";
import { ItemTypes } from "@/constants/item-types";
import { getOrderId } from "@/functions";
import { useSession } from "@/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const tShirtBrands: ComboboxData = [
  {
    value: "aoykawim",
    label: "Aoykawim (Recommended)",
  },
  {
    value: "gildan",
    label: "Gildan",
  },
  {
    value: "key",
    label: "Key",
  },
];

export const TShirts = () => {
  const router = useRouter();
  const context = useCustomRequest();
  const [brand, setBrand] = useState("");
  const [side, setSide] = useState("");
  const [sleeveType, setSleeveType] = useState("");
  const [printType, setPrintType] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSession((state) => state.user);

  const validateFields = () => {
    let errors: string[] = [];

    if (!brand) {
      errors.push("Select T-Shirt Brand");
    }

    if (!side) {
      errors.push("Select T-Shirt Side");
    }

    if (!sleeveType) {
      errors.push("Select sleeve type");
    }

    if (!printType) {
      errors.push("Select print type");
    }

    if (
      context?.selectedArtworkOption === "own-artwork" &&
      context?.artworkFiles.length === 0
    ) {
      errors.push("Upload artworks");
    }

    const quoteReceptionMediumErrors = validateQuoteMedium(
      context?.quoteReceptionMedium,
      context?.quoteReceptionValue
    );

    if (quoteReceptionMediumErrors.length > 0) {
      errors = [...errors, ...quoteReceptionMediumErrors];
    }
    return errors;
  };

  const handleReceiveQuote = async () => {
    context?.setIsSubmitting(true);

    const errors = validateFields();
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    setErrors([]);
    setIsLoading(true);
    setLoadingMessage("Uploading  Artwork files...");
    const urls = await uploadArtworkFiles(context?.artworkFiles || []);

    setLoadingMessage("Adding details...");

    const supabase = createClient();
    const customOrderDetails: Partial<ICustomOrder> = {
      itemType: ItemTypes.TSHIRT,
      orderId: getOrderId(),
      user_id: user?.id,
      status: "requested",
      orderDetails: {
        brand,
        side,
        sleeveType,
        printType,
        quantity: context?.quantity,
        artworkOption: context?.selectedArtworkOption,
        artworks: urls,
        quoteReceptionMedium: context?.quoteReceptionMedium,
        quoteReceptionValue: context?.quoteReceptionValue,
        instructions: context?.designInstructions,
      },
    };
    const { data, error } = await supabase
      .from("custom-orders")
      .insert([customOrderDetails])
      .select("orderId")
      .single();

    setIsLoading(false);
    setLoadingMessage("");

    if (error) {
      toast.error("Could not add details. Please try again.");
      return;
    }

    toast.success(
      "Order requested successfully. We will reach out to you soon."
    );
    router.push(`/custom-request/success?orderId=${data?.orderId}`);
  };

  return (
    <Stack gap={16} py="lg" pos="relative">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2, children: loadingMessage }}
        loaderProps={{ color: "pink", type: "dots" }}
      />
      <Group grow>
        <BrandSelect
          defaultValue={"aoykawim"}
          brands={tShirtBrands}
          value={brand}
          onChange={(brand) => setBrand(brand || "")}
        />
        <Select
          label="Sides"
          placeholder="Select design sides (front/back)"
          data={["Front only", "Back only", "Front & Back"]}
          value={side}
          onChange={(side) => setSide(side || "")}
        />
      </Group>

      <Group grow>
        <Select
          label="Sleeve Type"
          placeholder="Select sleeve type"
          data={["Short sleeve", "Long sleeve"]}
          value={sleeveType}
          onChange={(sleeveType) => setSleeveType(sleeveType || "")}
        />

        <Select
          label="Print Type"
          placeholder="Select print type"
          data={["DTF", "Screen Printing"]}
          value={printType}
          onChange={(printType) => setPrintType(printType || "")}
        />
      </Group>
      <Quantity />

      <Text c="dimmed" size="sm" mt="sm">
        <b>NB:</b> Options like <b>Colors</b> and <b>Sizes</b> should be added
        as design instructions below
      </Text>

      <Box my="md">
        <Text mb="xs">Artworks</Text>
        <ArtworkOptions />
        {context?.selectedArtworkOption === "own-artwork" && (
          <>
            <Text c="dimmed" size="sm">
              Please upload high quality artworks below
            </Text>
            <ArtworksDropzone />
            <Text c="dimmed" size="sm" mt="sm">
              <b>NB:</b> If you are uploading many artworks files or files with
              huge sizes, please send them to us separately via Whatsapp here
            </Text>
          </>
        )}
      </Box>
      <DesignInstructions />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Stack>
  );
};
