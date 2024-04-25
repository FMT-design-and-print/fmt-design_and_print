import { Container } from "@mantine/core";
import React from "react";
import { Banner } from "./Banner";
import { productKeywords } from "@/constants/all-product_keywords";
import { redirect } from "next/navigation";
import { CustomRequest } from "@/features/custom-request";
import { CustomRequestPageRenderer } from "@/features/custom-request/Renderer";

interface Props {
  searchParams: {
    product: string;
  };
}

const CustomRequestPage = ({ searchParams }: Props) => {
  const product = searchParams.product;

  if (!product) {
    return <>No product Found</>;
  }

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
