/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PayButton } from "@/components/PaymentDetails/PayButton";
import { baseShippingFeeByRegion } from "@/constants/gh-regions";
import {
  calculateEstimatedFulfillmentDate,
  calculateTotalPrice,
  getOrderId,
} from "@/functions";
import { useSession } from "@/store";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { IShippingAddress } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Alert, Box, Button, Card, Grid, Group, Text } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DeliveryInformation } from "./DeliveryInformation";
import { PaymentDetails } from "./PaymentDetails";
import { ReviewItems } from "./ReviewItems";
import { sendMessage } from "@/functions/send-message";
import { ConfirmOrder } from "@/components/PaymentDetails/ConfirmOrder";
import { PaymentStatus } from "@/types/order";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getArtworkFiles, getArtworkFilesMap } from "@/utils/storage";
import {
  uploadBase64Files,
  uploadBase64FilesMap,
} from "@/functions/upload-files";

interface Props {
  shippingAddresses?: IShippingAddress[];
}

// Define interfaces for the uploaded files
interface UploadedFile {
  path: string;
  filename: string;
}

export const Checkout = ({ shippingAddresses }: Props) => {
  const { session, user } = useSession();
  const router = useRouter();
  const cartItems = useCart((state) => state.items);
  const { setItems, details } = useCheckout((state) => state);
  const { trackPurchase } = useAnalytics();
  const [emptyRequiredFields, setEmptyRequiredFields] = useState<string[]>([]);
  const { clearItemsFromCart } = useCart((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const shippingFee =
    details.deliveryFee ||
    baseShippingFeeByRegion[details.region?.id || 7] ||
    0;
  const subTotal = calculateTotalPrice(details.items);
  const total = subTotal + shippingFee - (details.discount || 0);

  const shippingAddress = {
    contactName: details.contactName,
    phone1: details.phone1,
    phone2: details.phone2,
    email: details.email,
    country: details.country,
    region: details.region,
    address: details.address,
    town: details.town,
  };

  const handleOnPaymentSuccess = async (
    ref: any,
    paymentStatus: PaymentStatus
  ) => {
    setIsLoading(true);
    const supabase = createClient();

    // Process items to include actual artwork files
    const processedItems = await Promise.all(
      details.items.map(async (item) => {
        const processedItem = { ...item };

        // Remove unnecessary properties
        delete processedItem.hasArtworkFiles;
        delete processedItem.hasArtworkFilesMap;
        delete processedItem.artworkLabels;

        // Get actual artwork files if they exist and upload to Supabase storage
        if (item.hasArtworkFilesMap) {
          try {
            // Get files from IndexedDB
            const filesMap = await getArtworkFilesMap(
              item.id,
              item.artworkLabels || []
            );

            // Upload files to Supabase storage
            const uploadedFilesMap = await uploadBase64FilesMap(filesMap);

            // Convert the uploaded files to match the expected format in ICartItem
            const storedFilesMap: Record<
              string,
              { name: string; type: string; url: string; size: number }[]
            > = {};

            for (const [label, files] of Object.entries(uploadedFilesMap)) {
              storedFilesMap[label] = files.map((file: UploadedFile) => {
                // Extract file extension to determine type
                const fileExt =
                  file.filename.split(".").pop()?.toLowerCase() || "";
                const mimeType = getMimeType(fileExt);

                return {
                  name: file.filename,
                  type: mimeType,
                  url: file.path, // Store the path instead of base64
                  size: 0, // Size is not relevant for the stored path
                };
              });
            }

            // Store the file references in the order
            processedItem.artworkFilesMap = storedFilesMap;
            delete processedItem.artworkFiles; // Remove single files if using map
          } catch (error) {
            console.error("Error processing artwork files map:", error);
          }
        } else if (item.hasArtworkFiles) {
          try {
            // Get files from IndexedDB
            const files = await getArtworkFiles(item.id);

            // Upload files to Supabase storage
            const uploadedFiles = await uploadBase64Files(files);

            // Convert the uploaded files to match the expected format in ICartItem
            const storedFiles = uploadedFiles.map((file: UploadedFile) => {
              // Extract file extension to determine type
              const fileExt =
                file.filename.split(".").pop()?.toLowerCase() || "";
              const mimeType = getMimeType(fileExt);

              return {
                name: file.filename,
                type: mimeType,
                url: file.path, // Store the path instead of base64
                size: 0, // Size is not relevant for the stored path
              };
            });

            // Store the file references in the order
            processedItem.artworkFiles = storedFiles;
            delete processedItem.artworkFilesMap; // Remove map if using single files
          } catch (error) {
            console.error("Error processing artwork files:", error);
          }
        }

        return processedItem;
      })
    );

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user?.id,
          orderId: ref.reference,
          items: processedItems,
          totalAmount: total,
          status: "placed",
          deliveryType: details.deliveryType,
          paymentType: details.paymentType,
          deliveryFee: details.deliveryFee,
          reference: ref.reference,
          deliveryDetails: shippingAddress,
          note: details.note,
          paymentStatus: paymentStatus,
          estimatedFulfillmentDate: calculateEstimatedFulfillmentDate(
            5,
            new Date()
          ),
        },
      ])
      .select();

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    // Track successful purchase after order is saved
    trackPurchase(ref.reference, total + shippingFee);

    // Send a message after successful order insertion
    try {
      await sendMessage({
        subject: `Order Confirmation (Order No. ${ref.reference})`,
        content: `Order with reference number ${ref.reference} has been successfully placed.`,
        source: "order",
        metadata: {
          orderNumber: ref.reference,
          userId: user?.id,
          email: user?.email,
          phone: user?.phone,
          amount: total,
          totalPayment: total,
          items: details.items,
        },
      });
    } catch (messageError) {
      console.error("Failed to send confirmation message:", messageError);
    }

    if (details.saveAddress) {
      const { error } = await supabase
        .from("shipping-addresses")
        .insert([
          {
            user_id: user?.id,
            ...shippingAddress,
          },
        ])
        .select();

      if (error) {
        // log address could not be saved
      }
    }

    clearItemsFromCart(details.items.map((item) => item.id));
    router.push(`/order-success?reference=${ref.reference}`);
  };

  // Helper function to determine MIME type from file extension
  const getMimeType = (extension: string): string => {
    const mimeTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      svg: "image/svg+xml",
      pdf: "application/pdf",
      eps: "application/postscript",
      ai: "application/illustrator",
    };

    return mimeTypes[extension] || "application/octet-stream";
  };

  useEffect(() => {
    if (details.items.length === 0 && cartItems.length > 0) {
      setItems(cartItems);
    } else if (details.items.length === 0) {
      router.push("/cart");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, details.items.length]);

  return (
    <Box
      w={{ base: "100%", lg: "90%" }}
      mx="auto"
      py={{ base: "sm", sm: "xl" }}
      pos="relative"
    >
      <LoadingOverlay visible={isLoading} />
      <Grid>
        <Grid.Col span="auto">
          {!session && (
            <Card withBorder my="sm">
              <Group>
                <Text size="sm">Already have an account? </Text>
                <Button
                  variant="transparent"
                  size="xs"
                  component={Link}
                  href={"/login?redirect=/checkout"}
                  color="pink"
                >
                  Login
                </Button>

                <Text size="sm">otherwise </Text>
                <Button
                  variant="transparent"
                  size="xs"
                  component={Link}
                  href={"/signup?redirect=/checkout"}
                  color="pink"
                >
                  Signup
                </Button>
              </Group>
              <Text size="xs" c="dimmed">
                Don&apos;t worry! You can still continue to make your purchase
                without an account
              </Text>
            </Card>
          )}
          <ReviewItems />
          <Box visibleFrom="md">
            <DeliveryInformation shippingAddresses={shippingAddresses} />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <PaymentDetails />
          <Box hiddenFrom="md" mb="lg">
            <DeliveryInformation shippingAddresses={shippingAddresses} />
          </Box>
          {details.region && details.region.id !== 7 && (
            <Box pb="md">
              <Text fz="xs" fs="italic" c="gray.9">
                Your region is outside Greater Accra. Delivery fee is not
                finalized and will be confirmed later
              </Text>
            </Box>
          )}
          <Group grow pb="lg">
            {details.paymentType === "cod" ? (
              <ConfirmOrder
                onConfirm={() =>
                  handleOnPaymentSuccess({ reference: getOrderId() }, "unpaid")
                }
                total={total}
                shippingAddress={shippingAddress}
                deliveryType={details.deliveryType}
                paymentType={details.paymentType}
                setEmptyRequiredFields={setEmptyRequiredFields}
              />
            ) : (
              <PayButton
                total={total}
                shippingAddress={shippingAddress}
                deliveryType={details.deliveryType}
                onSuccess={(ref: any) => handleOnPaymentSuccess(ref, "paid")}
                setEmptyRequiredFields={setEmptyRequiredFields}
                paymentType={details.paymentType}
              />
            )}
          </Group>
          <Box bg="white">
            {emptyRequiredFields.length > 0 && (
              <Alert
                variant="light"
                color="red"
                title={
                  <Text size="xs">Please fill out the following fields:</Text>
                }
                icon={<IconExclamationCircle />}
              >
                {emptyRequiredFields.join(", ")}
              </Alert>
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
