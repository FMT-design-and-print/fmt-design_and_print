import { Box, Container, Flex, Skeleton } from "@mantine/core";

const GeneralPageSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container size="xl" mt="xl">
        {/* Breadcrumbs - Scrollable on mobile */}
        <Box style={{ overflowX: "auto" }}>
          <Flex
            gap="sm"
            align="center"
            mb="xl"
            style={{ minWidth: "max-content" }}
          >
            <Skeleton height={20} w={100} radius="xl" />
            <Skeleton height={16} w={16} radius="xl" />
            <Skeleton height={20} w={120} radius="xl" />
            <Skeleton height={16} w={16} radius="xl" />
            <Skeleton height={20} w={140} radius="xl" />
          </Flex>
        </Box>

        {/* Page Title */}
        <Skeleton height={40} w={{ base: "100%", sm: "50%" }} mb="xl" />

        {/* Content Grid */}
        <Flex gap="xl" direction={{ base: "column", md: "row" }}>
          {/* Sidebar - Horizontal scroll on mobile */}
          <Box w={{ base: "100%", md: 250 }} style={{ flexShrink: 0 }}>
            <Box style={{ overflowX: "auto" }}>
              <Flex
                gap="md"
                direction={{ base: "row", md: "column" }}
                style={{ minWidth: "max-content" }}
              >
                <Skeleton
                  height={40}
                  w={{ base: 150, md: "100%" }}
                  radius="md"
                />
                <Skeleton
                  height={40}
                  w={{ base: 150, md: "100%" }}
                  radius="md"
                />
                <Skeleton
                  height={40}
                  w={{ base: 150, md: "100%" }}
                  radius="md"
                />
                <Skeleton
                  height={40}
                  w={{ base: 150, md: "100%" }}
                  radius="md"
                />
                <Skeleton
                  height={40}
                  w={{ base: 150, md: "100%" }}
                  radius="md"
                />
              </Flex>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box style={{ flex: 1 }}>
            <Flex wrap="wrap" gap="md">
              {[1, 2, 3, 4, 5, 6, 8, 9].map((item) => (
                <Box
                  key={item}
                  w={{
                    base: "100%",
                    xs: "calc(50% - 8px)",
                    sm: "calc(33.333% - 11px)",
                    md: "calc(25% - 12px)",
                  }}
                >
                  <Skeleton
                    h={{ base: 200, sm: 250, md: 280 }}
                    radius="md"
                    mb="sm"
                  />
                  <Skeleton height={20} w="80%" radius="xl" mb="xs" />
                  <Skeleton height={20} w="40%" radius="xl" />
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default GeneralPageSkeleton;
