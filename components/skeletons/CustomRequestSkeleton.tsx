import { Box, Container, Flex, Grid, Skeleton } from "@mantine/core";

const CustomRequestSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Hero Banner */}
      <Box bg="#E9ECEF" py={{ base: "md", sm: "xl" }}>
        <Container size="xl">
          <Flex direction="column" align="center" gap="sm">
            <Skeleton height={35} w={{ base: "90%", sm: 200 }} radius="md" />
            <Skeleton height={20} w={{ base: "100%", sm: 300 }} radius="md" />
          </Flex>
        </Container>
      </Box>

      {/* Product Types Section */}
      <Container size="xl" mt="xl">
        {/* Section Title */}
        <Skeleton
          height={30}
          w={{ base: "80%", sm: 200 }}
          mb="xl"
          radius="md"
        />

        {/* Search Input */}
        <Flex justify="flex-end" mb="xl">
          <Skeleton height={36} w={{ base: "100%", sm: 250 }} radius="md" />
        </Flex>

        {/* Product Types Grid */}
        <Grid>
          {[1, 2, 3, 4].map((item) => (
            <Grid.Col span={{ base: 12, xs: 6, md: 3 }} key={item}>
              <Box
                p="lg"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              >
                <Flex gap="md" align="center">
                  <Skeleton circle h={40} w={40} />
                  <Skeleton
                    height={24}
                    w={{ base: "60%", sm: 100 }}
                    radius="md"
                  />
                </Flex>
              </Box>
            </Grid.Col>
          ))}
        </Grid>

        {/* Can't find product link */}
        <Flex
          justify={{ base: "center", sm: "flex-end" }}
          mt="xl"
          align="center"
          gap="md"
          direction={{ base: "column", sm: "row" }}
        >
          <Skeleton height={20} w={{ base: "100%", sm: 150 }} radius="md" />
          <Skeleton
            height={20}
            w={{ base: "100%", sm: 80 }}
            radius="md"
            style={{ backgroundColor: "#E03131" }}
          />
        </Flex>
      </Container>
    </>
  );
};

export default CustomRequestSkeleton;
