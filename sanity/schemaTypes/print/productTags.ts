import { SchemaTypeDefinition } from "sanity";

const productTags: SchemaTypeDefinition = {
  name: "productTags",
  title: "Product Tags",
  type: "document",
  fields: [
    {
      name: "productTagName",
      title: "Tag Name",
      type: "string",
    },
  ],
};

export default productTags;
