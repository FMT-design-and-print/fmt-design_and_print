import { useEffect, useState } from "react";
import { getArtworkFiles, getArtworkFilesMap } from "@/utils/storage";
import { ICartItem } from "@/types";

export const useArtworkCount = (cartItem: ICartItem) => {
  const [artworkCount, setArtworkCount] = useState(0);

  useEffect(() => {
    const fetchArtworkCount = async () => {
      try {
        let count = 0;
        if (cartItem.hasArtworkFiles) {
          const files = await getArtworkFiles(cartItem.id);
          count = files?.length || 0;
        }
        if (cartItem.hasArtworkFilesMap) {
          const filesMap = await getArtworkFilesMap(
            cartItem.id,
            cartItem.artworkLabels || []
          );
          count = filesMap
            ? Object.values(filesMap).reduce(
                (acc, files) => acc + files.length,
                0
              )
            : 0;
        }
        setArtworkCount(count);
      } catch (error) {
        console.error("Error fetching artwork count:", error);
      }
    };

    if (
      cartItem.isCustomizable &&
      (cartItem.hasArtworkFiles || cartItem.hasArtworkFilesMap)
    ) {
      fetchArtworkCount();
    }
  }, [
    cartItem.id,
    cartItem.hasArtworkFiles,
    cartItem.hasArtworkFilesMap,
    cartItem.isCustomizable,
    cartItem.artworkLabels,
  ]);

  return artworkCount;
};
