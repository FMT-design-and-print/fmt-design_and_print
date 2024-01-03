import { type SchemaTypeDefinition } from "sanity";
import printService from "./schemas/print";
import designService from "./schemas/graphic";
import giftsAndPackages from "./schemas/print/giftsAndPackages";
import printCategories from "./schemas/print/printCategories";
import productTypes from "./schemas/print/productTypes";
import colors from "./schemas/print/colors";
import sizes from "./schemas/print/sizes";
import tShirtPrintTypes from "./schemas/print/tshirtPrintTypes";
import itemImage from "./schemas/print/itemImage";
import galleryImage from "./schemas/print/galleryImage";
import colorVariation from "./schemas/print/colorVariation";
import productTags from "./schemas/print/productTags";
import professionTags from "./schemas/print/professionTags";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    printService,
    giftsAndPackages,
    printCategories,
    productTypes,

    colors,
    sizes,
    productTags,
    professionTags,

    tShirtPrintTypes,
    designService,

    // ---------------
    itemImage,
    galleryImage,
    colorVariation,
  ],
};
