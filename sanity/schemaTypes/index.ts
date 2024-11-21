import { type SchemaTypeDefinition } from 'sanity';
import designService from './graphic';
import designTypes from './graphic/designTypes';
import printService from './print';
import colors from './print/colors';
import colorVariation from './print/colorVariation';
import { featuredProducts } from './print/featuredProducts';
import galleryImage from './print/galleryImage';
import giftsAndPackages from './print/giftsAndPackages';
import itemImage from './print/itemImage';
import printCategories from './print/printCategories';
import productTags from './print/productTags';
import productTypes from './print/productTypes';
import professionTags from './print/professionTags';
import sizes from './print/sizes';
import tShirtPrintTypes from './print/tshirtPrintTypes';

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

    featuredProducts,

    designService,
    designTypes,

    // ---------------
    itemImage,
    galleryImage,
    colorVariation,
  ],
};
