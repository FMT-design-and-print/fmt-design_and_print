import { Container, Flex, Skeleton } from "@mantine/core";

const OrderTrackingSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container size="xl" mt={50}>
        {/* Page Title and Description */}
        <Flex direction="column" align="center" mb="xl">
          <Skeleton height={40} width={200} radius="md" mb="md" />
          <Skeleton height={20} width={500} radius="md" />
        </Flex>

        {/* Order Info Card */}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Order Summary Header */}
          <div style={{ background: "#f8f9fa", padding: "12px 20px" }}>
            <Flex justify="space-between" align="center">
              <Flex gap="xl">
                <Flex direction="column" gap={4}>
                  <Skeleton height={16} width={80} radius="md" />
                  <Skeleton height={20} width={120} radius="md" />
                </Flex>
                <Flex direction="column" gap={4}>
                  <Skeleton height={16} width={40} radius="md" />
                  <Skeleton height={20} width={60} radius="md" />
                </Flex>
                <Flex direction="column" gap={4}>
                  <Skeleton height={16} width={60} radius="md" />
                  <Skeleton height={20} width={200} radius="md" />
                </Flex>
              </Flex>
              <Flex direction="column" gap={4} align="flex-end">
                <Skeleton height={16} width={50} radius="md" />
                <Skeleton height={20} width={80} radius="md" />
              </Flex>
            </Flex>
          </div>

          {/* Order Status */}
          <div style={{ padding: "30px 20px" }}>
            <Flex direction="column" gap="xl">
              {/* Status and Delivery Date */}
              <Flex justify="space-between" mb="lg">
                <Flex gap="md" align="center">
                  <Skeleton height={20} width={100} radius="md" />
                  <Skeleton
                    height={24}
                    width={100}
                    radius="md"
                    style={{ backgroundColor: "#E03131" }}
                  />
                </Flex>
                <Flex gap="md" align="center">
                  <Skeleton height={20} width={150} radius="md" />
                  <Skeleton height={24} width={120} radius="md" />
                </Flex>
              </Flex>

              {/* Progress Steps */}
              <Flex justify="space-between" align="center" pos="relative">
                {/* Progress Line */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    right: "0",
                    height: "2px",
                    background: "#dee2e6",
                    zIndex: 0,
                  }}
                />

                {/* Step Items */}
                {[1, 2, 3, 4].map((step) => (
                  <Flex
                    key={step}
                    direction="column"
                    align="center"
                    gap="sm"
                    style={{
                      zIndex: 1,
                      background: "white",
                      padding: "0 10px",
                    }}
                  >
                    <Skeleton circle height={40} mb="xs" />
                    <Skeleton height={16} width={100} radius="md" />
                    <Skeleton height={14} width={140} radius="md" />
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </div>

          {/* Track New Order Link */}
          <Flex justify="center" mt="xl">
            <Skeleton
              height={20}
              width={120}
              radius="md"
              style={{ backgroundColor: "#E03131" }}
            />
          </Flex>
        </div>
      </Container>
    </>
  );
};

export default OrderTrackingSkeleton;
