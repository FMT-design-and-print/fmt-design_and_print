import { AllServices } from "@/features/services";
import React from "react";
import { client } from "../../../sanity/lib/client";
import { productTypesQuery } from "../../../sanity/queries/product-types";
import { IProductType } from "@/types";
import { groupProductTypesByCategory } from "@/functions";

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
