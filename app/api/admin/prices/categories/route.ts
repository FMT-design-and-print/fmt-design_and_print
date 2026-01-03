import { NextResponse } from "next/server";
import { writableClient } from "@/sanity/lib/client";

export async function GET() {
    try {
        const query = `*[_type == "printCategories"] {
      "id": _id,
      title,
      "productCount": count(*[_type == "printService" && references(^._id)]),
      "productTypes": *[_type == "productTypes" && references(^._id)] {
        "id": _id,
        title,
        "productCount": count(*[_type == "printService" && references(^._id)])
      }
    }`;

        const results = await writableClient.fetch(query, {}, { perspective: "drafts" } as any);
        const filtered = (results || []).filter((cat: any) => cat.productCount > 0);
        return NextResponse.json({ success: true, categories: filtered });
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch categories", error },
            { status: 500 }
        );
    }
}
