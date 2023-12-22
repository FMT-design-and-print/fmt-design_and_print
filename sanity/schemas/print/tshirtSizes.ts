import { SchemaTypeDefinition } from "sanity";

const tShirtSizes: SchemaTypeDefinition = {
  name: "tShirtSizes",
  title: "T-Shirt Sizes",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
  ],
};

export default tShirtSizes;
