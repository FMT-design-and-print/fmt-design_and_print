import { useEffect } from "react";
import { IPrintProduct, SelectedProductOptions } from "@/types";
import { useCheckout, useEditCheckoutItem } from "@/store/checkout";
import { getArtworkFiles, getArtworkFilesMap } from "@/utils/storage";
import { Editor } from "@tiptap/react";
import { getDefaultProductImage } from "@/functions";

/**
 * Custom hook to handle loading and setting product options when editing an existing product
 */
export const useEditProductEffect = (
  product: IPrintProduct,
  setSelectedProductOptions: (options: SelectedProductOptions) => void,
  editor: Editor | null
) => {
  const { details: checkoutDetails } = useCheckout();
  const { isEditingProduct } = useEditCheckoutItem();

  useEffect(() => {
    // If we're editing a product, find it in the checkout items and set the options
    if (isEditingProduct) {
      const itemToEdit = checkoutDetails.items.find(
        (item) => item.id === product.id
      );

      if (itemToEdit) {
        const loadArtworkFiles = async () => {
          let artworkFiles: File[] = [];
          const artworkFilesMap: Record<string, File[]> = {};

          if (itemToEdit.hasArtworkFiles) {
            const files = await getArtworkFiles(itemToEdit.id);
            artworkFiles = files.map((file) => {
              // Create a File object from the base64 string
              const base64Response = file.url;
              const mimeType = base64Response.split(";")[0].split(":")[1];
              const byteString = atob(base64Response.split(",")[1]);
              const byteNumbers = new Array(byteString.length);

              for (let i = 0; i < byteString.length; i++) {
                byteNumbers[i] = byteString.charCodeAt(i);
              }

              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: mimeType });

              const newFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });

              // Add size property
              Object.defineProperty(newFile, "size", {
                value: byteArray.length,
                writable: false,
              });

              // Add other required properties
              Object.defineProperty(newFile, "lastModifiedDate", {
                value: new Date(),
                writable: false,
              });

              Object.defineProperty(newFile, "webkitRelativePath", {
                value: "",
                writable: false,
              });

              return newFile;
            });
          }

          if (itemToEdit.hasArtworkFilesMap) {
            const filesMap = await getArtworkFilesMap(
              itemToEdit.id,
              product.artworkLabels || []
            );

            // Convert each file in the map to a File object
            Object.entries(filesMap).forEach(([label, files]) => {
              artworkFilesMap[label] = files.map((file) => {
                const base64Response = file.url;
                const mimeType = base64Response.split(";")[0].split(":")[1];
                const byteString = atob(base64Response.split(",")[1]);
                const byteNumbers = new Array(byteString.length);

                for (let i = 0; i < byteString.length; i++) {
                  byteNumbers[i] = byteString.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });

                const newFile = new File([blob], file.name, {
                  type: mimeType,
                  lastModified: Date.now(),
                });

                // Add size property
                Object.defineProperty(newFile, "size", {
                  value: byteArray.length,
                  writable: false,
                });

                // Add other required properties
                Object.defineProperty(newFile, "lastModifiedDate", {
                  value: new Date(),
                  writable: false,
                });

                Object.defineProperty(newFile, "webkitRelativePath", {
                  value: "",
                  writable: false,
                });

                return newFile;
              });
            });
          }

          // Set the selected options from the item
          setSelectedProductOptions({
            productId: product.id,
            image: itemToEdit.image || getDefaultProductImage(product),
            color: itemToEdit.color,
            size: itemToEdit.size || "",
            quantity: itemToEdit.quantity,
            note: itemToEdit.note || "",
            selectedProductType:
              (itemToEdit.selectedProductType as "regular" | "jersey") ||
              "regular",
            artworkFiles,
            artworkFilesMap,
            instructions: itemToEdit.instructions || "",
          });

          // Set the editor content if instructions exist
          if (editor && itemToEdit.instructions) {
            editor.commands.setContent(itemToEdit.instructions);
          }
        };

        loadArtworkFiles();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isEditingProduct]);
};
