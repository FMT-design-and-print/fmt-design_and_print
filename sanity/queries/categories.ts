import { groq } from "next-sanity";

export const categoriesQuery = groq`
*[_type == "printCategories"] {
    "id": _id,
    title,
    "slug": slug.current,
    tagline,
    "image": image.asset->url,
    "icon": icon.asset->url
 }
`;
