import React, { useState } from "react";
import { Layout } from "./Layout";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { Quantity } from "../Quantity";
import { DesignInstructions } from "../DesignInstructions";
import { ArtworkSection } from "../ArtworkSection";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { ErrorsRenderer } from "../ErrorsRenderer";
import { Checkbox, Text } from "@mantine/core";
import { uploadArtworkFiles } from "../upload-files";
import { saveCustomOrderDetails } from "../save-details";
import { validateQuoteMedium } from "../validate-quote-medium";
import { isArtworkRequired } from "../required-artwork";

export const DesignWorks = () => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates();
  const [willPrint, setWillPrint] = useState(true);

  const validateFields = () => {
    let errors: string[] = [];

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
      router.push(`/custom-request/success?reference=${data?.orderId}`);
    }
  };

  return (
    <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
      <Text c="dimmed" size="sm" mt="sm">
        <b>NB:</b> Options like <b>Colors</b> and <b>Dimensions</b> should be
        added as design instructions below
      </Text>

      <DesignInstructions />

      <Checkbox
        label="Will you print?"
        checked={willPrint}
        color="pink"
        onChange={(e) => {
          setWillPrint(e.currentTarget.checked);
        }}
      />

      {willPrint && <Quantity />}

      <ArtworkSection />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Layout>
  );
};
