import { AllServices } from "@/features/services";
import React from "react";
import { client } from "../../../sanity/lib/client";
import { IProductType } from "@/types";
import { groupProductTypesByCategory } from "@/functions";
import { productTypesQuery } from "@/queries";

export const revalidate = 0;

const AllServicesPage = async () => {
  const productTypes: IProductType[] = await client.fetch(productTypesQuery);

  const groupedProductTypes = groupProductTypesByCategory(productTypes);

  return (
    <>
      <AllServices printCategoriesWithProductTypes={groupedProductTypes} />
    </>
  );
};

export default AllServicesPage;
