import { fmtDescription } from "@/constants";
import { ColorSchemeScript } from "@mantine/core";
import Head from "next/head";
import React from "react";

const title = "FMT Design and Print";

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

export const MetaHead = (props: Props) => {
  return (
    <Head>
      <ColorSchemeScript defaultColorScheme="light" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://fmtdesignprint.com" />
      <meta property="og:title" content={props.title || title} />
      <meta
        property="og:description"
        content={props.description || fmtDescription}
      />
      <meta
        property="og:image"
        content={
          props.image ||
          "https://res.cloudinary.com/dnbmynikp/image/upload/v1715768873/FMT/FMT-meta-bg_wu3gjc.png"
        }
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://fmtdesignprint.com" />
      <meta property="twitter:title" content={props.title || title} />
      <meta
        property="twitter:description"
        content={props.description || fmtDescription}
      />
      <meta
        property="twitter:image"
        content={
          props.image ||
          "https://res.cloudinary.com/dnbmynikp/image/upload/v1715768873/FMT/FMT-meta-bg_wu3gjc.png"
        }
      />
    </Head>
  );
};
