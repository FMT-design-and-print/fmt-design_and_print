"use client";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { ComboboxData, Select, Text } from "@mantine/core";
import { useState } from "react";
import { ArtworkSection } from "../ArtworkSection";
import { BrandSelect } from "../BrandSelect";
import { DesignInstructions } from "../DesignInstructions";
import { ErrorsRenderer } from "../ErrorsRenderer";
import { FlexLayout } from "../FlexLayout";
import { Quantity } from "../Quantity";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { isArtworkRequired } from "../required-artwork";
import { saveCustomOrderDetails } from "../save-details";
import { uploadArtworkFiles } from "../upload-files";
import { validateQuoteMedium } from "../validate-quote-medium";
import { Layout } from "./Layout";

const lacosteBrands: ComboboxData = [
  {
    value: "mr_tan",
    label: "Mr Tan (Recommended)",
  },
  {
    value: "aoykawim",
    label: "Aoykawim",
  },
];

export const Lacoste = ({ image }: { image: string }) => {
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
  const [printType, setPrintType] = useState("");

  const validateFields = () => {
    let errors: string[] = [];

    if (!brand) {
      errors.push("Select Lacoste Brand");
    }

    if (!side) {
      errors.push("Select Lacoste Side");
    }

    if (!printType) {
      errors.push("Select print type");
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
      brand,
      side,
      printType,
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
      <FlexLayout grow>
        <BrandSelect
          defaultValue={"mr_tan"}
          brands={lacosteBrands}
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
          miw={250}
          label="Print Type"
          placeholder="Select print type"
          data={["DTF", "Screen Printing"]}
          value={printType}
          onChange={(printType) => setPrintType(printType || "")}
        />
        <Quantity />
      </FlexLayout>

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