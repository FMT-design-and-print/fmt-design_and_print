import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/lib/client";
import { productsByTagQuery } from "@/queries/products";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";

interface Props {
  params: {
    categoryId: string;
    productType: string;
    tag: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${formatString(params.tag)} ${params.productType} | FMT Design and Print`,
  };
}

const CodingShirtsPage = async ({ params }: Props) => {
  await redirectAdminUser();

  const products: IPrintProduct[] = await client.fetch(productsByTagQuery, {
    slug: params.productType,
    itemTag: formatString(params.tag),
  });

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: products[0]?.category.title || params.categoryId,
      href: `/services/print/categories/${params.categoryId}`,
    },
    {
      title: products[0]?.type.title || params.productType,
      href: `/services/print/categories/${params.categoryId}/${params.productType}`,
    },
    {
      title: params.tag,
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

export default CodingShirtsPage;
