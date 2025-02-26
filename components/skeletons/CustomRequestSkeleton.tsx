import { Container, Flex, Grid, Skeleton } from "@mantine/core";

const CustomRequestSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Hero Banner */}
      <div style={{ background: "#E9ECEF", padding: "40px 0" }}>
        <Container size="xl">
          <Flex direction="column" align="center" gap="sm">
            <Skeleton height={35} width={200} radius="md" />
            <Skeleton height={20} width={300} radius="md" />
          </Flex>
        </Container>
      </div>

      {/* Product Types Section */}
      <Container size="xl" mt="xl">
        {/* Section Title */}
        <Skeleton height={30} width={200} mb="xl" radius="md" />

        {/* Search Input */}
        <Flex justify="flex-end" mb="xl">
          <Skeleton height={36} width={250} radius="md" />
        </Flex>

        {/* Product Types Grid */}
        <Grid>
          {[1, 2, 3, 4].map((item) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={item}>
              <Flex
                gap="md"
                align="center"
                p="lg"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              >
                <Skeleton circle height={40} />
                <Skeleton height={24} width={100} radius="md" />
              </Flex>
            </Grid.Col>
          ))}
        </Grid>

        {/* Can't find product link */}
        <Flex justify="flex-end" mt="xl" align="center" gap="md">
          <Skeleton height={20} width={150} radius="md" />
          <Skeleton
            height={20}
            width={80}
            radius="md"
            style={{ backgroundColor: "#E03131" }}
          />
        </Flex>
      </Container>
    </>
  );
};

export default CustomRequestSkeleton;
