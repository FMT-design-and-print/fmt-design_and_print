import { Box, Button, Group, Input, Space, Title, rem } from "@mantine/core";
import { BsArrowRight } from "react-icons/bs";
import { ProductTypeCard } from "./ProductTypeCard";
import Link from "next/link";
import { GroupedPrintProductTypes } from "@/types";
import { useEffect, useState } from "react";
import { groupProductTypesByCategory } from "@/functions";

interface Props {
  groupedPrintProductTypes: GroupedPrintProductTypes;
}
export const PrintServices = ({ groupedPrintProductTypes }: Props) => {
  const [filteredGroupedTypes, setFilteredGroupedTypes] = useState<
    GroupedPrintProductTypes | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [noItemsFound, setNoItemsFound] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        const itemsList = Object.values(groupedPrintProductTypes);
        const flattenedItems = itemsList.flatMap((category) => category.items);

        const filteredItems = flattenedItems.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredItems.length === 0) {
          setFilteredGroupedTypes(undefined);
          setNoItemsFound(true);
          return;
        }

        setNoItemsFound(false);
        setFilteredGroupedTypes(groupProductTypesByCategory(filteredItems));
      } else {
        setNoItemsFound(false);
        setFilteredGroupedTypes(undefined);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [groupedPrintProductTypes, searchTerm]);

  return (
    <Box py="lg">
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        placeholder="Type to search print service..."
        maw={600}
      />

      {noItemsFound ? (
        <>
          <Title order={5} c="gray.6" m="md" tt="uppercase">
            No results found for &quot;{searchTerm}&quot;
          </Title>
          <Space mb={rem(256)} />
        </>
      ) : (
        Object.entries(filteredGroupedTypes || groupedPrintProductTypes).map(
          ([key, value]) => (
            <Box key={key} mt={32}>
              <CategoryHeader
                title={value.title}
                slug={value.slug}
                customRequestLink="/custom-request"
              />
              <Group>
                {value.items.map((item) => (
                  <ProductTypeCard
                    key={item.id}
                    label={item.title}
                    link={`services/print/categories/${value.slug}/${item.slug}`}
                    image={item.image}
                  />
                ))}
              </Group>
            </Box>
          )
        )
      )}
    </Box>
  );
};

const CategoryHeader = ({
  title,
  slug,
  customRequestLink,
}: {
  title: string;
  slug: string;
  customRequestLink: string;
}) => {
  return (
    <Group bg="gray.2" wrap="nowrap" p={8} justify="space-between" my="lg">
      <Link href={`/services/print/categories/${slug}`}>
        <Title order={5} p="sm" tt="uppercase" lineClamp={1} title={title}>
          {title}
        </Title>
      </Link>

      <Button
        size="xs"
        className="btn"
        radius="xs"
        miw={100}
        visibleFrom="sm"
        rightSection={<BsArrowRight />}
        component={Link}
        href={customRequestLink}
      >
        Custom Request
      </Button>
    </Group>
  );
};
