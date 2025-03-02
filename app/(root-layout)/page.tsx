import { Landing } from "@/features/landing";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { featuredProductsQuery } from "@/sanity/queries";
import { categoriesQuery } from "@/sanity/queries/categories";
import { ICategory, IFeaturedProducts } from "@/types";

export default async function Home() {
  await redirectAdminUser();

  // Fetch data in parallel for better performance
  const [productsData, categoriesData] = await Promise.all([
    client.fetch(featuredProductsQuery),
    client.fetch(categoriesQuery),
  ]);

  const featuredProducts: IFeaturedProducts[] = productsData || [];
  const printCategories: ICategory[] = categoriesData || [];

  return (
    <>
      <Landing
        featuredProducts={featuredProducts[0]}
        categories={printCategories}
      />
    </>
  );
}
