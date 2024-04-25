"use client";
import { useSession } from "@/store";
import { ComboboxData, Group } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCustomRequest } from "..";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { ErrorsRenderer } from "../ErrorsRenderer";
import { ItemTypeSelect } from "../ItemTypeSelect";
import { Quantity } from "../Quantity";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { isArtworkRequired } from "../required-artwork";
import { saveCustomOrderDetails } from "../save-details";
import { uploadArtworkFiles } from "../upload-files";
import { validateQuoteMedium } from "../validate-quote-medium";
import { Layout } from "./Layout";

const mugTypes: ComboboxData = [
  {
    value: "ceramic",
    label: "Ceramic mug",
  },
  {
    value: "magic",
    label: "Magic mug",
  },
];

export const Mugs = () => {
  const context = useCustomRequest();
  const [mugType, setMugType] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSession((state) => state.user);
  const router = useRouter();
  const { productType } = useParams();

  const validateFields = () => {
    let errors: string[] = [];

    if (!mugType) {
      errors.push("Select Mug Type");
    }

    if (
      isArtworkRequired(context?.selectedArtworkOption, context?.artworkFiles)
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
    const errors = validateFields();
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    setErrors([]);
    setIsLoading(true);
    setLoadingMessage("Uploading  Artwork files...");
    const urls = await uploadArtworkFiles(context?.artworkFiles || []);

    const requestDetails = {
      itemType: productType,
      user_id: user?.id,
    };

    const orderDetails = {
      mugType,
      artworks: urls,
    };

    const { isSuccess, data } = await saveCustomOrderDetails(
      requestDetails,
      orderDetails,
      context
    );
    setIsLoading(false);
    setLoadingMessage("");

    if (isSuccess) {
      console.log(data);
      router.push(`/custom-request/success?reference=${data?.orderId}`);
    }
  };

  return (
    <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
      <Group grow flex="wrap">
        <ItemTypeSelect
          value={mugType}
          onChange={(value) => setMugType(value || "")}
          label="Mug Type"
          types={mugTypes}
        />
        <Quantity />
      </Group>

      <ArtworkSection />
      <DesignInstructions />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Layout>
  );
};
