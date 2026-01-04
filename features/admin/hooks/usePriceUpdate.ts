import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

// Constants for rate limiting
const BATCH_SIZE = 20; // Keeping well below the 25 req/s limit
const BATCH_DELAY = 2000; // 2 seconds between batches to be safe

interface UpdateProgress {
  totalProducts: number;
  processedProducts: number;
  percentage: number;
  skippedProducts: number;
}

interface PriceUpdateOptions {
  products: string[];
  updateType: "fixed" | "percentage";
  priceValue: number;
  categoryName?: string;
  productTypeName?: string;
}

interface UpdateSummary {
  totalProducts: number;
  oldPrices: { [key: string]: number };
  newPrices: { [key: string]: number };
  updateType: "fixed" | "percentage";
  priceValue: number;
  categoryName?: string;
  productTypeName?: string;
  skippedProducts: number;
}

interface ServerBatchSummary {
  totalProducts: number;
  updatedProducts: number;
  skippedProducts: number;
  oldPrices: Record<string, number>;
  newPrices: Record<string, number>;
}

export const usePriceUpdate = () => {
  const [progress, setProgress] = useState<UpdateProgress>({
    totalProducts: 0,
    processedProducts: 0,
    percentage: 0,
    skippedProducts: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const processBatch = async (
    batch: string[],
    options: PriceUpdateOptions,
    updateSummary: UpdateSummary,
    startIndex: number,
    totalCount: number
  ) => {
    const res = await fetch(`/api/admin/prices/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products: batch,
        updateType: options.updateType,
        priceValue: options.priceValue,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Failed to update prices");
    }
    const json = (await res.json()) as {
      success: boolean;
      message: string;
      summary: ServerBatchSummary;
    };

    updateSummary.skippedProducts += json.summary.skippedProducts;
    updateSummary.oldPrices = {
      ...updateSummary.oldPrices,
      ...json.summary.oldPrices,
    };
    updateSummary.newPrices = {
      ...updateSummary.newPrices,
      ...json.summary.newPrices,
    };

    const processedProducts = Math.min(startIndex + BATCH_SIZE, totalCount);
    const percentage = Math.round((processedProducts / totalCount) * 100);
    setProgress({
      totalProducts: totalCount,
      processedProducts,
      percentage,
      skippedProducts: updateSummary.skippedProducts,
    });

    notifications.update({
      id: "price-update-progress",
      title: "Updating Prices",
      message: `Processing ${startIndex + 1} to ${Math.min(
        startIndex + BATCH_SIZE,
        totalCount
      )} of ${totalCount} products...${updateSummary.skippedProducts > 0
          ? `\n(${updateSummary.skippedProducts} products skipped - already at target price)`
          : ""
        }`,
      loading: true,
      autoClose: false,
    });
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
        skippedProducts: 0,
      };

      // Initialize progress
      setProgress({
        totalProducts: products.length,
        processedProducts: 0,
        percentage: 0,
        skippedProducts: 0,
      });

      // Show initial progress notification
      notifications.show({
        id: "price-update-progress",
        title: "Updating Prices",
        message: `Starting updates for ${products.length} products...`,
        loading: true,
        autoClose: false,
      });

      // Process in batches on the server, preserving rate limits and UI progress
      for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const batch = products.slice(i, i + BATCH_SIZE);
        await processBatch(batch, options, updateSummary, i, products.length);

        // Delay between batches to avoid rate limit
        if (i + BATCH_SIZE < products.length) {
          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
        }
      }

      setProgress({
        totalProducts: products.length,
        processedProducts: products.length,
        percentage: 100,
        skippedProducts: updateSummary.skippedProducts,
      });

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

      // First, update the progress notification to show completion
      notifications.update({
        id: "price-update-progress",
        title: "Update Complete ✓",
        message: `All products have been successfully updated!\n${summary.skippedProducts > 0
          ? `(${summary.skippedProducts} products skipped - already at target price)`
          : ""
          }`,
        loading: false,
        color: "green",
        autoClose: 4000,
      });

      // Then, show the detailed summary notification
      setTimeout(() => {
        const message = [
          `✓ Successfully updated ${totalUpdated} products`,
          summary.skippedProducts > 0
            ? `\n(${summary.skippedProducts} products skipped - already at target price)`
            : "",
          summary.categoryName
            ? `\nin ${summary.categoryName} (${summary.productTypeName})`
            : "",
          `\nwith ${summary.updateType === "fixed"
            ? `fixed price of GH₵${summary.priceValue}`
            : `${summary.priceValue}% change`
          }`,
          "\n\nSample changes:",
          priceChangeExamples,
          hasMoreProducts ? `\n...and ${totalUpdated - 3} more` : "",
        ].join("");

        notifications.show({
          id: "price-update-summary",
          title: "Price Update Summary ✓",
          message,
          color: "green",
          autoClose: false,
        });
      }, 4000);
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
