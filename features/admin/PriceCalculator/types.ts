export type ItemSize = {
  width: number;
  height: number;
  unit: "mm" | "cm" | "inch" | "ft";
};

export type PredefinedSize = {
  name: string;
  width: number;
  height: number;
};

export type FrameSize = {
  id: string;
  name: string;
  width: number;
  height: number;
  price: number;
  unit: "mm" | "cm" | "inch";
};

export type FrameType = {
  id: string;
  name: string;
  sizes: FrameSize[];
};

export type CustomizedItem = {
  id: string;
  name: string;
  price: number;
  minQuantity?: number;
};

export type PlainItem = {
  id: string;
  name: string;
  price: number;
};

export type Category =
  | "banners-stickers"
  | "customized-items"
  | "card-printing"
  | "framing"
  | "plain-items"
  | "others";

export type PrintType = {
  id: string;
  name: string;
  category: "banner" | "sticker";
  rate: number;
};

export type CalculationHistory = {
  id: string;
  timestamp: number;
  category: Category;
  details: {
    printType?: string;
    size?: {
      width: number;
      height: number;
      unit: string;
    };
    quantity: number;
    rate?: number;
    total: number;
  };
};

export type CalculationHistoryStore = {
  [key in Category]: CalculationHistory[];
};

export type PredefinedOtherItem = {
  id: string;
  name: string;
  price: number;
  category:
    | "pressing"
    | "jersey"
    | "envelope"
    | "lamination"
    | "photo"
    | "paper"
    | "design";
};
