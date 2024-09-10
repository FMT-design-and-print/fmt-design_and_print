import { groq } from "next-sanity";

export const printServiceQuery = groq`
    *[_type == "printService" && (title match $searchText || description match $searchText) ]{
        "id": _id,
        title,
        "slug": slug.current,
        "type": _type,
        "image": image.asset->url,
        category->{
            "id": _id,
            "slug": slug.current,
            title,
        },
        type->{
            "id": _id,
            "slug": slug.current,
            title,
        }
    }[0...10]
 `;

export const liveProductTypesQuery = groq`
    *[_type == "productTypes" && (title match $searchText) && live == true ]{
    "id": _id,
    title,
    "slug": slug.current,
      "image": image.asset->url,
    category->{
        "id": _id,
        "slug": slug.current,
        title,
    },
 }
 `;

export const printCategoriesQuery = groq`
 *[_type == "productTypes" && (title match $searchText) && live == true ].category->{     
  "id": _id,
        title,
        "slug": slug.current,
        "image": image.asset->url
    }
`;

export const searchQuery = `{ "printService": ${printServiceQuery}, "productTypes": ${liveProductTypesQuery}, "printCategories": ${printCategoriesQuery}}`;
