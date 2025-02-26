import { Box, Container, Flex, Grid, Skeleton, Stack } from "@mantine/core";

const LandingPageSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Hero Section with Search */}
      <Container size="xl" mt="xl">
        <Flex
          gap="xl"
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
        >
          {/* Left side menu - Hidden on mobile */}
          <Box
            display={{ base: "none", md: "block" }}
            w={{ base: "100%", md: 300 }}
          >
            <Stack>
              <Skeleton height={40} radius="md" />
              <Skeleton height={40} radius="md" />
              <Skeleton height={40} radius="md" />
              <Skeleton height={40} radius="md" />
            </Stack>
          </Box>

          {/* Center banner */}
          <Box style={{ flex: 1 }}>
            <Skeleton h={{ base: 200, sm: 300, md: 400 }} radius="md" />
            <Flex gap="sm" mt="sm" justify="center">
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
            </Flex>
          </Box>

          {/* Right side actions - Moves below banner on mobile */}
          <Box w={{ base: "100%", md: 300 }}>
            <Stack>
              <Skeleton height={50} radius="md" />
              <Skeleton height={50} radius="md" />
              <Skeleton height={50} radius="md" />
              <Skeleton height={50} radius="md" />
            </Stack>
          </Box>
        </Flex>
      </Container>

      {/* Products Section */}
      <Container size="xl" mt={50}>
        <Skeleton height={40} w={{ base: "100%", sm: 300 }} mb="xl" />
        <Grid>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid.Col
              span={{ base: 12, xs: 6, sm: 4, md: 3, xl: 2.4 }}
              key={item}
            >
              <Skeleton h={{ base: 250, sm: 300, md: 350 }} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default LandingPageSkeleton;
