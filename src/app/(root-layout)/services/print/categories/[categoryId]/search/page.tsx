import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { redirect } from "next/navigation";

interface Props {
  params: {
    categoryId: string;
  };
}

const CategorySearchPage = async ({ params }: Props) => {
  await redirectAdminUser();

  redirect(`/services/print/categories/${params.categoryId}`);
};

export default CategorySearchPage;
