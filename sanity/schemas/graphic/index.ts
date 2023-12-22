import { SchemaTypeDefinition } from "sanity";

const designService: SchemaTypeDefinition = {
  name: "designService",
  title: "Graphic Design Service",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Product Name",
      type: "string",
    },
  ],
};

export default designService;
