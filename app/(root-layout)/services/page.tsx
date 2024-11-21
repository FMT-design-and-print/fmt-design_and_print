import { AllServices } from "@/features/services";
import React from "react";
import { IProductType } from "@/types";
import { groupProductTypesByCategory } from "@/functions";
import { liveProductTypesQuery } from "@/sanity/queries";
import { Metadata } from "next";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Services | FMT Design and Print",
};

export const revalidate = 0;

const AllServicesPage = async () => {
  await redirectAdminUser();

  const productTypes: IProductType[] = await client.fetch(
    liveProductTypesQuery
  );

  const groupedProductTypes = groupProductTypesByCategory(productTypes);

  return (
    <>
      <AllServices printCategoriesWithProductTypes={groupedProductTypes} />
    </>
  );
};

export default AllServicesPage;
