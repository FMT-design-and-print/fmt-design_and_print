import { SearchItem } from "@/types";
import { Divider, Flex } from "@mantine/core";
import { ResultItem } from "./ResultItem";

export interface Props {
  products: SearchItem[];
}
export const ProductsResults = ({ products }: Props) => {
  if (!products || products.length === 0) return null;

  return (
    <>
      <Divider label={`Products (${products.length})`} />
      <Flex wrap="wrap" mah={200} style={{ overflowY: "auto" }}>
        {products.map((item) => (
          <ResultItem
            key={item.id}
            item={item}
            link={`/services/print/${item.id}`}
          />
        ))}
      </Flex>
    </>
  );
};
