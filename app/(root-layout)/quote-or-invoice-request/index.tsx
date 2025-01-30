"use client";
import React, { useState } from "react";
import { Form } from "./Form";
import { Container } from "@mantine/core";
import { Banner } from "./Banner";
import { RequestSuccess } from "./RequestSuccess";

const QuoteOrInvoiceRequest = () => {
  const [screen, setScreen] = useState<"request" | "success">("request");

  return (
    <Container size="xl">
      {screen === "request" ? (
        <>
          <Banner />
          <Form setScreen={setScreen} />
        </>
      ) : (
        <RequestSuccess setScreen={setScreen} />
      )}
    </Container>
  );
};

export default QuoteOrInvoiceRequest;
