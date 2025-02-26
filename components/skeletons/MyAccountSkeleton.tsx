import { Container, Flex, Skeleton } from "@mantine/core";

const MyAccountSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container size="100%" mt="xl">
        <Flex gap="xl" align="flex-start">
          {/* Sidebar */}
          <div style={{ width: 250, flexShrink: 0 }}>
            {/* User Info */}
            <Flex gap="md" mb="xl">
              <Skeleton circle height={40} />
              <div style={{ flex: 1 }}>
                <Skeleton height={20} width="80%" radius="md" mb={6} />
                <Skeleton height={16} width="60%" radius="md" />
              </div>
            </Flex>

            {/* Navigation Links */}
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: 8,
                padding: "20px",
              }}
            >
              {/* My Orders Section */}
              <Skeleton height={16} width={100} radius="md" mb="md" />
              <Flex direction="column" gap="sm" mb="xl">
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
              </Flex>

              {/* Account Settings Section */}
              <Skeleton height={16} width={120} radius="md" mb="md" />
              <Flex direction="column" gap="sm" mb="xl">
                <Skeleton height={36} radius="md" />
                <Skeleton height={36} radius="md" />
              </Flex>

              {/* Logout Button */}
              <Skeleton
                height={36}
                radius="md"
                style={{
                  backgroundColor: "#FFE3E3",
                  marginTop: "20px",
                }}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              flex: 1,
              background: "#f8f9fa",
              borderRadius: 8,
              padding: "30px",
            }}
          >
            {/* Page Title */}
            <Skeleton height={32} width={150} radius="md" mb="xl" />

            {/* Content Area - Empty State */}
            <Flex direction="column" align="center" justify="center" py={60}>
              <Skeleton circle height={80} width={80} mb="lg" />
              <Skeleton height={24} width={200} radius="md" mb="md" />
              <Skeleton height={16} width={300} radius="md" />
            </Flex>
          </div>
        </Flex>
      </Container>
    </>
  );
};

export default MyAccountSkeleton;
