import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import PrintCategory from "@/features/services/PrintCategory";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { filteredProductTypesQuery } from "@/sanity/queries";
import { printProductsQuery } from "@/sanity/queries/products";
import { IPrintProduct, IProductType } from "@/types";
import { Metadata } from "next";
import { fmtDescription } from "@/constants";
import { generateOGImage, addMetadataCacheControl } from "@/lib/utils/metadata";

export const revalidate = 0;

type Params = Promise<{
  categoryId: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { categoryId } = await params;
  const formattedCategory = formatString(categoryId).replace(/-/g, " ");

  const products = await client.fetch(printProductsQuery, {
    slug: categoryId,
  });

  const productTypes = await client.fetch(filteredProductTypesQuery, {
    slug: categoryId,
  });

  // Use category title if available, otherwise use formatted URL parameter
  const categoryTitle = productTypes[0]?.category.title || formattedCategory;
  const title = `${categoryTitle} | FMT Design and Print`;

  // Get valid image URLs from products, or empty array if no products
  const productImages = products
    ? products
        .filter((product: IPrintProduct) => product.image)
        .map((product: IPrintProduct) => product.image)
        .slice(0, 4)
    : [];

  const imageUrl = await generateOGImage({
    title,
    tag: "",
    type: formatString(categoryId),
    fallbackImage: productImages[0],
    previewImages: productImages,
  });

  const metadata = generateMetaDetails(title, fmtDescription, imageUrl);
  return addMetadataCacheControl(metadata);
}

const PrintCategoryPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { categoryId } = await params;

  const productTypes: IProductType[] = await client.fetch(
    filteredProductTypesQuery,
    {
      slug: categoryId,
    }
  );

  const products: IPrintProduct[] = await client.fetch(printProductsQuery, {
    slug: categoryId,
  });

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: `${productTypes[0]?.category.title}`,
      href: `/services/print/categories/${categoryId}`,
    },
  ];

  return (
    <>
      <BreadcrumbRenderer items={items} />
      <PrintCategory productTypes={productTypes} printProducts={products} />
    </>
  );
};

export default PrintCategoryPage;
