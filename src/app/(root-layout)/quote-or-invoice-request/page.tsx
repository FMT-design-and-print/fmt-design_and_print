import { Container } from "@mantine/core";
import React from "react";
import { Banner } from "./Banner";
import { Form } from "./Form";

const QuoteOrInvoiceRequestPage = () => {
  return (
    <Container size="xl">
      <Banner />
      <Form />
    </Container>
  );
};

export default QuoteOrInvoiceRequestPage;
