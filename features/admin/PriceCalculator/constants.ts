import {
  PredefinedSize,
  FrameType,
  CustomizedItem,
  PlainItem,
  PrintType,
  PredefinedOtherItem,
} from "./types";

export const CURRENCY_SYMBOL = "₵";

export const PREDEFINED_SIZES: PredefinedSize[] = [
  { name: "A6", width: 105, height: 148 },
  { name: "A5", width: 148, height: 210 },
  { name: "A4", width: 210, height: 297 },
  { name: "A3", width: 297, height: 420 },
  { name: "A2", width: 420, height: 594 },
  { name: "A1", width: 594, height: 841 },
  { name: "A0", width: 841, height: 1189 },
];

export const FRAME_TYPES: FrameType[] = [
  {
    id: "frame-with-glass",
    name: "Frame with Glass",
    sizes: [
      {
        id: "a6-glass",
        name: "A6",
        width: 10.5,
        height: 14.8,
        price: 20,
        unit: "cm",
      },
      {
        id: "a5-glass",
        name: "A5",
        width: 14.8,
        height: 21.0,
        price: 30,
        unit: "cm",
      },
      {
        id: "20x25-glass",
        name: "20 x 25",
        width: 20,
        height: 25,
        price: 50,
        unit: "cm",
      },
      {
        id: "a4-glass",
        name: "A4",
        width: 21.0,
        height: 29.7,
        price: 60,
        unit: "cm",
      },
      {
        id: "a3-glass",
        name: "A3",
        width: 29.7,
        height: 42.0,
        price: 120,
        unit: "cm",
      },
      {
        id: "a2-glass",
        name: "A2",
        width: 42.0,
        height: 59.4,
        price: 230,
        unit: "cm",
      },
      {
        id: "a1-glass",
        name: "A1",
        width: 59.4,
        height: 84.1,
        price: 450,
        unit: "cm",
      },
      {
        id: "a0-glass",
        name: "A0",
        width: 84.1,
        height: 118.9,
        price: 800,
        unit: "cm",
      },
    ],
  },
  {
    id: "glossy-gold-lining-edges-canvas",
    name: "Glossy gold lining edges canvas lamination",
    sizes: [
      {
        id: "a4-gold",
        name: "A4",
        width: 210,
        height: 297,
        price: 30,
        unit: "mm",
      },
      {
        id: "a3-gold",
        name: "A3",
        width: 297,
        height: 420,
        price: 45,
        unit: "mm",
      },
      {
        id: "a2-gold",
        name: "A2",
        width: 420,
        height: 594,
        price: 60,
        unit: "mm",
      },
    ],
  },
  {
    id: "glossy-canvas-lamination",
    name: "Glossy Canvas Lamination",
    sizes: [
      {
        id: "a4-canvas",
        name: "A4",
        width: 210,
        height: 297,
        price: 20,
        unit: "mm",
      },
      {
        id: "a3-canvas",
        name: "A3",
        width: 297,
        height: 420,
        price: 30,
        unit: "mm",
      },
      {
        id: "a2-canvas",
        name: "A2",
        width: 420,
        height: 594,
        price: 45,
        unit: "mm",
      },
    ],
  },
];

export const CUSTOMIZED_ITEMS: CustomizedItem[] = [
  {
    id: "tshirt-front",
    name: "Short sleeve T-Shirt (Front Only)",
    price: 50,
    minQuantity: 1,
  },
  {
    id: "tshirt-both",
    name: "Short sleeve T-Shirt (Front and Back)",
    price: 60,
    minQuantity: 1,
  },
  {
    id: "lacoste-front",
    name: "Lacoste (Front Only)",
    price: 60,
    minQuantity: 1,
  },
  {
    id: "lacoste-both",
    name: "Lacoste (Front and Back)",
    price: 70,
    minQuantity: 1,
  },
  {
    id: "ceramic-mug",
    name: "Ceramic Mug",
    price: 20,
    minQuantity: 1,
  },
  {
    id: "magic-mug",
    name: "Magic Mug",
    price: 30,
    minQuantity: 1,
  },
  {
    id: "cap-with-dtf",
    name: "Cap with DTF",
    price: 30,
    minQuantity: 10,
  },
  {
    id: "key-ring",
    name: "Key Ring",
    price: 15,
    minQuantity: 12,
  },
];

export const PLAIN_ITEMS: PlainItem[] = [
  { id: "t-shirt", name: "T-Shirt", price: 26 },
  { id: "jersey-shirt", name: "Jersey Shirt", price: 19 },
  { id: "lacoste", name: "Lacoste", price: 40 },
  { id: "ceramic-mug", name: "Ceramic Mug", price: 15 },
  { id: "magic-mug", name: "Magic Mug", price: 20 },
  { id: "white-pen", name: "White Pen 50pcs", price: 100 },
];

export const PRINT_TYPES: PrintType[] = [
  // Banners
  { id: "flexi", name: "Flexi", category: "banner", rate: 5 },
  { id: "pvc", name: "PVC", category: "banner", rate: 9.5 },

  // Stickers
  { id: "sav-print", name: "SAV Print Only", category: "sticker", rate: 5.0 },
  {
    id: "sav-print-cut",
    name: "SAV Print and Cut",
    category: "sticker",
    rate: 5.5,
  },
  { id: "one-way", name: "One Way Vision", category: "sticker", rate: 6.0 },
  {
    id: "transparent",
    name: "Transparent Print Only",
    category: "sticker",
    rate: 6.0,
  },
  {
    id: "transparent-cut",
    name: "Transparent Print and Cut",
    category: "sticker",
    rate: 6.5,
  },
];

export const PREDEFINED_OTHER_ITEMS: PredefinedOtherItem[] = [
  // Pressing
  {
    id: "pressing-front",
    name: "Pressing front only",
    price: 5,
    category: "pressing",
  },
  {
    id: "pressing-both",
    name: "Pressing front and back",
    price: 10,
    category: "pressing",
  },

  // Jersey
  { id: "jersey-letter", name: "Jersey letter", price: 3, category: "jersey" },
  { id: "jersey-number", name: "Jersey number", price: 6, category: "jersey" },

  // Envelopes
  {
    id: "a4-brown-env",
    name: "A4 brown envelope",
    price: 2,
    category: "envelope",
  },
  {
    id: "a3-brown-env",
    name: "A3 brown envelope",
    price: 4,
    category: "envelope",
  },
  {
    id: "a4-white-env",
    name: "A4 white envelope",
    price: 2,
    category: "envelope",
  },
  {
    id: "a3-white-env",
    name: "A3 white envelope",
    price: 4,
    category: "envelope",
  },

  // Lamination
  {
    id: "a4-lamination",
    name: "A4 Lamination",
    price: 3,
    category: "lamination",
  },
  {
    id: "a3-lamination",
    name: "A3 Lamination",
    price: 5,
    category: "lamination",
  },

  // Photo
  {
    id: "passport-photo",
    name: "Passport photo",
    price: 20,
    category: "photo",
  },
  { id: "a5-photo-paper", name: "A5 Photo paper", price: 6, category: "photo" },
  {
    id: "a4-photo-paper",
    name: "A4 Photo paper",
    price: 10,
    category: "photo",
  },
  {
    id: "a3-photo-paper",
    name: "A3 Photo paper",
    price: 20,
    category: "photo",
  },

  // Papers
  { id: "a5-art-card", name: "A5 Art Card", price: 2, category: "paper" },
  { id: "a4-art-card", name: "A4 Art Card", price: 4, category: "paper" },
  { id: "a3-art-card", name: "A3 Art Card", price: 7, category: "paper" },
  { id: "a5-art-paper", name: "A5 Art paper", price: 2, category: "paper" },
  { id: "a4-art-paper", name: "A4 Art paper", price: 3, category: "paper" },
  { id: "a3-art-paper", name: "A3 Art paper", price: 6, category: "paper" },
  {
    id: "a4-plain-bw",
    name: "A4 Plain paper Black and white",
    price: 1,
    category: "paper",
  },
  {
    id: "a4-plain-color",
    name: "A4 Plain paper Colored",
    price: 2,
    category: "paper",
  },
  {
    id: "a3-plain-bw",
    name: "A3 Plain paper Black and white",
    price: 2,
    category: "paper",
  },
  {
    id: "a3-plain-color",
    name: "A3 Plain paper Colored",
    price: 4,
    category: "paper",
  },

  // Design
  { id: "flyer-design", name: "Flyer Design", price: 50, category: "design" },
  { id: "logo-design", name: "Logo Design", price: 150, category: "design" },
];
