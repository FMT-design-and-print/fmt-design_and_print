export type MessageStatus = "error" | "success" | "info";

export interface ICategory {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  image: string;
  icon: string;
}

export interface ITag {
  id: string;
  name: string;
}

export interface ITags {
  productTags: ITag[];
  professionTags: ITag[];
}

export interface IProductType {
  id: string;
  title: string;
  slug: string;
  image: string;
  description?: any; // TODO: change to correct type
  orderRequestSample?: any; // TODO: change to correct type
  category: {
    id: string;
    slug: string;
    title: string;
  };
}

export type FeaturedItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  type: IProductType;
  category: ICategory;
};
export interface IFeaturedProducts {
  tShirts: FeaturedItem[];
  hoodies: FeaturedItem[];
  mugs: FeaturedItem[];
  frames: FeaturedItem[];
}

export type ProductColor = {
  id: string;
  title: string;
  hex: string;
  image: string;
};

export interface IPrintProduct extends FeaturedItem {
  productNumber?: string;
  color?: ProductColor;
  gallery?: string[];
  description?: string;
  details?: any; // TODO: replace with correct type
  colors?:
    | {
        id: string;
        image: string;
        color: ProductColor;
      }[]
    | null;
  sizes?: string[] | null;
  tags: string[];
  gender?: string;
  isForKids?: boolean;
}

export interface ICartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  timestamp: Date;
  color?: ProductColor;
  size?: string;
  notes?: string;
}

export type GroupedPrintProductTypes = Record<
  string,
  {
    title: string;
    slug: string;
    items: IProductType[];
  }
>;

export type SearchItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  category?: {
    id: string;
    slug: string;
    title: string;
  };
  type?: {
    id: string;
    slug: string;
    title: string;
  };
};

export type SelectedProductOptions = {
  productId: string;
  image: string;
  size: string;
  quantity: number;
  color?: ProductColor;
  note?: string;
};

export interface IOptionsErrors {
  color?: string;
  size?: string;
  quantity?: string;
}

export interface CheckoutDetails {
  orderId: string;
  paymentType: "momo" | "card" | "cod" | "";
  fullName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  region: string;
  discount?: number;
  discountCode?: string;
  shippingFee?: number;
  items: ICartItem[];
}
