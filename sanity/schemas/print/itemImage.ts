import { SchemaTypeDefinition } from "sanity";

const itemImage: SchemaTypeDefinition = {
  name: "itemImage",
  title: "Product Image Details",
  type: "image",
  fields: [
    {
      name: "caption",
      title: "Caption",
      type: "string",
    },
    {
      name: "color",
      title: "Color",
      type: "reference",
      to: [{ type: "colors" }],
      hidden: ({ parent }) => parent?.ownColor,
    },
    {
      name: "ownColor",
      title: "Can't find the color in the list? Enter my own color",
      type: "boolean",
    },
    {
      name: "ownColorName",
      title: "Color Name",
      type: "string",
      hidden: ({ parent }) => !parent?.ownColor,
    },
  ],
  options: {
    hotspot: true,
  },
};

export default itemImage;
