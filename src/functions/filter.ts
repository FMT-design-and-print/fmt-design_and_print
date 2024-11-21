import { IPrintProduct, ITag } from "@/types";

export const filteredPrintProducts = (
  printProducts: IPrintProduct[],
  tags: ITag[],
  searchTerm: string
) => {
  const searchText = searchTerm.trim().toLowerCase();

  if (!searchText && tags.length > 0) {
    return filterByTags(printProducts, tags);
  }

  return printProducts.filter((product) =>
    matchesSearchOrTags(product, searchText, tags)
  );
};

const filterByTags = (printProducts: IPrintProduct[], tags: ITag[]) =>
  printProducts.filter((product) => hasCommonTag(product, tags));

const matchesSearchOrTags = (
  product: IPrintProduct,
  searchText: string,
  tags: ITag[]
) =>
  product.title.toLowerCase().includes(searchText) ||
  (product.description &&
    product.description.toLowerCase().includes(searchText)) ||
  product.tags.some((tag) =>
    tags.some((item) => item.name.toLowerCase() === tag.toLowerCase())
  );

const hasCommonTag = (product: IPrintProduct, tags: ITag[]) =>
  product.tags.some((tag) =>
    tags.some((item) => item.name.toLowerCase() === tag.toLowerCase())
  );
