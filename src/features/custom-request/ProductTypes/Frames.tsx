import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { Checkbox, Select, Text, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { Layout } from "./Layout";
import { Quantity } from "../Quantity";
import Link from "next/link";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { ErrorsRenderer } from "../ErrorsRenderer";
import { validateQuoteMedium } from "../validate-quote-medium";
import { isArtworkRequired } from "../required-artwork";
import { uploadArtworkFiles } from "../upload-files";
import { saveCustomOrderDetails } from "../save-details";
import { generalAcceptableTypes } from "@/constants/artwork-types";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";

const frameSizes = ["A5", "A4", "A3", "A2", "20cm x 25cm"];

export const Frames = () => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates();
  const [frameSize, setFrameSize] = useState("");
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customFrameSize, setCustomFrameSize] = useState("");
  const [frameImageUrl, setFrameImageUrl] = useState("");

  const validateFields = () => {
    let errors: string[] = [];

    if (isCustomSize && !customFrameSize) {
      errors.push("Provide frame size");
    } else if (!frameSize) {
      errors.push("Select frame size");
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
      frameSize,
      frameImageUrl,
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
    <div>
      <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
        <Select
          miw={250}
          label="Frame Size"
          placeholder="Select print type"
          data={frameSizes}
          value={frameSize}
          onChange={(size) => setFrameSize(size || "")}
          disabled={isCustomSize}
        />
        <Checkbox
          label="Custom Size"
          checked={isCustomSize}
          color="pink"
          onChange={(e) => {
            if (e.currentTarget.checked) {
              setFrameSize("");
            }
            setIsCustomSize(e.currentTarget.checked);
          }}
        />
        {isCustomSize && (
          <TextInput
            label="Enter Custom Size"
            value={customFrameSize}
            onChange={(e) => setCustomFrameSize(e.currentTarget.value)}
            placeholder="E.g 16cm x 20cm "
          />
        )}

        <TextInput
          value={frameImageUrl}
          onChange={(e) => setFrameImageUrl(e.currentTarget.value)}
          label="Frame image URL (Optional)"
          placeholder="Enter Frame image URL here"
          description={
            <Text size="xs">
              Enter a URL of an image of a frame type you want here.{" "}
              <Text
                component={Link}
                href="https://images.app.goo.gl/EjWttyjDMzAgWzrb9"
                target="_blank"
                c="pink"
              >
                Click here to see example
              </Text>
            </Text>
          }
        />

        <Quantity />

        <ArtworkSection
          artworkProps={{
            accept: [...generalAcceptableTypes, ...IMAGE_MIME_TYPE],
          }}
        />
        <DesignInstructions />
        <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

        {errors.length > 0 && <ErrorsRenderer errors={errors} />}
      </Layout>
    </div>
  );
};
