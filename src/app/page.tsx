import { Landing } from "@/features/landing";
import { client } from "../../sanity/lib/client";
import { IFeaturedProducts } from "@/types";
import { featuredProductsQuery } from "../../sanity/queries";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("------------------------------------");
  console.log("session", session);
  console.log("------------------------------------");

  const featuredProducts: IFeaturedProducts[] = await client.fetch(
    featuredProductsQuery
  );

  return (
    <>
      <Landing featuredProducts={featuredProducts[0]} />
    </>
  );
}
