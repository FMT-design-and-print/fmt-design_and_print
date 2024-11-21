import { Landing } from "@/features/landing";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { featuredProductsQuery } from "@/sanity/queries";
import { IFeaturedProducts } from "@/types";

export default async function Home() {
  await redirectAdminUser();

  const products = await client.fetch(featuredProductsQuery);

  const featuredProducts: IFeaturedProducts[] = products || [];

  return (
    <>
      <Landing featuredProducts={featuredProducts[0]} />
    </>
  );
}
