import { Box, Container, Flex, Skeleton, Stack } from "@mantine/core";

const MyAccountSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container size="xl" mt="xl">
        <Flex
          gap="xl"
          align="flex-start"
          direction={{ base: "column", md: "row" }}
        >
          {/* Sidebar */}
          <Box w={{ base: "100%", md: 250 }} style={{ flexShrink: 0 }}>
            {/* User Info */}
            <Flex gap="md" mb="xl">
              <Skeleton circle height={40} />
              <div style={{ flex: 1 }}>
                <Skeleton height={20} w="80%" radius="md" mb={6} />
                <Skeleton height={16} w="60%" radius="md" />
              </div>
            </Flex>

            {/* Navigation Links */}
            <Box bg="#f8f9fa" style={{ borderRadius: 8 }} p="lg">
              {/* My Orders Section */}
              <Skeleton height={16} w={100} radius="md" mb="md" />
              <Stack gap="sm" mb="xl">
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
              </Stack>

              {/* Account Settings Section */}
              <Skeleton height={16} w={120} radius="md" mb="md" />
              <Stack gap="sm" mb="xl">
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
              </Stack>

              {/* Logout Button */}
              <Skeleton
                height={36}
                radius="md"
                style={{
                  backgroundColor: "#FFE3E3",
                  marginTop: "20px",
                }}
              />
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box
            style={{ flex: 1, borderRadius: 8 }}
            bg="#f8f9fa"
            p={{ base: "md", md: "xl" }}
          >
            {/* Page Title */}
            <Skeleton
              height={32}
              w={{ base: "100%", md: 150 }}
              radius="md"
              mb="xl"
            />

            {/* Content Area - Empty State */}
            <Flex direction="column" align="center" justify="center" py={60}>
              <Skeleton circle height={80} w={80} mb="lg" />
              <Skeleton
                height={24}
                w={{ base: "100%", sm: 200 }}
                radius="md"
                mb="md"
              />
              <Skeleton height={16} w={{ base: "100%", sm: 300 }} radius="md" />
            </Flex>
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default MyAccountSkeleton;
