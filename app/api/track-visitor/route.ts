import { createAdminClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({ success: true });
  }

  try {
    const body = await request.json();
    const { visitorId, ip, country, city, region, userAgent, url, referrer } =
      body;

    if (!visitorId || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Upsert Visitor
    const { error: visitorError } = await supabase.from("visitors").upsert(
      {
        visitor_id: visitorId,
        ip_address: ip,
        country,
        city,
        region,
        user_agent: userAgent,
        last_visit: new Date().toISOString(),
        // We use a simplified increment logic or just let the client send count?
        // Better to handle count increment here if possible, but upsert overwrites.
        // For simplicity, we'll just update the last_visit and location info.
        // We can handle visit_count by fetching first or using a stored procedure,
        // but for now let's just ensure the record exists.
      },
      { onConflict: "visitor_id" }
    );

    if (visitorError) {
      console.error("Error updating visitor:", visitorError);
      return NextResponse.json(
        { error: "Failed to track visitor" },
        { status: 500 }
      );
    }

    // 2. Insert Page View
    const { error: pageViewError } = await supabase.from("page_views").insert({
      visitor_id: visitorId,
      url,
      referrer,
    });

    if (pageViewError) {
      console.error("Error tracking page view:", pageViewError);
      return NextResponse.json(
        { error: "Failed to track page view" },
        { status: 500 }
      );
    }

    // 3. Increment visit count (optional, can be done with a separate query or trigger)
    // For now, we'll leave it simple.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
