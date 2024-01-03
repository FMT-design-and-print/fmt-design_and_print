const colorVariation = {
  name: "colorVariation",
  title: "Color",
  type: "object",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
    },
    {
      name: "color",
      title: "Color",
      type: "reference",
      to: [{ type: "colors" }],
    },
  ],
};

export default colorVariation;
