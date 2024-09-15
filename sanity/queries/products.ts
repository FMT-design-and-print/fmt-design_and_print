import { groq } from "next-sanity";

// "professionTags": tags[@->._type == "professionTags"]->.professionTagName,
// "productTags": tags[@->._type == "productTags"]->.productTagName,

export const printProductsQuery = groq`
    *[_type == "printService" && category->slug.current == $slug ] {
        "id": _id,
        title,
        "slug": slug.current,
        "productNumber": number,
        "image": image.asset->url,
        color->{
            "id": _id,
            title,
            hex,
            "image": image.asset->url
        },
        "colors": colors[]{
            "id": _key,
            "image": image.asset->url,
            color->{
              "id": _id,
              title,
              hex,
              "image": image.asset->url
            }, 
        },
         "sizes": sizes[]->.title,
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

export const printProductsByTypeQuery = groq`
    *[_type == "printService" && type->slug.current == $slug ] {
        "id": _id,
        title,
        "slug": slug.current,
        "image": image.asset->url,
        color->{
            "id": _id,
            title,
            hex,
            "image": image.asset->url
        },
        "colors": colors[]{
            "id": _key,
            "image": image.asset->url,
            color->{
              "id": _id,
              title,
              hex,
              "image": image.asset->url
            }, 
        },
         "sizes": sizes[]->.title,
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
        },
        type->{
            "id": _id,
            "slug": slug.current,
            title,
        }
    }
`;

export const singleProductQuery = groq`
    *[_type == "printService" && _id == $id ][0] {
        "id": _id,
        title,
        "slug": slug.current,
        "productNumber": number,
        "image": image.asset->url,
        color->{
            "id": _id,
            title,
            hex,
            "image": image.asset->url
        },
        "colors": colors[]{
            "id": _key,
            "image": image.asset->url,
            color->{
              "id": _id,
              title,
              hex,
              "image": image.asset->url
            }, 
        },
         "sizes": sizes[]->.title,
        "gallery": gallery[].asset->url,
        price,
        description,
        details,
        "tags": [
            ...tags[@->._type == "professionTags"]->.professionTagName, 
            ...tags[@->._type == "productTags"]->.productTagName,
            ...extraTags
        ],
        category->{
            "id": _id,
            "slug": slug.current,
            title,
        },
        type->{
            "id": _id,
            "slug": slug.current,
            title,
        },
        "relatedProducts": *[_type == "printService" && references(^.type->_id) ] { 
            "id": _id, 
            title, 
            price, 
            "slug": slug.current, 
            "image": image.asset->url  
        }[0..5],
        "otherProducts": *[_type == "printService" && !references(^.type->_id)]{ 
            "id": _id, 
            title, 
            price, 
            "slug": slug.current, 
            "image": image.asset->url 
        }[0...10]
    }
`;

export const relatedProductsQuery = groq`
    *[_type == "printService" && type->slug.current == $slug ] {
        "id": _id,
        title,
        "slug": slug.current,
        "image": image.asset->url,
        price,
        description,
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
    }[0...5]
`;

export const productsByTagQuery = groq`
*[_type == "printService" && type->slug.current == $slug && ( $itemTag  in
  [
    ...tags[@->._type == "professionTags"]->.professionTagName, 
    ...tags[@->._type == "productTags"]->.productTagName,
    ...extraTags
  ]
) ] {
  "id": _id,
  title,
  "slug": slug.current,
  "image": image.asset->url,
  color->{
    "id": _id,
    title,
    hex,
    "image": image.asset->url
  },
  "colors": colors[]{
    "id": _key,
    "image": image.asset->url,
    color->{
      "id": _id,
      title,
      hex,
      "image": image.asset->url
    }
  },
  "sizes": sizes[]->.title,
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
    title
  },
  type->{
    "id": _id,
    "slug": slug.current,
    title
  }
}
`;

export const allProductsInCategoryByTagQuery = groq`
*[_type == "printService" && category->slug.current == $slug && ( $itemTag  in
  [
    ...tags[@->._type == "professionTags"]->.professionTagName, 
    ...tags[@->._type == "productTags"]->.productTagName,
    ...extraTags
  ]
) ] {
  "id": _id,
  title,
  "slug": slug.current,
  "image": image.asset->url,
  color->{
    "id": _id,
    title,
    hex,
    "image": image.asset->url
  },
  "colors": colors[]{
    "id": _key,
    "image": image.asset->url,
    color->{
      "id": _id,
      title,
      hex,
      "image": image.asset->url
    }
  },
  "sizes": sizes[]->.title,
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
    title
  },
  type->{
    "id": _id,
    "slug": slug.current,
    title
  }
}
`;
