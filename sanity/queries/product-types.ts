import { groq } from "next-sanity";

export const productTypesQuery = groq`
    *[_type == "productTypes"]{
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
