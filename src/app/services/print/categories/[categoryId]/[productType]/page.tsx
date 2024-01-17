import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { client } from "@/lib/client";
import { printProductsByTypeQuery } from "@/queries/products";
import { IPrintProduct } from "@/types";
import React from "react";

export const revalidate = 0;

interface Props {
  params: {
    categoryId: string;
    productType: string;
  };
}

const ProductTypePage = async ({ params }: Props) => {
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
      href: `/services/print/categories/${params.productType}`,
    },
  ];

  return (
    <div>
      <BreadcrumbRenderer items={items} />
      <ProductType products={products} />
    </div>
  );
};

export default ProductTypePage;
