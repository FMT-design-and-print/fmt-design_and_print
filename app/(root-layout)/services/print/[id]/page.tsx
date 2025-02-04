import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { NotFound } from "@/components/NotFound";
import { ProductDetails } from "@/features/product-details";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";
import { singleProductQuery } from "@/sanity/queries";
import { IPrintProduct } from "@/types";
import { Metadata } from "next";
import { ProductRating } from "@/features/ratings/ProductRating";
import { ProductReviews } from "@/features/ratings/ProductReviews";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

type Params = Promise<{
  id: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;

  const product: IPrintProduct = await client.fetch(singleProductQuery, {
    id,
  });

  return {
    ...generateMetaDetails(product?.title, product?.description, product.image),
  };
}

const ProductDetailsPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ProductRating productId={id} user={user} />
        <ProductReviews productId={id} user={user} />
      </div>
    </>
  );
};

export default ProductDetailsPage;
