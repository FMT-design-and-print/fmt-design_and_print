import { Landing } from "@/features/landing";
import { client } from "../../sanity/lib/client";
import { IFeaturedProducts } from "@/types";
import { featuredProductsQuery } from "../../sanity/queries";

export const revalidate = 0;

export default async function Home() {
  const featuredProducts: IFeaturedProducts[] = await client.fetch(
    featuredProductsQuery
  );

  return (
    <>
      <Landing featuredProducts={featuredProducts[0]} />
    </>
  );
}
