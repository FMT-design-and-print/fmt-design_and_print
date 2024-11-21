import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { redirect } from "next/navigation";

type Params = Promise<{
  categoryId: string;
}>;

const CategorySearchPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { categoryId } = await params;

  redirect(`/services/print/categories/${categoryId}`);
};

export default CategorySearchPage;
