import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import PrintCategory from "@/features/services/PrintCategory";
import { formatString } from "@/functions";
import { client } from "@/lib/client";
import { filteredProductTypesQuery } from "@/queries";
import { printProductsQuery } from "@/queries/products";
import { IPrintProduct, IProductType } from "@/types";
import { Metadata } from "next";

export const revalidate = 0;

interface Props {
  params: {
    categoryId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: formatString(params.categoryId) + " | FMT Design and Print ",
  };
}

const PrintCategoryPage = async ({ params }: Props) => {
  const productTypes: IProductType[] = await client.fetch(
    filteredProductTypesQuery,
    {
      slug: params.categoryId,
    }
  );

  const products: IPrintProduct[] = await client.fetch(printProductsQuery, {
    slug: params.categoryId,
  });

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: `${productTypes[0]?.category.title}`,
      href: `/services/print/categories/${params.categoryId}`,
    },
  ];

  return (
    <>
      <BreadcrumbRenderer items={items} />
      <PrintCategory productTypes={productTypes} printProducts={products} />
    </>
  );
};

export default PrintCategoryPage;
