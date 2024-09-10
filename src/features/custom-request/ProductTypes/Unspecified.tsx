"use client";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { Text } from "@mantine/core";
import { ArtworkSection } from "../ArtworkSection";
import { DesignInstructions } from "../DesignInstructions";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { isArtworkRequired } from "../required-artwork";
import { saveCustomOrderDetails } from "../save-details";
import { uploadArtworkFiles } from "../upload-files";
import { validateQuoteMedium } from "../validate-quote-medium";
import { Layout } from "./Layout";

export const UnspecifiedProduct = ({ image }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
  } = useCustomReqCommonStates(image);

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
      itemTypes: [],
      user_id: user?.id,
    };

    const orderDetails = {
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
      <Text c="dimmed" size="sm" mt="sm">
        Please add all details about your request below. You can use example in
        the editor as a guide.
      </Text>
      <DesignInstructions label="Details" hideDescription />

      <ArtworkSection />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />

      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Layout>
  );
};
