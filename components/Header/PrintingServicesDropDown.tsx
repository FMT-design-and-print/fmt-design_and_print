"use client";
import { useCategories } from "@/hooks/useCategories";
import { ServicesDropDown } from "./ServicesDropDown";

export const PrintingServicesDropDown = () => {
  const { categories } = useCategories();

  return (
    <ServicesDropDown
      title="Print Services"
      link="/services"
      items={
        categories
          ? categories.map((item) => ({
              ...item,
              link: `/services/print/categories/${item.slug}`,
            }))
          : []
      }
    />
  );
};
