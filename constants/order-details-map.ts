import { ArtworkOption } from "@/types";

export const mapOrderDetailsKeyToLabel = (key: string) => {
  switch (key) {
    case "artworks":
      return "Provided artworks";
    case "quantity":
      return "Quantity";
    case "artworkOption":
      return "Artwork provision";
    case "quoteReceptionMedium":
      return "Quote Reception medium";
    case "quoteReceptionValue":
      return "Quote to be received via";
    case "instructions":
      return "Design instructions";
    case "brand":
      return "Brand";
    case "side":
      return "Side";
    case "printType":
      return "Print Type";
    case "sleeveType":
      return "Sleeve";
    default:
      return key;
  }
};

export const artworkOptionLabelMap: Record<ArtworkOption, string> = {
  "own-artwork": "User to provide their own artwork",
  "fmt-to-provide": "FMT to provide artwork",
  "no-artwork-needed": "No artwork needed",
};
