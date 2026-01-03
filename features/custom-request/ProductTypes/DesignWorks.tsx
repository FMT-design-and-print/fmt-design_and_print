import React, { useState } from "react";
import { Layout } from "./Layout";
import { useCustomReqCommonStates } from "@/hooks/useCommonStates";
import { Quantity } from "../Quantity";
import { DesignInstructions } from "../DesignInstructions";
import { ArtworkSection } from "../ArtworkSection";
import { QuoteReceptionOptions } from "../QuoteReceptionOptions";
import { ErrorsRenderer } from "@/components/ErrorsRenderer";
import { Box, Checkbox, Divider, Stack, Text } from "@mantine/core";
import { uploadArtworkFiles } from "../../../functions/upload-files";
import { saveCustomOrderDetails } from "../save-details";
import { validateQuoteMedium } from "../validate-quote-medium";
import { isArtworkRequired } from "../required-artwork";
import { cardKeywords, pullUpKeywords } from "@/constants/all-product_keywords";
import { validateContactInfo } from "../validate-contact-info";
import { sendMessage } from "@/functions/send-message";
import { createOrderMessage } from "./messageUtils";
import { artworkOptionLabelMap } from "@/constants/order-details-map";
import { productImages } from "@/constants/images";

export const DesignWorks = ({ image = productImages.designWorks }: { image: string }) => {
  const {
    context,
    loadingState: { isLoading, setIsLoading },
    loadingMsgState: { loadingMessage, setLoadingMessage },
    errorsState: { errors, setErrors },
    user,
    router,
    productType,
  } = useCustomReqCommonStates(image);
  const [services, setServices] = useState<string[]>([]);
  const [extraOptions, setExtraOptions] = useState<string[]>([]);

  const validateFields = () => {
    let errors: string[] = [];

    // Validate that at least one service is selected
    if (services.length === 0) {
      errors.push("Please select at least one service");
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
      services: services,
      extraOptions: extraOptions,
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

  return (
    <Layout isLoading={isLoading} loadingMessage={loadingMessage}>
      <Text c="dimmed" size="sm" mt="sm">
        Choose all the services you require
      </Text>
      <Stack>
        <Checkbox
          label="Design"
          color="pink"
          checked={services.includes("design")}
          onChange={(e) => {
            setServices(
              e.currentTarget.checked
                ? [...services, "design"]
                : services.filter((s) => s !== "design")
            );
          }}
        />
        <Checkbox
          label="Print"
          color="pink"
          checked={services.includes("print")}
          onChange={(e) => {
            setServices(
              e.currentTarget.checked
                ? [...services, "print"]
                : services.filter((s) => s !== "print")
            );
          }}
        />
      </Stack>

      {cardKeywords.includes(productType as string) && (
        <Box>
          <Divider my="sm" />
          <Text c="dimmed" size="sm" my="sm">
            Side
          </Text>
          <Stack>
            <Checkbox
              color="pink"
              label="One Side"
              checked={extraOptions.includes("One Side")}
              onChange={(e) => {
                setExtraOptions(
                  e.currentTarget.checked
                    ? [...extraOptions, "One Side"]
                    : extraOptions.filter((o) => o !== "One Side")
                );
              }}
            />
            <Checkbox
              color="pink"
              label="Two Sides"
              checked={extraOptions.includes("Two Sides")}
              onChange={(e) => {
                setExtraOptions(
                  e.currentTarget.checked
                    ? [...extraOptions, "Two Sides"]
                    : extraOptions.filter((o) => o !== "Two Sides")
                );
              }}
            />
          </Stack>
        </Box>
      )}

      {pullUpKeywords.includes(productType as string) && (
        <Box>
          <Divider my="sm" />

          <Stack>
            <Checkbox
              color="pink"
              label="Complete Set"
              checked={extraOptions.includes("Complete Set")}
              onChange={(e) => {
                setExtraOptions(
                  e.currentTarget.checked
                    ? [...extraOptions, "Complete Set"]
                    : extraOptions.filter((o) => o !== "Complete Set")
                );
              }}
            />
            <Checkbox
              color="pink"
              label="Banner Only"
              checked={extraOptions.includes("Banner Only")}
              onChange={(e) => {
                setExtraOptions(
                  e.currentTarget.checked
                    ? [...extraOptions, "Banner Only"]
                    : extraOptions.filter((o) => o !== "Banner Only")
                );
              }}
            />
            <Checkbox
              color="pink"
              label="Base Only"
              checked={extraOptions.includes("Base Only")}
              onChange={(e) => {
                setExtraOptions(
                  e.currentTarget.checked
                    ? [...extraOptions, "Base Only"]
                    : extraOptions.filter((o) => o !== "Base Only")
                );
              }}
            />
          </Stack>
        </Box>
      )}

      <Text c="dimmed" size="sm" mt="sm">
        Please add all the details like, the <b>Type of Item</b>, <b>Colors</b>{" "}
        and <b>Dimensions</b> as design instructions below. You can use example
        in the editor as a guide.
      </Text>
      <DesignInstructions />

      {services.includes("print") && (
        <Quantity
          label="Print Quantity"
          minQty={cardKeywords.includes(productType as string) ? 100 : 1}
        />
      )}
      <ArtworkSection />
      <QuoteReceptionOptions handleReceiveQuote={handleReceiveQuote} />
      {errors.length > 0 && <ErrorsRenderer errors={errors} />}
    </Layout>
  );
};
