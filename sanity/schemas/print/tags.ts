import { SchemaTypeDefinition } from "sanity";

const tagList: SchemaTypeDefinition = {
  name: "tagList",
  title: "Product Tags",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
  ],
};

export default tagList;
