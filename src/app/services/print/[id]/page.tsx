import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { NotFound } from "@/components/NotFound";
import { ProductDetails } from "@/features/product-details";
import { client } from "@/lib/client";
import { singleProductQuery } from "@/queries";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product: IPrintProduct = await client.fetch(singleProductQuery, {
    id: params.id,
  });

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

const ProductDetailsPage = async ({ params: { id } }: Props) => {
  const product: IPrintProduct = await client.fetch(singleProductQuery, {
    id,
  });

  if (product == null) {
    return <NotFound />;
  }

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
