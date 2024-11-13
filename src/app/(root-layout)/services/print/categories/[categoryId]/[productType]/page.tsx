import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/lib/client";
import { printProductsByTypeQuery } from "@/queries/products";
import { IPrintProduct } from "@/types";
import { Text } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const revalidate = 0;

type Params = Promise<{
  categoryId: string;
  productType: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { productType } = await params;
  return {
    ...generateMetaDetails(
      formatString(productType) + " | FMT Design and Print "
    ),
  };
}

const ProductTypePage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { productType, categoryId } = await params;

  const products: IPrintProduct[] = await client.fetch(
    printProductsByTypeQuery,
    {
      slug: productType,
    }
  );

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
