import React from "react";
import { TShirts } from "./TShirts";
import { tShirtKeywords } from "@/constants/all-product_keywords";

interface Props {
  name: string;
}
export const CustomRequestPageRenderer = ({ name }: Props) => {
  const productName = name.toLowerCase();
  if (tShirtKeywords.includes(productName)) {
    return <TShirts />;
  }

  return <div>Renderer</div>;
};
