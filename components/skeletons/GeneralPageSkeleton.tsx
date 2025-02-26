import { Container, Flex, Skeleton } from "@mantine/core";

const GeneralPageSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container size="xl" mt="xl">
        {/* Breadcrumbs */}
        <Flex gap="sm" align="center" mb="xl">
          <Skeleton height={20} width={100} radius="xl" />
          <Skeleton height={16} width={16} radius="xl" />
          <Skeleton height={20} width={120} radius="xl" />
          <Skeleton height={16} width={16} radius="xl" />
          <Skeleton height={20} width={140} radius="xl" />
        </Flex>

        {/* Page Title */}
        <Skeleton height={40} width="50%" mb="xl" />

        {/* Content Grid */}
        <Flex gap="xl">
          {/* Sidebar */}
          <div style={{ width: 250 }}>
            <Skeleton height={40} radius="md" mb="md" />
            <Skeleton height={40} radius="md" mb="md" />
            <Skeleton height={40} radius="md" mb="md" />
            <Skeleton height={40} radius="md" mb="md" />
            <Skeleton height={40} radius="md" mb="md" />
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1 }}>
            <Flex wrap="wrap" gap="md">
              {[1, 2, 3, 4, 5, 6, 8, 9].map((item) => (
                <div key={item} style={{ width: "calc(25% - 12px)" }}>
                  <Skeleton height={280} radius="md" mb="sm" />
                  <Skeleton height={20} width="80%" radius="xl" mb="xs" />
                  <Skeleton height={20} width="40%" radius="xl" />
                </div>
              ))}
            </Flex>
          </div>
        </Flex>
      </Container>
    </>
  );
};

export default GeneralPageSkeleton;
