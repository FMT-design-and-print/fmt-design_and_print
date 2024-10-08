import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/lib/client";
import { printProductsByTypeQuery } from "@/queries/products";
import { IPrintProduct } from "@/types";
import { Text } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const revalidate = 0;

interface Props {
  params: {
    categoryId: string;
    productType: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: formatString(params.productType) + " | FMT Design and Print",
  };
}

const ProductTypePage = async ({ params }: Props) => {
  await redirectAdminUser();

  const products: IPrintProduct[] = await client.fetch(
    printProductsByTypeQuery,
    {
      slug: params.productType,
    }
  );

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: products[0]?.category.title,
      href: `/services/print/categories/${params.categoryId}`,
    },
    {
      title: products[0]?.type.title,
      href: `/services/print/categories/${params.categoryId}/${params.productType}`,
    },
  ];

  return (
    <div>
      <BreadcrumbRenderer items={items} />
      <Text ta="right" mx="xl" size="sm" py="md">
        Click{" "}
        <Link href={`/custom-request/${params.productType}`}>
          <Text component="span" c="pink">
            here
          </Text>
        </Link>{" "}
        to make custom {params.productType} print request.
      </Text>

      <ProductType products={products} />
    </div>
  );
};

export default ProductTypePage;
