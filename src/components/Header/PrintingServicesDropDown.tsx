"use client";

import { BsPen } from "react-icons/bs";
import { TbCards, TbGift, TbMug, TbPaperBag, TbShirt } from "react-icons/tb";
import { ServicesDropDown } from "./ServicesDropDown";

const mockData = [
  {
    icon: TbShirt,
    title: "T Shirts & Apparels",
    description: "T-Shirts, Lacoste, Hoodies, Caps, Hats, Covers, others ",
    link: "#",
  },
  {
    icon: TbMug,
    title: "Cups, Mugs, Bottles",
    description: "Ceramic Mugs, Magic Mugs, Water Bottles, Cups",
    link: "#",
  },
  {
    icon: BsPen,
    title: "Souvenirs",
    description: "Keyholders, Pens, Diaries, stickers, Others",
    link: "#",
  },
  {
    icon: TbCards,
    title: "Branding",
    description:
      "Flyers, Labels, Brochures, Posters, Cards, Car Decals, Signages, Others ",
    link: "#",
  },
  {
    icon: TbGift,
    title: "Gift and Packages",
    description: "Items in gift boxes and other custom packages",
    link: "#",
  },
  {
    icon: TbPaperBag,
    title: "Others",
    description: "Frames, Phone Cases, Bags, Puzzle, Plaques, more",
    link: "#",
  },
];

export const PrintingServicesDropDown = () => {
  return (
    <ServicesDropDown
      title="Print Services"
      link="/services/print"
      items={mockData}
    />
  );
};
