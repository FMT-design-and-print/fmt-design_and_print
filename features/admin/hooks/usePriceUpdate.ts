import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { SanityClient } from "next-sanity";

// Constants for rate limiting
const BATCH_SIZE = 20; // Keeping well below the 25 req/s limit
const BATCH_DELAY = 2000; // 2 seconds between batches to be safe

interface UpdateProgress {
  totalProducts: number;
  processedProducts: number;
  percentage: number;
}

interface PriceUpdateOptions {
  products: string[];
  updateType: "fixed" | "percentage";
  priceValue: number;
  categoryName?: string;
  productTypeName?: string;
  client: SanityClient;
}

interface UpdateSummary {
  totalProducts: number;
  oldPrices: { [key: string]: number };
  newPrices: { [key: string]: number };
  updateType: "fixed" | "percentage";
  priceValue: number;
  categoryName?: string;
  productTypeName?: string;
}

interface SanityDocument {
  _id: string;
  title: string;
  price: number;
}

export const usePriceUpdate = () => {
  const [progress, setProgress] = useState<UpdateProgress>({
    totalProducts: 0,
    processedProducts: 0,
    percentage: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const processBatch = async (
    batch: string[],
    options: PriceUpdateOptions,
    updateSummary: UpdateSummary
  ) => {
    const { client, updateType, priceValue } = options;

    // Fetch current prices for the batch
    const docs = await Promise.all(
      batch.map((id) => client.getDocument(id) as Promise<SanityDocument>)
    );

    // Prepare all updates for this batch
    const updates = docs
      .map((doc) => {
        if (!doc) return null;

        const oldPrice = doc.price || 0;
        updateSummary.oldPrices[doc.title] = oldPrice;

        let newPrice;
        if (updateType === "percentage") {
          newPrice = Math.round(oldPrice * (1 + priceValue / 100) * 100) / 100;
        } else {
          newPrice = priceValue;
        }

        updateSummary.newPrices[doc.title] = newPrice;

        return {
          id: doc._id,
          price: newPrice,
        };
      })
      .filter(Boolean);

    // Create and execute a transaction for this batch
    const transaction = updates.map((update) =>
      client.patch(update!.id).set({ price: update!.price })
    );

    await Promise.all(transaction.map((tx) => tx.commit()));
  };

  const mutation = useMutation<UpdateSummary, Error, PriceUpdateOptions>({
    mutationFn: async (options: PriceUpdateOptions) => {
      const {
        products,
        categoryName,
        productTypeName,
        updateType,
        priceValue,
      } = options;

      if (products.length === 0) {
        throw new Error("No products selected for update");
      }

      setIsUpdating(true);
      const updateSummary: UpdateSummary = {
        totalProducts: products.length,
        oldPrices: {},
        newPrices: {},
        updateType,
        priceValue,
        categoryName,
        productTypeName,
      };

      // Initialize progress
      setProgress({
        totalProducts: products.length,
        processedProducts: 0,
        percentage: 0,
      });

      // Process in batches
      for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const batch = products.slice(i, i + BATCH_SIZE);

        // Show progress notification
        notifications.show({
          id: "price-update-progress",
          title: "Updating Prices",
          message: `Processing ${i + 1} to ${Math.min(
            i + BATCH_SIZE,
            products.length
          )} of ${products.length} products...`,
          loading: true,
          autoClose: false,
        });

        await processBatch(batch, options, updateSummary);

        // Update progress
        const processedProducts = Math.min(i + BATCH_SIZE, products.length);
        const percentage = Math.round(
          (processedProducts / products.length) * 100
        );
        setProgress({
          totalProducts: products.length,
          processedProducts,
          percentage,
        });

        // Add delay between batches
        if (i + BATCH_SIZE < products.length) {
          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
        }
      }

      setIsUpdating(false);
      return updateSummary;
    },
    onSuccess: (summary) => {
      const sampleProducts = Object.keys(summary.oldPrices).slice(0, 3);
      const hasMoreProducts = Object.keys(summary.oldPrices).length > 3;
      const totalUpdated = Object.keys(summary.oldPrices).length;

      const priceChangeExamples = sampleProducts
        .map((title) => {
          const oldPrice = summary.oldPrices[title];
          const newPrice = summary.newPrices[title];
          return `${title}: GH₵${oldPrice} → GH₵${newPrice}`;
        })
        .join("\n");

      const message = [
        `Updated ${totalUpdated} products`,
        summary.categoryName
          ? ` in ${summary.categoryName} (${summary.productTypeName})`
          : "",
        ` with ${summary.updateType === "fixed" ? `fixed price of GH₵${summary.priceValue}` : `${summary.priceValue}% change`}`,
        "\n\nSample changes:",
        priceChangeExamples,
        hasMoreProducts ? `\n...and ${totalUpdated - 3} more` : "",
      ].join("");

      notifications.show({
        id: "price-update-progress",
        title: "Prices Updated Successfully",
        message,
        color: "green",
        autoClose: 8000,
      });
    },
    onError: (error: Error) => {
      setIsUpdating(false);
      console.error("Error updating prices:", error);
      notifications.show({
        id: "price-update-progress",
        title: "Error",
        message: "Failed to update prices",
        color: "red",
      });
    },
  });

  return {
    updatePrices: mutation.mutate,
    progress,
    isUpdating,
  };
};
