import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import React, { useState } from "react";
import { Layout } from "./Layout";
import { Quantity } from "../Quantity";
import { Group, Text } from "@mantine/core";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { isArtworkRequired } from "../required-artwork";
import { validateQuoteMedium } from "../validate-quote-medium";
import { uploadArtworkFiles } from "../../../functions/upload-files";
import { saveCustomOrderDetails } from "../save-details";
import { ItemTypeSelect } from "../ItemTypeSelect";
import { validateContactInfo } from "../validate-contact-info";
import { sendMessage } from "@/functions/send-message";
import { createOrderMessage } from "./messageUtils";
import { artworkOptionLabelMap } from "@/constants/order-details-map";
import { productImages } from "@/constants/images";

const bagTypes = [
  { type: "Paper Bag", minQty: 100 },
  { type: "Tote Bag", minQty: 5 },
  { type: "Rubber bag / Polybag", minQty: 100 },
];

export const Bags = ({ image = productImages.bags }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates(image);
  const [bagType, setBagType] = useState("");
  const [minQty, setMinQty] = useState<number>(1);

  const validateFields = () => {
    let errors: string[] = [];

    if (!bagType) {
      errors.push("Select Print Type");
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
    setLoadingMessage("Uploading Artwork files...");
    const urls = await uploadArtworkFiles(context?.artworkFiles || []);

    const requestDetails = {
      itemTypes: [productType],
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

  const handleItemTypeChange = (value: string | null | undefined) => {
    setBagType(value || "");
    const selected = bagTypes.find((bag) => bag.type === value)?.minQty;
    setMinQty(selected || 1);
    context?.setQuantity(selected || 1);
  };

  return (
    <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
      <Group grow flex="wrap">
        <ItemTypeSelect
          value={bagType}
          onChange={handleItemTypeChange}
          label="Bag Type"
          types={bagTypes.map((bag) => bag.type)}
        />
        <Quantity minQty={minQty} />
      </Group>

      <Text c="dimmed" size="sm" mt="sm">
        <b>NB:</b> Options like <b>Colors</b> and <b>Sizes</b> should be added
        as design instructions below. You can use example in the editor as a
        guide.
      </Text>

      <DesignInstructions />
      <ArtworkSection />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Layout>
  );
};
