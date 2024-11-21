import { SchemaTypeDefinition } from "sanity";

const printService: SchemaTypeDefinition = {
  name: "printService",
  title: "Printing Service",
  type: "document",
  groups: [
    {
      name: "general",
      title: "General Details",
    },
    {
      name: "variations",
      title: "Variations",
    },
    {
      name: "tags",
      title: "Tags",
    },
    {
      name: "extra",
      title: "Extra",
    },
  ],
  fields: [
    {
      name: "title",
      title: "Product Title",
      type: "string",
      group: "general",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 100,
      },
      group: "general",
    },
    {
      name: "number",
      title: "Product Number",
      type: "string",
      group: "general",
    },
    {
      name: "category",
      title: "Printing Category",
      type: "reference",
      to: [{ type: "printCategories" }],
      group: "general",
    },
    {
      name: "type",
      title: "Product Type",
      type: "reference",
      to: [{ type: "productTypes" }],
      group: "general",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      group: "general",
    },
    {
      name: "image",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      group: "general",
    },
    {
      name: "color",
      title: "Main Image Color",
      type: "reference",
      to: [{ type: "colors" }],
      group: "general",
    },
    {
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "galleryImage" }],
      options: {
        maxLength: 3,
      },
      group: "general",
    },
    {
      name: "description",
      title: "Description",
      description: "Short description of the item",
      type: "text",
      group: "general",
    },
    {
      name: "details",
      title: "Item Details",
      description: "Detailed description of the product",
      type: "array",
      of: [{ type: "block" }],
      group: "general",
    },
    {
      name: "colors",
      title: "Colors",
      type: "array",
      of: [{ type: "colorVariation" }],
      group: "variations",
    },
    {
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "sizes" }],
        },
      ],
      group: "variations",
    },
    {
      name: "tags",
      title: "Tags",
      description: "Add tags to Product",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "productTags" }, { type: "professionTags" }],
        },
      ],
      group: "tags",
    },
    {
      name: "extraTags",
      title: "Extra Tags",
      description: "Enter any extra tags you did not find in the list",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      group: "tags",
    },
    {
      name: "gender",
      title: "Gender",
      description: "Is this item specific to any gender",
      type: "string",
      options: {
        list: [
          { title: "All", value: "all" },
          { title: "Men", value: "men" },
          { title: "Women", value: "women" },
        ],
      },
      group: "extra",
    },
    {
      name: "isForKids",
      title: "This Product is for Kids",
      type: "boolean",
      initialValue: false,
      group: "extra",
    },
  ],
};

export default printService;
