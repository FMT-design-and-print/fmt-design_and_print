import { Container, Grid, Loader, Text } from "@mantine/core";
import { useAllProducts } from "./hooks/useAllProducts";
import { ProductCard } from "@/components/ProductCard";

export function AllProducts() {
  const { data: products, isLoading, error } = useAllProducts();

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Grid justify="center">
          <Loader size="lg" />
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Text c="red" ta="center">
          Error loading products. Please try again later.
        </Text>
      </Container>
    );
  }

  if (!products?.length) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center">No products available.</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl" px="0">
      <Grid gutter="md" py="xl">
        {products.map((product) => (
          <Grid.Col key={product.id} span={{ base: 6, xs: 4, sm: 3, md: 2 }}>
            <ProductCard
              product={product}
              link={`/services/print/${product.id}`}
              size="small"
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
