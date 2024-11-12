import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductType } from "@/features/services/ProductType";
import { formatString } from "@/functions";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/lib/client";
import { productsByTagQuery } from "@/queries/products";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";

type Params = Promise<{
  categoryId: string;
  productType: string;
  tag: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { productType, tag } = await params;
  return {
    title: `${decodeURIComponent(tag)} ${productType} | FMT Design and Print`,
  };
}

const CodingShirtsPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();

  const { categoryId, productType, tag } = await params;

  const products: IPrintProduct[] = await client.fetch(productsByTagQuery, {
    slug: productType,
    itemTag: formatString(decodeURIComponent(tag)),
  });

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

export default CodingShirtsPage;
