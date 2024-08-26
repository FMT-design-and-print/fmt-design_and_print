"use client";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { Select, Text } from "@mantine/core";
import { useState } from "react";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { ErrorsRenderer } from "../ErrorsRenderer";
import { ItemsCardSelect } from "../ItemCardSelect";
import { Quantity } from "../Quantity";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { isArtworkRequired } from "../required-artwork";
import { saveCustomOrderDetails } from "../save-details";
import { uploadArtworkFiles } from "../upload-files";
import { validateQuoteMedium } from "../validate-quote-medium";
import { Layout } from "./Layout";

const pillowTypes = [
  {
    value: "Cushion",
    label: "Cushion pillow",
    image:
      "https://res.cloudinary.com/dnbmynikp/image/upload/v1715101364/FMT/71zHyOpq07L._AC_UF894_1000_QL80_DpWeblab__tt6lor.jpg",
  },
  {
    value: "Sequin",
    label: "Sequin pillow",
    image:
      "https://res.cloudinary.com/dnbmynikp/image/upload/v1715101226/FMT/516sbY980eL_tqlotc.jpg",
  },
];

export const Pillows = ({ image }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates(image);
  const [pillowType, setPillowType] = useState("");
  const [side, setSide] = useState("");

  const validateFields = () => {
    let errors: string[] = [];

    if (!pillowType) {
      errors.push("Select Pillow Type");
    }

    if (!side) {
      errors.push("Select Side");
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
      itemTypes: [productType],
      user_id: user?.id,
    };

    const orderDetails = {
      pillowType,
      side,
      artworks: urls,
    };

    setLoadingMessage("Adding details...");
    const { isSuccess, data } = await saveCustomOrderDetails(
      requestDetails,
      orderDetails,
      context
    );
    setIsLoading(false);
    setLoadingMessage("");

    if (isSuccess) {
      router.push(`/custom-request/success?reference=${data?.orderId}`);
    }
  };

  return (
    <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
      <ItemsCardSelect
        label="Pillow Type"
        items={pillowTypes}
        value={pillowType}
        onChange={(type) => setPillowType(type)}
      />

      <Select
        miw={250}
        label="Sides"
        placeholder="Select design sides (front/back)"
        data={["One Side", "Both Sides"]}
        value={side}
        onChange={(side) => setSide(side || "")}
      />

      <Quantity />

      <Text c="dimmed" size="sm" mt="sm">
        <b>NB:</b> Options like <b>Colors</b> and <b>Others</b> should be added
        as design instructions below. You can use example in the editor as a
        guide.
      </Text>

      <ArtworkSection />
      <DesignInstructions />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Layout>
  );
};
