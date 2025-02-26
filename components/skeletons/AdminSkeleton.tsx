import { Container, Flex, Skeleton } from "@mantine/core";

const AdminSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container size="100%" mt={0} p={0}>
        <Flex
          gap={0}
          align="flex-start"
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          {/* Sidebar */}
          <div
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
            <div style={{ padding: "0 20px" }}>
              {/* Dashboard Section */}
              <Skeleton
                height={16}
                width={100}
                radius="md"
                mb="md"
                style={{ backgroundColor: "#2C2E33" }}
              />
              <Flex direction="column" gap="sm" mb="xl">
                {[1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    height={40}
                    radius="md"
                    style={{ backgroundColor: "#2C2E33" }}
                  />
                ))}
              </Flex>

              {/* Orders Section */}
              <Skeleton
                height={16}
                width={100}
                radius="md"
                mb="md"
                style={{ backgroundColor: "#2C2E33" }}
              />
              <Flex direction="column" gap="sm" mb="xl">
                {[1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    height={40}
                    radius="md"
                    style={{ backgroundColor: "#2C2E33" }}
                  />
                ))}
              </Flex>

              {/* Products Section */}
              <Skeleton
                height={16}
                width={100}
                radius="md"
                mb="md"
                style={{ backgroundColor: "#2C2E33" }}
              />
              <Flex direction="column" gap="sm" mb="xl">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    height={40}
                    radius="md"
                    style={{ backgroundColor: "#2C2E33" }}
                  />
                ))}
              </Flex>
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              flex: 1,
              padding: "30px",
              background: "#F8F9FA",
              minHeight: "calc(100vh - 60px)",
            }}
          >
            {/* Page Header */}
            <Flex justify="space-between" align="center" mb="xl">
              <div>
                <Skeleton height={32} width={200} radius="md" mb="xs" />
                <Skeleton height={16} width={300} radius="md" />
              </div>
              <Skeleton height={36} width={120} radius="md" />
            </Flex>

            {/* Content Area */}
            <div
              style={{ background: "white", padding: "20px", borderRadius: 8 }}
            >
              {/* Stats Row */}
              <Flex gap="md" mb="xl">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} style={{ flex: 1 }}>
                    <Skeleton height={100} radius="md" />
                  </div>
                ))}
              </Flex>

              {/* Table/List View */}
              <Flex direction="column" gap="sm">
                <Skeleton height={50} radius="md" />
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} height={60} radius="md" />
                ))}
              </Flex>
            </div>
          </div>
        </Flex>
      </Container>
    </>
  );
};

export default AdminSkeleton;
