import { Container, Flex, Grid, Skeleton } from "@mantine/core";

const LandingPageSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Hero Section with Search */}
      <Container size="xl" mt="xl">
        <Flex gap="xl" align="center">
          {/* Left side menu */}
          <div style={{ width: 300 }}>
            <Skeleton height={40} radius="md" mb="md" />
            <Skeleton height={40} radius="md" mb="md" />
            <Skeleton height={40} radius="md" mb="md" />
            <Skeleton height={40} radius="md" />
          </div>

          {/* Center banner */}
          <div style={{ flex: 1 }}>
            <Skeleton height={400} radius="md" />
            <Flex gap="sm" mt="sm" justify="center">
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
              <Skeleton circle height={12} />
            </Flex>
          </div>

          {/* Right side actions */}
          <div style={{ width: 300 }}>
            <Skeleton height={50} radius="md" mb="md" />
            <Skeleton height={50} radius="md" mb="md" />
            <Skeleton height={50} radius="md" mb="md" />
            <Skeleton height={50} radius="md" />
          </div>
        </Flex>
      </Container>

      {/* Products Section */}
      <Container size="xl" mt={50}>
        <Skeleton height={40} width={300} mb="xl" />
        <Grid>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid.Col
              span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
              key={item}
            >
              <Skeleton height={350} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default LandingPageSkeleton;
