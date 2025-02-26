import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Ensure fonts are loaded
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get all parameters
    const title = searchParams.get("title") ?? "";
    const tag = searchParams.get("tag") ?? "";
    const type = searchParams.get("type") ?? "";
    const theme = searchParams.get("theme") ?? "light";

    // Get preview images
    const previewImages = [
      searchParams.get("preview1"),
      searchParams.get("preview2"),
      searchParams.get("preview3"),
      searchParams.get("preview4"),
    ].filter((url): url is string => url !== null);

    // Log the image URLs for debugging
    console.log("Preview Images:", previewImages);

    const isDark = theme === "dark";

    // Ensure all image URLs are absolute
    const absolutePreviewImages = previewImages.map((url) => {
      try {
        return new URL(url).toString();
      } catch {
        // If URL is relative, assume it's from Sanity CDN
        return url.startsWith("http") ? url : `https://cdn.sanity.io${url}`;
      }
    });

    console.log("Generating OG image with:", {
      title,
      tag,
      type,
      theme,
      images: absolutePreviewImages,
    });

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            padding: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: 800,
                textAlign: "center",
                color: isDark ? "#ffffff" : "#000000",
              }}
            >
              {title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <p
                style={{
                  fontSize: 30,
                  color: isDark ? "#d1d1d1" : "#666666",
                }}
              >
                {tag} • {type}
              </p>
            </div>
          </div>

          {absolutePreviewImages.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  absolutePreviewImages.length > 1 ? "1fr 1fr" : "1fr",
                gap: 20,
                marginTop: 40,
                width: "100%",
                maxWidth: 800,
              }}
            >
              {absolutePreviewImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preview ${i + 1}`}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
