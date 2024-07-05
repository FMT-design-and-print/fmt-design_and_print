import { ReactNode } from "react";
import { Permission } from "./roles";

export type MessageStatus = "error" | "success" | "info";
export type CouponType = "percentage" | "fixed" | "free-shipping";
export type CouponStatus = "expired" | "active" | "disabled";
export type ArtworkOption =
  | "own-artwork"
  | "fmt-to-provide"
  | "no-artwork-needed";

export type QuoteReceptionMedium = "email" | "whatsapp" | "sms";

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
  relatedProducts: FeaturedItem[];
  otherProducts: FeaturedItem[];
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
  note?: string;
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

export interface IShippingAddress {
  id?: string;
  contactName: string;
  email?: string;
  phone1: string;
  phone2?: string;
  country: string;
  address: string;
  region: string;
  town?: string;
}

export interface CheckoutDetails extends IShippingAddress {
  orderId: string;
  paymentType: "momo" | "card" | "cod" | "";
  discount?: number;
  discountCode?: string;
  deliveryFee?: number;
  items: ICartItem[];
  note?: string;
  saveAddress?: boolean;
  deliveryType: "pickup" | "delivery";
}

export interface IFavoriteItem {
  id: string;
  title: string;
  price: number;
  image: string;
}

export type IAdminNavItems =
  | {
      value: string;
      label: string;
      icon: ReactNode;
      isVisible: boolean;
      component: ReactNode;
      requiredPermission?: Permission;
    }
  | "divider";
