import { BreadcrumbRenderer } from "@/components/BreadcrumbRenderer";
import PrintCategory from "@/features/services/PrintCategory";

interface Props {
  params: {
    categoryId: string;
  };
}

const PrintCategoryPage = ({ params }: Props) => {
  const items = [
    { title: "Printing Services", href: "/services?st=print" },
    {
      title: `${params.categoryId.replaceAll("-", " ")}`,
      href: `/services/print/categories/${params.categoryId}`,
    },
  ];

  return (
    <>
      <BreadcrumbRenderer items={items} />
      <PrintCategory />
    </>
  );
};

export default PrintCategoryPage;
