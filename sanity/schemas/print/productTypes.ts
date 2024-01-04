import { SchemaTypeDefinition } from "sanity";

const productTypes: SchemaTypeDefinition = {
  name: "productTypes",
  title: "Product Types",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
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
      name: "category",
      title: "Printing Category",
      type: "reference",
      to: [{ type: "printCategories" }],
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
      name: "description",
      title: "Description",
      description: "Short description of this product type",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "orderRequestSample",
      title: "Order Request Sample",
      description:
        "Sample Order request sample as reference for users who want's to make custom order request for this type of product",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "live",
      title: "Go live",
      description: "These Items are available and ready to sell",
      type: "boolean",
    },
  ],
};

export default productTypes;
