import { Landing } from "@/features/landing";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/lib/client";
import { featuredProductsQuery } from "@/queries";
import { IFeaturedProducts } from "@/types";

export const revalidate = 0;

export default async function Home() {
  await redirectAdminUser();
  let featuredProducts: IFeaturedProducts[] = [];

  try {
    featuredProducts = await client.fetch(featuredProductsQuery);
    console.log(featuredProducts);
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <Landing featuredProducts={featuredProducts[0]} />
    </>
  );
}
