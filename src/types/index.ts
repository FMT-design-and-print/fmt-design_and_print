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
