import { Landing } from "@/features/landing";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { featuredProductsQuery } from "@/sanity/queries";
import { recentProductsQuery } from "@/sanity/queries/products";
import { categoriesQuery } from "@/sanity/queries/categories";
import { ICategory, IFeaturedProducts, IPrintProduct } from "@/types";

export default async function Home() {
  await redirectAdminUser();

  // Fetch data in parallel for better performance
  const [productsData, categoriesData, recentProductsData] = await Promise.all([
    client.fetch(featuredProductsQuery),
    client.fetch(categoriesQuery),
    client.fetch(recentProductsQuery),
  ]);

  const featuredProducts: IFeaturedProducts[] = productsData || [];
  const printCategories: ICategory[] = categoriesData || [];
  const recentProducts: IPrintProduct[] = recentProductsData || [];

  return (
    <>
      <Landing
        featuredProducts={featuredProducts[0]}
        categories={printCategories}
        recentProducts={recentProducts}
      />
    </>
  );
}
