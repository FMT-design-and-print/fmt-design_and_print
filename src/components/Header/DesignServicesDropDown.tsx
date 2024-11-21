"use client";
import { ServicesDropDown } from "./ServicesDropDown";

const mockData = [
  {
    icon: "",
    title: "Flyers",
    tagline: "T-Shirts, Lacoste, Hoodies, Caps, Hats, Covers, others ",
    link: "#",
  },
  {
    icon: "",
    title: "Labels",
    tagline: "Ceramic Mugs, Magic Mugs, Water Bottles, Cups",
    link: "#",
  },
  {
    icon: "",
    title: "Brochure",
    tagline: "Keyholders, Pens, Diaries, stickers, Others",
    link: "#",
  },
  {
    icon: "",
    title: "Logo",
    tagline:
      "Flyers, Labels, Brochures, Posters, Cards, Car Decals, Signages, Others ",
    link: "#",
  },
  {
    icon: "",
    title: "3D",
    tagline: "Items in gift boxes and other custom packages",
    link: "#",
  },
  {
    icon: "",
    title: "Infographics",
    tagline: "Frames, Phone Cases, Bags, Puzzle, Plaques, more",
    link: "#",
  },
];

export const DesignServicesDropDown = () => {
  return (
    <ServicesDropDown
      title="Design Services"
      link="/services?st=design"
      items={mockData}
    />
  );
};
