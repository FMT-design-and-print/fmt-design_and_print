import { Container } from "@mantine/core";
import { CustomRequestItems } from "./Items";
import { Suspense } from "react";

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
