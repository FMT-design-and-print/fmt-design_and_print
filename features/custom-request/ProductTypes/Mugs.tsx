"use client";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { useState } from "react";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { ItemsCardSelect } from "../ItemCardSelect";
import { Quantity } from "../Quantity";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { isArtworkRequired } from "../required-artwork";
import { saveCustomOrderDetails } from "../save-details";
import { uploadArtworkFiles } from "../../../functions/upload-files";
import { validateQuoteMedium } from "../validate-quote-medium";
import { Layout } from "./Layout";
import { validateContactInfo } from "../validate-contact-info";
import { sendMessage } from "@/functions/send-message";
import { createOrderMessage } from "./messageUtils";
import { artworkOptionLabelMap } from "@/constants/order-details-map";

const mugTypes = [
  {
    value: "Ceramic",
    label: "Ceramic mug",
    image:
      "https://cdn.sanity.io/images/5qz48ekn/production/da64d66a67171b9e944fdd59351807715fe9fccf-2160x2160.png",
  },
  {
    value: "Magic",
    label: "Magic mug",
    image:
      "https://res.cloudinary.com/dnbmynikp/image/upload/v1715103553/FMT/Cold_1_250x_2x_p9wwoy.webp",
  },
  {
    value: "Gold Coated",
    label: "Gold Coated",
    image:
      "https://res.cloudinary.com/dnbmynikp/image/upload/v1715104136/FMT/eng_pl_330-ml-glitter-mug-for-sublimation-printing-gold-4709_1_bixnl2.jpg",
  },
  {
    value: "Inside Colored",
    label: "Inside Colored",
    image:
      "https://res.cloudinary.com/dnbmynikp/image/upload/v1715105489/FMT/colored-mugs-photo-print-megastore-printing_yepeb5.jpg",
  },
];

export const Mugs = ({ image }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates(image);
  const [mugType, setMugType] = useState("");

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
    <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
      <ItemsCardSelect
        label="Mug Type"
        value={mugType}
        onChange={(value) => setMugType(value || "")}
        items={mugTypes}
      />

      <Quantity />

      <ArtworkSection />
      <DesignInstructions />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Layout>
  );
};
