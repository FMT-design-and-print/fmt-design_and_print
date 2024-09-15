import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/lib/client";
import { allProductsInCategoryByTagQuery } from "@/queries/products";
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
    title: `${decodeURIComponent(params.tag)} ${params.categoryId} | FMT Design and Print`,
  };
}

const CodingShirtsPage = async ({ params }: Props) => {
  await redirectAdminUser();

  const products: IPrintProduct[] = await client.fetch(
    allProductsInCategoryByTagQuery,
    {
      slug: params.categoryId,
      itemTag: formatString(decodeURIComponent(params.tag)),
    }
  );

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: products[0]?.category.title || params.categoryId,
      href: `/services/print/categories/${params.categoryId}`,
    },
    {
      title: decodeURIComponent(params.tag),
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
