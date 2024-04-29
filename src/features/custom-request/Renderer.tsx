"use client";
import React from "react";
import { TShirts } from "./ProductTypes/TShirts";
import {
  apronsKeywords,
  capKeywords,
  designsKeywords,
  frameKeywords,
  mugKeywords,
  tShirtKeywords,
} from "@/constants/all-product_keywords";
import { Mugs } from "./ProductTypes/Mugs";
import { Caps } from "./ProductTypes/Caps";
import { useCustomRequest } from ".";
import { productImages } from "@/constants/images";
import { Frames } from "./ProductTypes/Frames";
import { Aprons } from "./ProductTypes/Aprons";
import { DesignWorks } from "./ProductTypes/DesignWorks";

interface Props {
  name: string;
}
export const CustomRequestPageRenderer = ({ name }: Props) => {
  const context = useCustomRequest();

  const productName = name.toLowerCase();
  if (tShirtKeywords.includes(productName)) {
    context?.setProductImageUrl(productImages.tShirts);
    return <TShirts />;
  }

  if (mugKeywords.includes(productName)) {
    context?.setProductImageUrl(productImages.mugs);
    return <Mugs />;
  }

  if (capKeywords.includes(productName)) {
    context?.setProductImageUrl(productImages.caps);
    return <Caps />;
  }

  if (frameKeywords.includes(productName)) {
    context?.setProductImageUrl(productImages.frames);
    return <Frames />;
  }

  if (apronsKeywords.includes(productName)) {
    context?.setProductImageUrl(productImages.aprons);
    return <Aprons />;
  }

  if (designsKeywords.includes(productName)) {
    context?.setProductImageUrl(productImages.designWorks);
    return <DesignWorks />;
  }

  return <></>;
};
