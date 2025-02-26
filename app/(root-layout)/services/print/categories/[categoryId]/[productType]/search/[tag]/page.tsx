import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { productsByTagQuery } from "@/sanity/queries/products";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";
import { fmtDescription } from "@/constants";
import { generateOGImage, addMetadataCacheControl } from "@/lib/utils/metadata";

type Params = Promise<{
  categoryId: string;
  productType: string;
  tag: string;
}>;

async function getProducts(
  productType: string,
  tag: string
): Promise<IPrintProduct[]> {
  return client.fetch(productsByTagQuery, {
    slug: productType,
    itemTag: formatString(decodeURIComponent(tag)),
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { productType, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const formattedType = formatString(productType).replace(/-/g, " ");

  const products = await getProducts(productType, decodedTag);

  // Use product type if available, otherwise use formatted URL parameter
  const typeTitle = products[0]?.type.title || formattedType;
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
    tag: formatString(decodedTag),
    type: formatString(productType),
    fallbackImage: productImages[0],
    previewImages: productImages,
  });

  const metadata = generateMetaDetails(title, fmtDescription, imageUrl);
  return addMetadataCacheControl(metadata);
}

const ProductTypeSearchPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { categoryId, productType, tag } = await params;

  const products: IPrintProduct[] = await getProducts(productType, tag);

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: products[0]?.category.title || categoryId,
      href: `/services/print/categories/${categoryId}`,
    },
    {
      title: products[0]?.type.title || productType,
      href: `/services/print/categories/${categoryId}/${productType}`,
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

export default ProductTypeSearchPage;
