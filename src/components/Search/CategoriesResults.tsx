import { SearchItem } from "@/types";
import { Divider, Flex } from "@mantine/core";
import { ResultItem } from "./ResultItem";

export interface Props {
  items: SearchItem[];
}
export const CategoriesResults = ({ items }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      <Divider label={`Categories (${items.length})`} />
      <Flex wrap="wrap" mah={200} style={{ overflowY: "auto" }}>
        {items.map((item) => (
          <ResultItem
            key={item.id}
            item={item}
            link={`/services/print/categories/${item.slug}`}
            badgeLabel="Categories"
          />
        ))}
      </Flex>
    </>
  );
};
