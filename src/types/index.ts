export type MessageStatus = "error" | "success" | "info";

export interface ICategory {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  image: string;
  icon: string;
}

export type FeaturedItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  type: {
    slug: string;
    title: string;
  };
  category: {
    slug: string;
    title: string;
  };
};
export interface IFeaturedProducts {
  tShirts: FeaturedItem[];
  hoodies: FeaturedItem[];
  mugs: FeaturedItem[];
  frames: FeaturedItem[];
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

export type GroupedPrintProductTypes = Record<
  string,
  {
    title: string;
    slug: string;
    items: IProductType[];
  }
>;
