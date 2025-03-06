import { getProductOptionsErrors } from "@/functions";
import {
  IPrintProduct,
  ICartItem,
  SelectedProductOptions,
  IOptionsErrors,
} from "@/types";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useCheckout, useEditCheckoutItem } from "@/store/checkout";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "react-toastify";
import { Editor } from "@tiptap/react";
import {
  convertFilesToBase64,
  convertFilesMapToBase64,
} from "@/functions/convert-files-to-base64";

/**
 * Custom hook to handle buying or adding items to cart
 */
export const useBuyOrAddToCart = (
  product: IPrintProduct,
  selectedProductOptions: SelectedProductOptions,
  editor: Editor | null,
  setErrors: (errors: IOptionsErrors) => void
) => {
  const router = useRouter();
  const { addItem } = useCart((state) => state);
  const { setItems: setCheckoutItems, details: checkoutDetails } =
    useCheckout();
  const { isEditingProduct, setIsEditingProduct } = useEditCheckoutItem();
  const { trackAddToCart } = useAnalytics();

  const handleBuyOrAddItemToCart = async (actionType: "buy" | "cart") => {
    const errors = getProductOptionsErrors(selectedProductOptions, {
      sizes: product.sizes,
      isCustomizable: product.isCustomizable,
      disableMainColor: product.disableMainColor,
      numberOfSides: product.numberOfSides,
      numberOfArtworks: product.numberOfArtworks,
      enableArtworkLabels: product.enableArtworkLabels,
      artworkLabels: product.artworkLabels,
      allowMultipleArtworksForEachSide:
        product.allowMultipleArtworksForEachSide,
    });
    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to the first error if it's about artwork
      if (errors.artworkFiles) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return false;
    }

    const isTshirt = product.type.slug === "t-shirts";
    const adjustedPrice =
      isTshirt && selectedProductOptions.selectedProductType === "jersey"
        ? product.price - 5
        : product.price;

    // Convert files to base64
    const serializedArtworkFiles = await convertFilesToBase64(
      selectedProductOptions.artworkFiles || []
    );

    // Convert artworkFilesMap to base64 if it exists
    const serializedArtworkFilesMap = selectedProductOptions.artworkFilesMap
      ? await convertFilesMapToBase64(selectedProductOptions.artworkFilesMap)
      : undefined;

    const item: ICartItem = {
      id: product.id,
      title: product.title,
      price: adjustedPrice,
      productNumber: product.productNumber,
      quantity: selectedProductOptions.quantity,
      image: product.image || selectedProductOptions.image || "",
      timestamp: new Date(),
      color: selectedProductOptions.color,
      size: selectedProductOptions.size,
      note: selectedProductOptions.note,
      selectedProductType: isTshirt
        ? selectedProductOptions.selectedProductType
        : product.type.slug || undefined,
      isCustomizable: product.isCustomizable,
      instructions: editor?.getHTML(),
      artworkFiles: serializedArtworkFiles,
      artworkFilesMap: serializedArtworkFilesMap,
      hasArtworkFiles:
        serializedArtworkFiles && serializedArtworkFiles.length > 0,
      hasArtworkFilesMap:
        serializedArtworkFilesMap &&
        Object.keys(serializedArtworkFilesMap).length > 0,
      artworkLabels: product.artworkLabels,
    };

    if (actionType === "buy") {
      if (isEditingProduct) {
        const itemIndex = checkoutDetails.items.findIndex(
          (existingItem) => existingItem.id === item.id
        );

        if (itemIndex !== -1) {
          const updatedItems = [...checkoutDetails.items];

          updatedItems[itemIndex] = item;

          setCheckoutItems(updatedItems);
          router.push("/checkout");
          setIsEditingProduct(false);
          return;
        }

        setCheckoutItems([item]);
        router.push("/checkout");
        return;
      }

      // Add item to checkout and redirect for non-editing "buy" action
      setCheckoutItems([item]);
      router.push("/checkout");
      return;
    }

    // This code only runs for "cart" action
    addItem(item);
    // Track add to cart event
    trackAddToCart(product.id, product.title, product.price);
    toast.success("Item added to cart");
  };

  return { handleBuyOrAddItemToCart };
};
