import { authors, bannerImage, fmtDescription, keywords } from "@/constants";
import { Metadata } from "next";

const defaultTitle = "FMT Design and Print — Design and Printing Services";

export const generateMetaDetails = (
  title?: string,
  description?: string,
  image?: string
): Metadata => {
  return {
    title: title || defaultTitle,
    description: description || fmtDescription,
    authors,
    keywords,
    colorScheme: "light",
    openGraph: {
      title: title || defaultTitle,
      description: description || fmtDescription,
      siteName: "FMT Design and Print",
      locale: "en_US",
      url: "https://fmtdesignprint.com",
      images: [image || bannerImage],
    },

    twitter: {
      card: "summary_large_image",
      title: title || defaultTitle,
      description: description || fmtDescription,
      images: [image || bannerImage],
    },
  };
};
