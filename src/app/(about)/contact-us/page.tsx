import React from "react";
import { ContactUs } from "./ContactUs";
import { Card, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | FMT Design and Print",
};

const ContactUsPage = () => {
  return (
    <>
      <ContactUs />

      <Card withBorder w={{ base: "100%", md: "80%" }} mx="auto" my="xl">
        <Title order={2} my="lg" py="lg">
          Locate Our Reception Office
        </Title>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.4400514007584!2d-0.23934432413191717!3d5.649298132702642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9f053a966a4d%3A0x193223cfa6b6eb4f!2sFMT%20Design%20and%20Print!5e0!3m2!1sen!2sgh!4v1709653706709!5m2!1sen!2sgh"
          width="100%"
          height="450"
          style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Card>
    </>
  );
};

export default ContactUsPage;
