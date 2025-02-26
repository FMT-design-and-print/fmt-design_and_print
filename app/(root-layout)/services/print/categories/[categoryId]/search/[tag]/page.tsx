import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { allProductsInCategoryByTagQuery } from "@/sanity/queries/products";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";
import { fmtDescription } from "@/constants";
import { generateOGImage } from "@/lib/utils/metadata";

type Params = Promise<{
  categoryId: string;
  productType: string;
  tag: string;
}>;

async function getProducts(
  categoryId: string,
  tag: string
): Promise<IPrintProduct[]> {
  return client.fetch(allProductsInCategoryByTagQuery, {
    slug: categoryId,
    itemTag: formatString(decodeURIComponent(tag)),
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { categoryId, tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const products = await getProducts(categoryId, decodedTag);
  const title = `${decodedTag} ${products[0]?.type.title} | FMT Design and Print`;

  const imageUrl = await generateOGImage({
    title,
    tag: decodedTag,
    type: categoryId,
    fallbackImage: products[0]?.image,
  });

  return {
    ...generateMetaDetails(title, fmtDescription, imageUrl),
  };
}

const CategorySearchPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { categoryId, tag } = await params;

  const products: IPrintProduct[] = await getProducts(categoryId, tag);

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
