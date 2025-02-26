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
            padding: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <img
              src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703264782/FMT/logo1_tpiges.png"
              alt="FMT Logo"
              style={{
                width: 120,
                height: 120,
                marginBottom: 16,
              }}
            />
            <h1
              style={{
                fontSize: 48,
                fontWeight: 800,
                textAlign: "center",
                color: isDark ? "#ffffff" : "#000000",
                margin: 0,
                lineHeight: 1.2,
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
                  fontSize: 24,
                  color: isDark ? "#d1d1d1" : "#666666",
                  margin: 0,
                }}
              >
                {tag} • {type}
              </p>
            </div>
          </div>

          {absolutePreviewImages.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                marginTop: 32,
                width: "100%",
                maxWidth: 800,
                justifyContent: "center",
              }}
            >
              {absolutePreviewImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preview ${i + 1}`}
                  style={{
                    width: 160,
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 8,
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
