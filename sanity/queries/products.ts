import { groq } from "next-sanity";

export const printProductsQuery = groq`
    *[_type == "printService" && category->slug.current == $slug ] {
        "id": _id,
        title,
        "slug": slug.current,
        "image": image.asset->url,
        price,
        category->{
            "id": _id,
            "slug": slug.current,
            title,
        }  
    }
`;
