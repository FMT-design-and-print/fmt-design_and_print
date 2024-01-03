import { SchemaTypeDefinition } from "sanity";

const colors: SchemaTypeDefinition = {
  name: "colors",
  title: "Colors",
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

export default colors;
