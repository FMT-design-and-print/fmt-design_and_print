"use client";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { ComboboxData, Select, Text } from "@mantine/core";
import { useState } from "react";
import { ArtworkSection } from "../ArtworkSection";
import { BrandSelect } from "../BrandSelect";
import { DesignInstructions } from "../DesignInstructions";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { FlexLayout } from "@/components/FlexLayout";
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

const tShirtBrands: ComboboxData = [
  {
    value: "aoykawim",
    label: "Aoykawim (Recommended)",
  },
  {
    value: "mr_tan",
    label: "Mr Tan",
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

export const TShirts = ({ image }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates(image);
  const [brand, setBrand] = useState("");
  const [side, setSide] = useState("");
  const [sleeveType, setSleeveType] = useState("");
  const [printType, setPrintType] = useState("");

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
      brand,
      side,
      sleeveType,
      printType,
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
      <FlexLayout grow>
        <BrandSelect
          defaultValue={"aoykawim"}
          brands={tShirtBrands}
          value={brand}
          onChange={(brand) => setBrand(brand || "")}
        />
        <Select
          miw={250}
          label="Sides"
          placeholder="Select design sides (front/back)"
          data={["Front only", "Back only", "Front & Back"]}
          value={side}
          onChange={(side) => setSide(side || "")}
        />
      </FlexLayout>
      <FlexLayout grow>
        <Select
          miw={200}
          label="Sleeve Type"
          placeholder="Select sleeve type"
          data={["Short sleeve", "Long sleeve"]}
          value={sleeveType}
          onChange={(sleeveType) => setSleeveType(sleeveType || "")}
        />

        <Select
          miw={200}
          label="Print Type"
          placeholder="Select print type"
          data={["DTF", "Screen Printing"]}
          value={printType}
          onChange={(printType) => setPrintType(printType || "")}
        />
      </FlexLayout>
      <Quantity />

      <Text c="dimmed" size="sm" mt="sm">
        <b>NB:</b> Options like <b>Colors</b> and <b>Sizes</b> should be added
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
