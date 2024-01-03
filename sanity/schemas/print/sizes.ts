import { SchemaTypeDefinition } from "sanity";

const sizes: SchemaTypeDefinition = {
  name: "sizes",
  title: "Sizes",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
  ],
};

export default sizes;
