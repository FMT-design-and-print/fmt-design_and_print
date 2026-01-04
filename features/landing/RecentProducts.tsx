import { ProductCard } from "@/components/ProductCard";
import { IPrintProduct } from "@/types";
import { Box, Group, Title, Button, Stack, SimpleGrid, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";

interface Props {
  products: IPrintProduct[];
}

export const RecentProducts = ({ products }: Props) => {
  if (!products || products.length === 0) return null;
  const xs = useMediaQuery("(max-width: 36em)");

  return (
    <Box p="md">
      <Group my="xl" justify="space-between">
        <Stack gap={0}>
          <Title order={3} c="gray.8">
           Recently Added
          </Title>
          <Text c="dimmed" size={xs ? "xs" : "sm"}>
            Check out our recently added products
          </Text>
        </Stack>
        <Button
          component={Link}
          href="/services"
          variant="subtle"
          color="pink.6"
        >
          View All <FaLongArrowAltRight style={{ margin: "0 10px" }} />
        </Button>
      </Group>

      <SimpleGrid
        cols={{ base: xs ? 2 : 1, xs: 2, sm: 3, md: 4 }}
        spacing={{base: "md", xl: "xl"}}
        verticalSpacing="xl"
      >
        {products.map((product) => (
          <Box key={product.id}>
            <ProductCard
              product={product}
              link={`/services/print/${product.id}`}
              size={xs ? "small" : "default"}
              width="100%"
            />
            {!xs && <Group gap="xs" justify="center">
              <Link
                href={`/services/print/categories/${product.category.slug}`}
                style={{ textDecoration: "none" }}
              >
                <Text size="xs" c="dimmed" maw={150} truncate title={product.category.title}>
                  {product.category.title}
                </Text>
              </Link>
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Link
                href={`/services/print/categories/${product.category.slug}/${product.type.slug}`}
                style={{ textDecoration: "none" }}
              >
                <Text size="xs" c="dimmed" maw={150} truncate title={product.type.title}>
                  {product.type.title}
                </Text>
              </Link>
            </Group> }
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
