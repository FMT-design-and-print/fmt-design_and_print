import { Landing } from "@/features/landing";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/lib/client";
import { featuredProductsQuery } from "@/queries";
// import { IFeaturedProducts } from "@/types";

export const revalidate = 0;

export default async function Home() {
  await redirectAdminUser();
  // let featuredProducts: IFeaturedProducts[] = [];

  const [{ data: featuredProducts }] = await Promise.all([
    client.fetch(featuredProductsQuery),
  ]);

  //  featuredProducts = products;

  console.log(featuredProducts);

  return (
    <>
      <Landing featuredProducts={featuredProducts[0]} />
    </>
  );
}
