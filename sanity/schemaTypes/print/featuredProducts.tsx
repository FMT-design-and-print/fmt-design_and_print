export const featuredProducts = {
  name: "featuredProducts",
  title: "Featured Products",
  type: "document",
  fields: [
    {
      name: "tShirts",
      title: "T-Shirts",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "printService" }],
        },
      ],
    },
    {
      name: "hoodies",
      title: "Hoodies",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "printService" }],
        },
      ],
    },
    {
      name: "mugs",
      title: "Mugs",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "printService" }],
        },
      ],
    },
    {
      name: "frames",
      title: "Frames",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "printService" }],
        },
      ],
    },
  ],
};
