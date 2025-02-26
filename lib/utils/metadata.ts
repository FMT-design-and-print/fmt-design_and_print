import { headers } from "next/headers";
import { baseUrl, bannerImage } from "@/constants";
import { Metadata } from "next";

export async function getBaseUrl() {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const headersList = await headers();
  return `${protocol}://${headersList.get("host") || baseUrl}`;
}

type GenerateOGImageOptions = {
  title: string;
  tag: string;
  type: string;
  fallbackImage?: string;
  previewImages?: string[];
  theme?: "light" | "dark";
};

export async function generateOGImage({
  title,
  tag,
  type,
  fallbackImage = bannerImage,
  previewImages = [],
  theme = "light",
}: GenerateOGImageOptions): Promise<string> {
  try {
    const currentBaseUrl = await getBaseUrl();
    const ogImageUrl = new URL("/api/og", currentBaseUrl);

    // Add all parameters
    ogImageUrl.searchParams.set("title", title);
    ogImageUrl.searchParams.set("tag", tag);
    ogImageUrl.searchParams.set("type", type);
    ogImageUrl.searchParams.set("theme", theme);

    // Add preview images (limit to 4)
    previewImages.slice(0, 4).forEach((img, index) => {
      ogImageUrl.searchParams.set(`preview${index + 1}`, img);
    });

    // Add cache busting parameter
    ogImageUrl.searchParams.set("t", Date.now().toString());

    return ogImageUrl.toString();
  } catch {
    return fallbackImage;
  }
}

export function addMetadataCacheControl(metadata: Metadata): Metadata {
  // Add timestamp directly to the generateOGImage URL
  return metadata;
}
