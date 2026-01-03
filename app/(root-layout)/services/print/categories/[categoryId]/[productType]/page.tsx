import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import {
  getPrintProductsByTypeQuery,
  getProductSortOrder,
} from "@/sanity/queries/products";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";
import { Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { fmtDescription } from "@/constants";
import {
  generateOGImage,
  addMetadataCacheControl,
} from "@/lib/utils/metadata";

export const revalidate = 0;

type Params = Promise<{
  categoryId: string;
  productType: string;
}>;

type SearchParams = Promise<{
  sort?: string;
  dir?: string;
  from?: string;
  to?: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { productType } = await params;
  const formattedType = formatString(productType).replace(/-/g, " ");

  const sortOrder = getProductSortOrder("date", "desc");
  const query = getPrintProductsByTypeQuery(sortOrder);

  const products = await client.fetch(query, {
    slug: productType,
    startDate: null,
    endDate: null,
  });

  // Use product type if available, otherwise use formatted URL parameter
  const typeTitle = products[0]?.type.title || formattedType;
  const title = `${typeTitle} | FMT Design and Print`;

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
    type: formatString(productType),
    fallbackImage: productImages[0],
    previewImages: productImages,
  });

  const metadata = generateMetaDetails(title, fmtDescription, imageUrl);
  return addMetadataCacheControl(metadata);
}

const ProductTypePage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  await redirectAdminUser();
  const { productType, categoryId } = await params;
  const { sort, dir, from, to } = await searchParams;

  const sortOrder = getProductSortOrder(sort, dir);
  const query = getPrintProductsByTypeQuery(sortOrder);

  const products: IPrintProduct[] = await client.fetch(query, {
    slug: productType,
    startDate: from || null,
    endDate: to || null,
  });

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: products[0]?.category.title,
      href: `/services/print/categories/${categoryId}`,
    },
    {
      title: products[0]?.type.title,
      href: `/services/print/categories/${categoryId}/${productType}`,
    },
  ];

  return (
    <div>
      <BreadcrumbRenderer items={items} />
      <Text ta="right" mx="xl" size="sm" py="md">
        Click{" "}
        <Link href={`/custom-request/${productType}`}>
          <Text component="span" c="pink">
            here
          </Text>
        </Link>{" "}
        to make custom {productType} print request.
      </Text>

      <ProductType products={products} />
    </div>
  );
};

export default ProductTypePage;
