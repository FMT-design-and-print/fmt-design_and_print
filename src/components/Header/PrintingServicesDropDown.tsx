"use client";
import { useCategories } from "@/hooks/useCategories";
import { Center, Loader } from "@mantine/core";
import { ServicesDropDown } from "./ServicesDropDown";

export const PrintingServicesDropDown = () => {
  const { isLoading, categories } = useCategories();

  if (isLoading) {
    return (
      <Center>
        <Loader size="xs" color="pink" />
      </Center>
    );
  }

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
