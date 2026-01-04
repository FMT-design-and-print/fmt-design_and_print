import { NextResponse } from "next/server";
import { writableClient } from "@/sanity/lib/client";
import { z } from "zod";

const schema = z.object({
  categoryId: z.string(),
  productTypeId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parse = schema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, errors: parse.error.flatten() },
        { status: 400 }
      );
    }

    const { categoryId, productTypeId } = parse.data;

    const query = `*[_type == "printService" && references($categoryId) && references($productTypeId)]{
      "_id": _id,
      category->{"title": title},
      type->{"title": title}
    }`;

    const docs = await writableClient.fetch(
      query,
      { categoryId, productTypeId },
      { perspective: "previewDrafts" } as any
    );

    const products: string[] = (docs || []).map((d: any) => d._id);
    const categoryName = docs?.[0]?.category?.title || undefined;
    const productTypeName = docs?.[0]?.type?.title || undefined;

    return NextResponse.json({
      success: true,
      products,
      categoryName,
      productTypeName,
    });
  } catch (error) {
    console.error("Failed to resolve products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to resolve products", error },
      { status: 500 }
    );
  }
}
