import { groq } from "next-sanity";

export const categoriesQuery = groq`
*[_type == "printCategories" && *[_type == "productTypes" && live == true ]] {
    "id": _id,
    title,
    "slug": slug.current,
    tagline,
    "image": image.asset->url,
    "icon": icon.asset->url
 }
`;

export const filteredCategoriesByProductTypeQuery = groq`
*[_type == "productTypes" && live == true ].category->{
    "id": _id,
    title,
    "slug": slug.current,
    tagline,
    "image": image.asset->url,
    "icon": icon.asset->url
 }
`;
