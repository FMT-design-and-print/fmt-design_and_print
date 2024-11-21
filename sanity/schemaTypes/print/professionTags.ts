import { SchemaTypeDefinition } from "sanity";

const professionTags: SchemaTypeDefinition = {
  name: "professionTags",
  title: "Profession Tags",
  type: "document",
  fields: [
    {
      name: "professionTagName",
      title: "Profession Tag Name",
      type: "string",
    },
  ],
};

export default professionTags;
