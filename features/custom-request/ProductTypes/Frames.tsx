import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { Checkbox, Select, Text, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { Layout } from "./Layout";
import { Quantity } from "../Quantity";
import Link from "next/link";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { validateQuoteMedium } from "../validate-quote-medium";
import { isArtworkRequired } from "../required-artwork";
import { uploadArtworkFiles } from "../upload-files";
import { saveCustomOrderDetails } from "../save-details";
import { generalAcceptableTypes } from "@/constants/artwork-types";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { validateContactInfo } from "../validate-contact-info";
import { sendMessage } from "@/functions/send-message";
import { createOrderMessage } from "./messageUtils";
import { artworkOptionLabelMap } from "@/constants/order-details-map";

const frameSizes = ["A5", "A4", "A3", "A2", "20cm x 25cm"];
const types = ["with Glass", "Canvas Laminated", "Rubber Laminated"];

export const Frames = ({ image }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates(image);
  const [frameSize, setFrameSize] = useState("");
  const [frontType, setFrontType] = useState("");
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

    const contactInfoErrors = validateContactInfo(context.contactName);

    if (contactInfoErrors.length > 0) {
      errors = [...errors, ...contactInfoErrors];
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
      frameSize,
      frontType,
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
      // Send a message after successful order insertion
      try {
        const { subject, content } = createOrderMessage(data?.orderId);
        await sendMessage({
          subject,
          content,
          source: "custom-order",
          metadata: {
            orderId: data?.orderId,
            ...requestDetails,
            selectedArtworkOption:
              artworkOptionLabelMap[context.selectedArtworkOption],
            quoteReceptionMedium: context.quoteReceptionMedium,
            quoteReceptionValue: context.quoteReceptionValue,
            quantity: context.quantity,
            contactName: context.contactName,
            phone: context.phone,
            email: context.email,
            orderDetails,
          },
        });
      } catch (messageError) {
        console.error("Failed to send confirmation message:", messageError);
      }

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
            <Text size="xs" component="span">
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

        <Select
          miw={250}
          label="Front Type"
          placeholder="Select front type"
          data={types}
          value={frontType}
          onChange={(type) => setFrontType(type || "")}
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
