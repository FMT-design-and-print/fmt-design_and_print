import { headers } from "next/headers";
import { baseUrl, bannerImage } from "@/constants";

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
};

export async function generateOGImage({
  title,
  tag,
  type,
  fallbackImage = bannerImage,
}: GenerateOGImageOptions): Promise<string> {
  try {
    const currentBaseUrl = await getBaseUrl();
    const ogImageUrl = new URL("/api/og", currentBaseUrl);
    ogImageUrl.searchParams.set("title", title);
    ogImageUrl.searchParams.set("tag", tag);
    ogImageUrl.searchParams.set("type", type);
    return ogImageUrl.toString();
  } catch {
    return fallbackImage;
  }
}
