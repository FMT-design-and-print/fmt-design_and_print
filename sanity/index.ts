import { type SchemaTypeDefinition } from "sanity";
import printService from "./schemas/print";
import designService from "./schemas/graphic";
import giftsAndPackages from "./schemas/print/giftsAndPackages";
import printCategories from "./schemas/print/printCategories";
import productTypes from "./schemas/print/productTypes";
import tShirtColors from "./schemas/print/tshirtColors";
import tShirtSizes from "./schemas/print/tshirtSizes";
import tShirtPrintTypes from "./schemas/print/tshirtPrintTypes";
import tagList from "./schemas/print/tags";
import itemImage from "./schemas/print/itemImage";
import galleryImage from "./schemas/print/galleryImage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    printService,
    giftsAndPackages,
    printCategories,
    productTypes,
    tShirtColors,
    tShirtSizes,
    tShirtPrintTypes,
    tagList,
    designService,

    // ---------------
    itemImage,
    galleryImage,
  ],
};
