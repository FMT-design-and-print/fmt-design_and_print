import { productKeywords } from "@/constants/all-product_keywords";
import { CustomRequest } from "@/features/custom-request";
import { CustomRequestPageRenderer } from "@/features/custom-request/Renderer";
import { Container } from "@mantine/core";
import { redirect } from "next/navigation";
import { Banner } from "../Banner";
import { Metadata } from "next";
import { formatString } from "@/functions";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

type Params = Promise<{
  productType: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { productType } = await params;
  return {
    title: formatString(productType),
  };
}

const CustomRequestPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { productType } = await params;

  const product = productType;

  if (!productKeywords.includes(product)) {
    redirect("/custom-request");
  }
  return (
    <>
      <Container size="xl">
        <CustomRequest>
          <Banner name={product} />
          <CustomRequestPageRenderer name={product} />
        </CustomRequest>
      </Container>
    </>
  );
};

export default CustomRequestPage;
