import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import PrintCategory from "@/features/services/PrintCategory";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { filteredProductTypesQuery } from "@/sanity/queries";
import { printProductsQuery } from "@/sanity/queries/products";
import { IPrintProduct, IProductType } from "@/types";
import { Metadata } from "next";

export const revalidate = 0;

type Params = Promise<{
  categoryId: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { categoryId } = await params;
  return {
    ...generateMetaDetails(
      formatString(categoryId) + " | FMT Design and Print "
    ),
  };
}

const PrintCategoryPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { categoryId } = await params;

  const productTypes: IProductType[] = await client.fetch(
    filteredProductTypesQuery,
    {
      slug: categoryId,
    }
  );

  const products: IPrintProduct[] = await client.fetch(printProductsQuery, {
    slug: categoryId,
  });

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: `${productTypes[0]?.category.title}`,
      href: `/services/print/categories/${categoryId}`,
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
