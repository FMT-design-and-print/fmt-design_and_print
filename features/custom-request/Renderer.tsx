"use client";
import React from "react";
import { TShirts } from "./ProductTypes/TShirts";
import {
  apronsKeywords,
  bagKeywords,
  bottlesKeywords,
  capKeywords,
  designsKeywords,
  frameKeywords,
  hoodieKeywords,
  lacosteKeywords,
  mugKeywords,
  phoneCaseKeywords,
  pillowKeywords,
  tShirtKeywords,
} from "@/constants/all-product_keywords";
import { Mugs } from "./ProductTypes/Mugs";
import { Caps } from "./ProductTypes/Caps";
import { productImages } from "@/constants/images";
import { Frames } from "./ProductTypes/Frames";
import { Aprons } from "./ProductTypes/Aprons";
import { DesignWorks } from "./ProductTypes/DesignWorks";
import { Bags } from "./ProductTypes/Bags";
import { Lacoste } from "./ProductTypes/Lacoste";
import { Hoodies } from "./ProductTypes/Hoodies";
import { PhoneCases } from "./ProductTypes/PhoneCases";
import { Pillows } from "./ProductTypes/Pillows";
import { Bottles } from "./ProductTypes/Bottles";
import { UnspecifiedProduct } from "./ProductTypes/Unspecified";

interface Props {
  name: string;
}
export const CustomRequestPageRenderer = ({ name }: Props) => {
  const productName = name.toLowerCase();

  if (tShirtKeywords.includes(productName)) {
    return <TShirts image={productImages.tShirts} />;
  }

  if (lacosteKeywords.includes(productName)) {
    return <Lacoste image={productImages.lacoste} />;
  }

  if (hoodieKeywords.includes(productName)) {
    return <Hoodies image={productImages.hoodies} />;
  }

  if (mugKeywords.includes(productName)) {
    return <Mugs image={productImages.mugs} />;
  }

  if (capKeywords.includes(productName)) {
    return <Caps image={productImages.caps} />;
  }

  if (frameKeywords.includes(productName)) {
    return <Frames image={productImages.frames} />;
  }

  if (apronsKeywords.includes(productName)) {
    return <Aprons image={productImages.aprons} />;
  }

  if (designsKeywords.includes(productName)) {
    return <DesignWorks image={productImages.designWorks} />;
  }

  if (bagKeywords.includes(productName)) {
    return <Bags image={productImages.bags} />;
  }

  if (phoneCaseKeywords.includes(productName)) {
    return <PhoneCases image={productImages.phoneCases} />;
  }

  if (pillowKeywords.includes(productName)) {
    return <Pillows image={productImages.pillows} />;
  }

  if (bottlesKeywords.includes(productName)) {
    return <Bottles image={productImages.bottles} />;
  }

  return <UnspecifiedProduct image="" />;
};
