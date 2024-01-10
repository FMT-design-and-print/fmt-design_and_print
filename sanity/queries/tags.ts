import { groq } from "next-sanity";

export const productTagsQuery = groq`
*[_type == "productTags"] {
    "id": _id,
    "name": productTagName,
 }
`;

export const professionTagsQuery = groq`
*[_type == "professionTags"] {
    "id": _id,
    "name": professionTagName,
 }
`;

export const tagsQuery = `{ "productTags": ${productTagsQuery}, "professionTags": ${professionTagsQuery}}`;
