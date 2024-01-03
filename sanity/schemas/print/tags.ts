import { SchemaTypeDefinition } from "sanity";

const tags: SchemaTypeDefinition = {
  name: "tags",
  title: "Tags",
  type: "document",
  fields: [
    {
      name: "productTags",
      title: "Product Tags",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "professionTags",
      title: "Profession Tags",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
};

export default tags;
