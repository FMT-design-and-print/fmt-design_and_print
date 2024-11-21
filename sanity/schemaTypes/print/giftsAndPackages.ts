import { SchemaTypeDefinition } from "sanity";

const giftsAndPackages: SchemaTypeDefinition = {
  name: "giftsAndPackages",
  title: "Gifts and Packages",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Package Title",
      description: "Title of Gift or Package",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 100,
      },
    },
  ],
};

export default giftsAndPackages;
