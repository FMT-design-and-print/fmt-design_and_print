import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { allProductsInCategoryByTagQuery } from "@/sanity/queries/products";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";
import { baseUrl } from "@/constants";

type Params = Promise<{
  categoryId: string;
  productType: string;
  tag: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { categoryId, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const title = `${decodedTag} ${categoryId} | FMT Design and Print`;
  const ogImageUrl = new URL("/api/og", baseUrl);
  ogImageUrl.searchParams.set("title", title);
  ogImageUrl.searchParams.set("tag", decodedTag);
  ogImageUrl.searchParams.set("type", categoryId);

  return {
    ...generateMetaDetails(title, undefined, ogImageUrl.toString()),
  };
}

const CategorySearchPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { categoryId, tag } = await params;

  const products: IPrintProduct[] = await client.fetch(
    allProductsInCategoryByTagQuery,
    {
      slug: categoryId,
      itemTag: formatString(decodeURIComponent(tag)),
    }
  );

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: products[0]?.category.title || categoryId,
      href: `/services/print/categories/${categoryId}`,
    },
    {
      title: decodeURIComponent(tag),
      href: ``,
    },
  ];

  return (
    <div>
      <BreadcrumbRenderer items={items} />
      <ProductType products={products} />
    </div>
  );
};

export default CategorySearchPage;
