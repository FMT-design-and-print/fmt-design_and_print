import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import React from "react";

interface Props {
  params: {
    categoryId: string;
    productType: string;
  };
}

const ProductTypePage = ({ params }: Props) => {
  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: params?.categoryId?.replaceAll("-", " "),
      href: `/services/print/categories/${params.categoryId}`,
    },
    {
      title: params?.productType?.replaceAll("-", " "),
      href: `/services/print/categories/${params.productType}`,
    },
  ];

  return (
    <div>
      <BreadcrumbRenderer items={items} />
      <ProductType />
    </div>
  );
};

export default ProductTypePage;
