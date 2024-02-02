import { Box, Button, Group, Input, Title } from "@mantine/core";
import { BsArrowRight } from "react-icons/bs";
import { ProductTypeCard } from "./ProductTypeCard";
import Link from "next/link";
import { GroupedPrintProductTypes } from "@/types";
import { useEffect, useState } from "react";

interface Props {
  groupedPrintProductTypes: GroupedPrintProductTypes;
}
export const PrintServices = ({ groupedPrintProductTypes }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   const items = Object.values(groupedPrintProductTypes);
  //   console.log(items);
  //   // return () => {
  //   //   effect
  //   // };
  // }, [searchTerm]);

  return (
    <Box py="lg">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        placeholder="Type to search print service..."
        maw={600}
      />

      {Object.entries(groupedPrintProductTypes).map(([key, value]) => (
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
      ))}
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
