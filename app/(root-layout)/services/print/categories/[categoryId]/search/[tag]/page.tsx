import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import {
  getAllProductsInCategoryByTagQuery,
  getProductSortOrder,
} from "@/sanity/queries/products";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";
import { fmtDescription } from "@/constants";
import {
  generateOGImage,
  addMetadataCacheControl,
} from "@/lib/utils/metadata";

type Params = Promise<{
  categoryId: string;
  productType: string;
  tag: string;
}>;

type SearchParams = Promise<{
  sort?: string;
  dir?: string;
  from?: string;
  to?: string;
}>;

async function getProducts(
  categoryId: string,
  tag: string,
  sortOrder: string = "order(_createdAt desc)",
  startDate: string | null = null,
  endDate: string | null = null
): Promise<IPrintProduct[]> {
  const query = getAllProductsInCategoryByTagQuery(sortOrder);
  return client.fetch(query, {
    slug: categoryId,
    itemTag: formatString(decodeURIComponent(tag)),
    startDate,
    endDate,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { categoryId, tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const sortOrder = getProductSortOrder("date", "desc");
  const products = await getProducts(categoryId, decodedTag, sortOrder);

  // Use product type if available, otherwise use formatted category
  const typeTitle = products[0]?.type.title || formatString(categoryId);
  const title = `${decodedTag} ${typeTitle} | FMT Design and Print`;

  // Get valid image URLs from products, or empty array if no products
  const productImages = products
    ? products
        .filter((product) => product.image)
        .map((product) => product.image)
        .slice(0, 4)
    : [];

  const imageUrl = await generateOGImage({
    title,
    tag: decodedTag,
    type: formatString(categoryId),
    fallbackImage: productImages[0],
    previewImages: productImages,
  });

  const metadata = generateMetaDetails(title, fmtDescription, imageUrl);
  return addMetadataCacheControl(metadata);
}

const CategorySearchPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  await redirectAdminUser();
  const { categoryId, tag } = await params;
  const { sort, dir, from, to } = await searchParams;

  const sortOrder = getProductSortOrder(sort, dir);
  const products: IPrintProduct[] = await getProducts(
    categoryId,
    tag,
    sortOrder,
    from || null,
    to || null
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
