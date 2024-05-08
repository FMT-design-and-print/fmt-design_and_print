import { productKeywords } from "@/constants/all-product_keywords";
import { CustomRequest } from "@/features/custom-request";
import { CustomRequestPageRenderer } from "@/features/custom-request/Renderer";
import { Container } from "@mantine/core";
import { redirect } from "next/navigation";
import { Banner } from "../Banner";

interface Props {
  params: {
    productType: string;
  };
}

const CustomRequestPage = ({ params }: Props) => {
  const product = params.productType;

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
