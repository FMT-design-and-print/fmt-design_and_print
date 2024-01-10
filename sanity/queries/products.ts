import { groq } from "next-sanity";

// "professionTags": tags[@->._type == "professionTags"]->.professionTagName,
// "productTags": tags[@->._type == "productTags"]->.productTagName,

export const printProductsQuery = groq`
    *[_type == "printService" && category->slug.current == $slug ] {
        "id": _id,
        title,
        "slug": slug.current,
        "image": image.asset->url,
        price,
        description,
        "tags": [
            ...tags[@->._type == "professionTags"]->.professionTagName, 
            ...tags[@->._type == "productTags"]->.productTagName,
            ...extraTags
        ],
        category->{
            "id": _id,
            "slug": slug.current,
            title,
        }  
    }
`;
