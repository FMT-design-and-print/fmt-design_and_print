import { Box, Container, Flex, Grid, Skeleton, Stack } from "@mantine/core";

const AdminSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container fluid p={0}>
        <Flex
          gap={0}
          align="flex-start"
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          {/* Sidebar - Hidden on mobile */}
          <Flex
            direction="column"
            display={{ base: "none", md: "flex" }}
            style={{
              width: 280,
              flexShrink: 0,
              background: "#0A0B14",
              height: "calc(100vh - 60px)",
            }}
          >
            {/* Admin Info */}
            <Flex gap="md" p="xl" mb="xl">
              <Skeleton
                circle
                height={40}
                style={{ backgroundColor: "#2C2E33" }}
              />
              <div style={{ flex: 1 }}>
                <Skeleton
                  height={20}
                  width="80%"
                  radius="md"
                  mb={6}
                  style={{ backgroundColor: "#2C2E33" }}
                />
                <Skeleton
                  height={16}
                  width="60%"
                  radius="md"
                  style={{ backgroundColor: "#2C2E33" }}
                />
              </div>
            </Flex>

            {/* Navigation Links */}
            <Stack gap="xl" px="md">
              {/* Dashboard Section */}
              <Stack gap="sm">
                <Skeleton
                  height={16}
                  width={100}
                  radius="md"
                  style={{ backgroundColor: "#2C2E33" }}
                />
                {[1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    height={40}
                    radius="md"
                    style={{ backgroundColor: "#2C2E33" }}
                  />
                ))}
              </Stack>

              {/* Orders Section */}
              <Stack gap="sm">
                <Skeleton
                  height={16}
                  width={100}
                  radius="md"
                  style={{ backgroundColor: "#2C2E33" }}
                />
                {[1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    height={40}
                    radius="md"
                    style={{ backgroundColor: "#2C2E33" }}
                  />
                ))}
              </Stack>

              {/* Products Section */}
              <Stack gap="sm">
                <Skeleton
                  height={16}
                  width={100}
                  radius="md"
                  style={{ backgroundColor: "#2C2E33" }}
                />
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    height={40}
                    radius="md"
                    style={{ backgroundColor: "#2C2E33" }}
                  />
                ))}
              </Stack>
            </Stack>
          </Flex>

          {/* Main Content Area */}
          <Flex
            direction="column"
            style={{
              flex: 1,
              background: "#F8F9FA",
              minHeight: "calc(100vh - 60px)",
            }}
            p={{ base: "md", sm: "lg", md: "xl" }}
          >
            {/* Page Header */}
            <Flex
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: "md", sm: 0 }}
              mb="xl"
            >
              <div>
                <Skeleton
                  height={32}
                  w={{ base: "100%", sm: 200 }}
                  radius="md"
                  mb="xs"
                />
                <Skeleton
                  height={16}
                  w={{ base: "100%", sm: 300 }}
                  radius="md"
                />
              </div>
              <Skeleton height={36} w={{ base: "100%", sm: 120 }} radius="md" />
            </Flex>

            {/* Content Area */}
            <Box
              bg="white"
              style={{ borderRadius: 8 }}
              p={{ base: "md", sm: "lg" }}
            >
              {/* Stats Row */}
              <Grid mb="xl">
                {[1, 2, 3, 4].map((item) => (
                  <Grid.Col key={item} span={{ base: 12, xs: 6, md: 3 }}>
                    <Skeleton h={{ base: 80, md: 100 }} radius="md" />
                  </Grid.Col>
                ))}
              </Grid>

              {/* Table/List View */}
              <Stack gap="sm">
                <Skeleton height={50} radius="md" />
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} h={{ base: 50, md: 60 }} radius="md" />
                ))}
              </Stack>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default AdminSkeleton;
