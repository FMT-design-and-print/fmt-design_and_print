import { SchemaTypeDefinition } from "sanity";

const tShirtPrintTypes: SchemaTypeDefinition = {
  name: "tShirtPrintTypes",
  title: "T-Shirt Print Types",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "minOder",
      title: "Minimum Order items",
      type: "number",
    },
    {
      name: "additionalCost",
      title: "Additional Cost Per Item",
      type: "number",
    },
  ],
};

export default tShirtPrintTypes;
