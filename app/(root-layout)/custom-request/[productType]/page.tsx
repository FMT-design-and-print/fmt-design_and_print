import { CustomRequest } from "@/features/custom-request";
import { CustomRequestPageRenderer } from "@/features/custom-request/Renderer";
import { formatString } from "@/functions";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Container } from "@mantine/core";
import { Metadata } from "next";
import { Banner } from "../Banner";

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
    ...generateMetaDetails(formatString(productType)),
  };
}

const CustomRequestPage = async ({ params }: { params: Params }) => {
  await redirectAdminUser();
  const { productType } = await params;

  const product = productType;

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
