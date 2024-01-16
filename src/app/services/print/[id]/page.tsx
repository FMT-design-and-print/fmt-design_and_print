import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductDetails } from "@/features/product-details";
import { client } from "@/lib/client";
import { singleProductQuery } from "@/queries";
import { IPrintProduct } from "@/types";

interface Props {
  params: {
    id: string;
  };
}

const ProductDetailsPage = async ({ params: { id } }: Props) => {
  const product: IPrintProduct = await client.fetch(singleProductQuery, {
    id,
  });

  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: product.category.title,
      href: `/services/print/categories/${product.category.slug}`,
    },
    {
      title: product.type.title,
      href: `/services/print/categories/${product.category.slug}/${product.type.slug}`,
    },
    { title: product.title, href: `/services/print/${id}` },
  ];

  return (
    <>
      <BreadcrumbRenderer items={items} />
      <ProductDetails product={product} />
    </>
  );
};

export default ProductDetailsPage;
