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
  colors?: {
    id: string;
    image: string;
    color: ProductColor;
  }[];
  sizes?: string[];
  tags: string[];
  gender?: string;
  isForKids?: boolean;
}

export type GroupedPrintProductTypes = Record<
  string,
  {
    title: string;
    slug: string;
    items: IProductType[];
  }
>;
