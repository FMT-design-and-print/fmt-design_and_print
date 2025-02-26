import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

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

          {previewImages.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  previewImages.length > 1 ? "1fr 1fr" : "1fr",
                gap: 20,
                marginTop: 40,
                width: "100%",
                maxWidth: 800,
              }}
            >
              {previewImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
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
      }
    );
  } catch {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
