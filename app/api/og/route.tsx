import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "FMT Design and Print";
    const tag = searchParams.get("tag");
    const type = searchParams.get("type");

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
            backgroundColor: "#1a1b1e",
            padding: "40px 60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            {tag && type && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    color: "#868e96",
                  }}
                >
                  {tag} • {type}
                </span>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
