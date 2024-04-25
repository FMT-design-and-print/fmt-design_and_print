import React from "react";
import { TShirts } from "./ProductTypes/TShirts";
import { mugKeyWords, tShirtKeywords } from "@/constants/all-product_keywords";
import { Mugs } from "./ProductTypes/Mugs";

interface Props {
  name: string;
}
export const CustomRequestPageRenderer = ({ name }: Props) => {
  const productName = name.toLowerCase();
  if (tShirtKeywords.includes(productName)) {
    return <TShirts />;
  }

  if (mugKeyWords.includes(productName)) {
    return <Mugs />;
  }

  return <div>Renderer</div>;
};
