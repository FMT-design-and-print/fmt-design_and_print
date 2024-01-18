import { groq } from "next-sanity";

export const productTypesQuery = groq`
    *[_type == "productTypes" && live == true ]{
      "id": _id,
        title,
        "slug": slug.current,
        "image": image.asset->url,
        category->{
          "id": _id,
          "slug": slug.current,
          title,
      }
    }
`;

export const filteredProductTypesQuery = groq`
  *[_type == "productTypes" && live == true && category->slug.current == $slug ]{
      "id": _id,
        title,
        "slug": slug.current,
        "image": image.asset->url,
        category->{
          "id": _id,
          "slug": slug.current,
          title,
      }  
    }
`;
