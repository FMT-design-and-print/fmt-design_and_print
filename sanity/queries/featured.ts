import { groq } from "next-sanity";

export const featuredProductsQuery = groq`
    *[_type == "featuredProducts"]{
        "tShirts": tShirts[]->{
            "id": _id,
            title,
            "slug": slug.current,
            "image": image.asset->url,
            price,
            type->{
                "slug": slug.current,
                title,
            },
            category->{
                "slug": slug.current,
                title,
            },
        },
        "hoodies": hoodies[]->{
            "id": _id,
            title,
            "slug": slug.current,
            "image": image.asset->url,
            price,
            type->{
                "slug": slug.current,
                title,
            },
            category->{
                "slug": slug.current,
                title,
            },
        },
        "mugs": mugs[]->{
            "id": _id,
            title,
            "slug": slug.current,
            "image": image.asset->url,
            price,
            type->{
                "slug": slug.current,
                title,
            },
            category->{
                "slug": slug.current,
                title,
            },
        },
        "frames": frames[]->{
            "id": _id,
            title,
            "slug": slug.current,
            "image": image.asset->url,
            price,
            type->{
                "slug": slug.current,
                title,
            },
            category->{
                "slug": slug.current,
                title,
            },
        }
    }
`;
