import { SchemaTypeDefinition } from "sanity";

const tShirtColors: SchemaTypeDefinition = {
  name: "tShirtColors",
  title: "T-Shirt Colors",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "hex",
      title: "Hex Code",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
};

export default tShirtColors;
