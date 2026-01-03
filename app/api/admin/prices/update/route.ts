import { writableClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  products: z.array(z.string()).min(1),
  updateType: z.enum(["fixed", "percentage"]),
  priceValue: z.number(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parse = schema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json(
      { success: false, errors: parse.error.flatten() },
      { status: 400 }
    );
  }

  const { products, updateType, priceValue } = parse.data;

  const summary = {
    totalProducts: products.length,
    updatedProducts: 0,
    skippedProducts: 0,
    oldPrices: {} as Record<string, number>,
    newPrices: {} as Record<string, number>,
  };

  try {
    for (const id of products) {
      const doc = (await writableClient.getDocument(id)) as {
        _id: string;
        title?: string;
        price?: number;
      } | null;
      if (!doc?._id) {
        summary.skippedProducts++;
        continue;
      }

      const oldPrice = doc.price ?? 0;
      let newPrice =
        updateType === "percentage"
          ? Math.round(oldPrice * (1 + priceValue / 100) * 100) / 100
          : priceValue;

      if (Math.abs(oldPrice - newPrice) < 0.01) {
        summary.skippedProducts++;
        continue;
      }

      summary.oldPrices[doc.title ?? doc._id] = oldPrice;
      summary.newPrices[doc.title ?? doc._id] = newPrice;

      await writableClient.patch(doc._id).set({ price: newPrice }).commit();
      summary.updatedProducts++;
    }

    return NextResponse.json({
      success: true,
      message: "Prices updated successfully",
      summary,
    });
  } catch (error) {
    console.error("Price update failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update prices", error },
      { status: 500 }
    );
  }
}
