import { Landing } from "@/features/landing";
// import { IFeaturedProducts } from "@/types";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
// import { client } from "@/lib/client";
// import { featuredProductsQuery } from "@/queries";

const defaultFeaturedProducts = {
  tShirts: [],
  hoodies: [],
  mugs: [],
  frames: [],
};

export const revalidate = 0;

export default async function Home() {
  await redirectAdminUser();

  // const featuredProducts: IFeaturedProducts[] = await client.fetch(
  //   featuredProductsQuery
  // );

  return (
    <>
      <Landing featuredProducts={defaultFeaturedProducts} />
    </>
  );
}
