import { groq } from "next-sanity";

export const categoriesQuery = groq`
*[_type == "printCategories" && count(*[_type == "productTypes" && references(^._id) && live == true]) > 0] {
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
