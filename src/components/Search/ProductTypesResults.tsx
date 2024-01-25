import { SearchItem } from "@/types";
import { Divider, Flex } from "@mantine/core";
import { ResultItem } from "./ResultItem";

export interface Props {
  items: SearchItem[];
  close: () => void;
}
export const ProductTypesResults = ({ items, close }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      <Divider label={`Product Types (${items.length})`} />
      <Flex wrap="wrap" mah={200} style={{ overflowY: "auto" }}>
        {items.map((item) => (
          <ResultItem
            key={item.id}
            item={item}
            link={`/services/print/categories/${item.category?.slug}/${item.slug}`}
            badgeLabel="Product Types"
            close={close}
          />
        ))}
      </Flex>
    </>
  );
};
