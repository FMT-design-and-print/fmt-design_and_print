import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import { ProductDetails } from "@/features/product-details";

interface Props {
  params: {
    slug: string;
  };
}
/* <>print / Category / Product Type / Product Name </> */
/* <>print / T-Shirts and Apparels / Hoodies / Black T-shirt </> */

const ProductDetailsPage = ({ params: { slug } }: Props) => {
  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: "T-Shirts and Apparels",
      href: `/services/print/categories/t-shirts-and-apparels`,
    },
    {
      title: "T-Shirts",
      href: `/services/print/categories/t-shirts-and-apparels/t-shirts`,
    },
    { title: "Black T-shirt", href: `/services/print/${slug}` },
  ];

  return (
    <>
      <BreadcrumbRenderer items={items} />
      <ProductDetails />
    </>
  );
};

export default ProductDetailsPage;
