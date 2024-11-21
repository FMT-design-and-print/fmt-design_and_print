import { SchemaTypeDefinition } from "sanity";

const printCategories: SchemaTypeDefinition = {
  name: "printCategories",
  title: "Printing Categories",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title of Category",
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
    {
      name: "tagline",
      title: "Tagline",
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
    {
      name: "icon",
      title: "Icon",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "description",
      title: "Description",
      description: "Short description of the item",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};

export default printCategories;
