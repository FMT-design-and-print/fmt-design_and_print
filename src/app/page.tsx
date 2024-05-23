import { Landing } from "@/features/landing";
import { IFeaturedProducts } from "@/types";
import { client } from "../../sanity/lib/client";
import { featuredProductsQuery } from "../../sanity/queries";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const revalidate = 0;

export default async function Home() {
  await redirectAdminUser();

  const featuredProducts: IFeaturedProducts[] = await client.fetch(
    featuredProductsQuery
  );

  return (
    <>
      <Landing featuredProducts={featuredProducts[0]} />
    </>
  );
}
