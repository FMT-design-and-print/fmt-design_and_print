import React from "react";
import { Container, Text, Divider, Title } from "@mantine/core";
import { Metadata } from "next";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const metadata: Metadata = {
  title: "Artwork help | FMT Design and Print",
};

const ArtworkHelpPage = async () => {
  await redirectAdminUser();

  return (
    <Container size="sm">
      <Title order={1} ta="center" my={20}>
        Artwork Help Page
      </Title>
      <Divider style={{ margin: "0 auto 20px" }} />

      <Text size="md" my={20}>
        If you&apos;re not a graphic designer or don&apos;t have an art degree,
        submitting artwork for your custom print request may seem daunting.
        We&apos;re here to provide valuable guidance on how to send us your
        unique design.
      </Text>

      <Text size="lg" fw={700} my={10}>
        Questions to Ask Yourself
      </Text>
      <Text size="md" my={20}>
        To ensure you have the best artwork ready for submission, ask yourself
        the following questions:
      </Text>

      <Text size="md" my={20}>
        <strong>Do I Have High Quality Artwork?</strong>
        It may be challenging to determine if your artwork is in the correct
        format for submission. Ensure your file has one of the following
        extensions: .jpg, .png, .pdf, .ai, or .eps. While .jpg and .pdf are
        acceptable, .ai or .eps files are preferred as they transfer more
        clearly onto your product without appearing blurry or pixelated.
      </Text>

      <Text size="lg" fw={700} my={10}>
        Converting File Types
      </Text>
      <Text size="md" my={20}>
        Unsure how to change your file type? Our Design Team can help! They can
        convert your files into a vectored format, preserving the quality of
        your design and ensuring your logo looks its best.
      </Text>

      <Text size="md" my={20}>
        If you have any questions or need further assistance with your artwork,
        please don&apos;t hesitate to contact our Design Team at
        design@fmtdesignandprint.com.
      </Text>
    </Container>
  );
};

export default ArtworkHelpPage;
