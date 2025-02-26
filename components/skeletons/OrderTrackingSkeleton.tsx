import { Box, Container, Flex, Skeleton, Stack } from "@mantine/core";

const OrderTrackingSkeleton = () => {
  return (
    <>
      {/* Header */}
      <Skeleton height={60} radius={0} />

      {/* Main Content */}
      <Container size="xl" mt={50}>
        {/* Page Title and Description */}
        <Flex direction="column" align="center" mb="xl">
          <Skeleton
            height={40}
            w={{ base: "90%", sm: 200 }}
            radius="md"
            mb="md"
          />
          <Skeleton height={20} w={{ base: "100%", sm: 500 }} radius="md" />
        </Flex>

        {/* Order Info Card */}
        <Box mx="auto" style={{ maxWidth: 800 }}>
          {/* Order Summary Header */}
          <Box bg="#f8f9fa" p={{ base: "sm", sm: "md" }}>
            {/* Desktop View */}
            <Flex
              justify="space-between"
              align="center"
              display={{ base: "none", sm: "flex" }}
            >
              <Flex gap="xl">
                <Stack gap={4}>
                  <Skeleton height={16} w={80} radius="md" />
                  <Skeleton height={20} w={120} radius="md" />
                </Stack>
                <Stack gap={4}>
                  <Skeleton height={16} w={40} radius="md" />
                  <Skeleton height={20} w={60} radius="md" />
                </Stack>
                <Stack gap={4}>
                  <Skeleton height={16} w={60} radius="md" />
                  <Skeleton height={20} w={200} radius="md" />
                </Stack>
              </Flex>
              <Stack gap={4} align="flex-end">
                <Skeleton height={16} w={50} radius="md" />
                <Skeleton height={20} w={80} radius="md" />
              </Stack>
            </Flex>

            {/* Mobile View */}
            <Stack gap="sm" display={{ base: "flex", sm: "none" }}>
              <Stack gap={4}>
                <Skeleton height={16} w="40%" radius="md" />
                <Skeleton height={20} w="60%" radius="md" />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={16} w="30%" radius="md" />
                <Skeleton height={20} w="40%" radius="md" />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={16} w="35%" radius="md" />
                <Skeleton height={20} w="80%" radius="md" />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={16} w="30%" radius="md" />
                <Skeleton height={20} w="50%" radius="md" />
              </Stack>
            </Stack>
          </Box>

          {/* Order Status */}
          <Box p={{ base: "md", sm: "30px 20px" }}>
            <Stack gap="xl">
              {/* Status and Delivery Date */}
              <Flex
                justify="space-between"
                direction={{ base: "column", sm: "row" }}
                gap={{ base: "md", sm: 0 }}
                mb="lg"
              >
                <Flex gap="md" align="center">
                  <Skeleton
                    height={20}
                    w={{ base: "30%", sm: 100 }}
                    radius="md"
                  />
                  <Skeleton
                    height={24}
                    w={{ base: "40%", sm: 100 }}
                    radius="md"
                    style={{ backgroundColor: "#E03131" }}
                  />
                </Flex>
                <Flex gap="md" align="center">
                  <Skeleton
                    height={20}
                    w={{ base: "40%", sm: 150 }}
                    radius="md"
                  />
                  <Skeleton
                    height={24}
                    w={{ base: "30%", sm: 120 }}
                    radius="md"
                  />
                </Flex>
              </Flex>

              {/* Progress Steps */}
              <Box pos="relative" py="md">
                {/* Progress Line */}
                <Box
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "#dee2e6",
                    zIndex: 0,
                  }}
                />

                {/* Step Items */}
                <Flex
                  justify="space-between"
                  align="center"
                  direction={{ base: "column", sm: "row" }}
                  gap={{ base: "xl", sm: 0 }}
                >
                  {[1, 2, 3, 4].map((step) => (
                    <Stack
                      key={step}
                      align="center"
                      gap="sm"
                      w={{ base: "100%", sm: "auto" }}
                      style={{
                        zIndex: 1,
                        background: "white",
                        padding: "0 10px",
                      }}
                    >
                      <Skeleton circle h={40} w={40} mb="xs" />
                      <Skeleton
                        height={16}
                        w={{ base: "60%", sm: 100 }}
                        radius="md"
                      />
                      <Skeleton
                        height={14}
                        w={{ base: "80%", sm: 140 }}
                        radius="md"
                      />
                    </Stack>
                  ))}
                </Flex>
              </Box>
            </Stack>
          </Box>

          {/* Track New Order Link */}
          <Flex justify="center" mt="xl">
            <Skeleton
              height={20}
              w={{ base: "80%", sm: 120 }}
              radius="md"
              style={{ backgroundColor: "#E03131" }}
            />
          </Flex>
        </Box>
      </Container>
    </>
  );
};

export default OrderTrackingSkeleton;
