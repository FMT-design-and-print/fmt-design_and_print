"use client";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { Text } from "@mantine/core";
import { useState } from "react";
import { v4 as uid } from "uuid";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { ImagesCardSelect } from "../ImagesCardSelect";
import { Quantity } from "../Quantity";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { isArtworkRequired } from "../required-artwork";
import { saveCustomOrderDetails } from "../save-details";
import { uploadArtworkFiles } from "../upload-files";
import { validateQuoteMedium } from "../validate-quote-medium";
import { Layout } from "./Layout";

const bottleTypes = [
  {
    id: uid(),
    image:
      "https://res.cloudinary.com/dnbmynikp/image/upload/v1715181473/FMT/3gcsa_512_zwexf0.webp",
  },
  {
    id: uid(),
    image:
      "https://res.cloudinary.com/dnbmynikp/image/upload/v1715181486/FMT/water-bottle-2048px-mira_qsjk1d.jpg",
  },
];

export const Bottles = ({ image }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates(image);
  const [bottleType, setBottleType] = useState({ id: "", image: "" });

  const validateFields = () => {
    let errors: string[] = [];

    if (!bottleType.image) {
      errors.push("Select Bottle Type");
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
      bottleType: bottleType.image,
      artworks: urls,
    };

    setLoadingMessage("Adding details...");
    const { isSuccess, data } = await saveCustomOrderDetails(
      requestDetails,
      orderDetails,
      context
    );

    if (isSuccess) {
      router.push(`/custom-request/success?reference=${data?.orderId}`);
      return;
    }

    setIsLoading(false);
    setLoadingMessage("");
  };

  return (
    <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
      <ImagesCardSelect
        label="Bottle Type"
        items={bottleTypes}
        value={bottleType.id}
        onChange={(type) => setBottleType(type)}
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
