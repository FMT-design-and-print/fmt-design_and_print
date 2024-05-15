import { Container } from "@mantine/core";
import { CustomRequestItems } from "./Items";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Request | FMT Design and Print",
};

const CustomRequestPage = () => {
  return (
    <Suspense fallback={<></>}>
      <Container size="xl">
        <CustomRequestItems />
      </Container>
    </Suspense>
  );
};

export default CustomRequestPage;
