export type ItemSize = {
  width: number;
  height: number;
  unit: "mm" | "cm" | "inch" | "ft";
};

export type BaseItem = {
  id: string;
  name: string;
};

export type PrintType = BaseItem & {
  category: "banner" | "sticker";
  rate: number;
};

export type BannersStickersSettings = {
  printTypes: PrintType[];
  units: string[];
};

export type CustomizedItem = BaseItem & {
  price: number;
  minQuantity?: number;
};

export type CustomizedItemsSettings = {
  items: CustomizedItem[];
};

export type FrameSize = BaseItem & {
  width: number;
  height: number;
  price: number;
  unit: ItemSize["unit"];
};

export type FrameType = BaseItem & {
  sizes: FrameSize[];
};

export type FramingSettings = {
  frameTypes: FrameType[];
};

export type OtherItem = BaseItem & {
  price: number;
};

export type OtherCategory = BaseItem & {
  items: OtherItem[];
};

export type OthersSettings = {
  categories: OtherCategory[];
};

export type CalculatorSettings = {
  id: string;
  display_name: string;
  description?: string;
  options:
    | BannersStickersSettings
    | CustomizedItemsSettings
    | FramingSettings
    | OthersSettings;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Category =
  | "banners-stickers"
  | "customized-items"
  | "card-printing"
  | "framing"
  | "plain-items"
  | "others";

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

export type PlainItem = BaseItem & {
  price: number;
};

export type PlainItemsSettings = {
  items: PlainItem[];
};

export type PredefinedSize = {
  name: string;
  width: number;
  height: number;
};
