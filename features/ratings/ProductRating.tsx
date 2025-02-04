"use client";
import { Stack, Text, Box, Group, Divider } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { useRating } from "./hooks/useRating";
import { useRatingStats } from "./hooks/useRatingStats";
import { RatingForm } from "./components/RatingForm";
import { RatingStars } from "./RatingStars";

interface ProductRatingProps {
  productId: string;
  user: User | null;
}

export const ProductRating = ({ productId, user }: ProductRatingProps) => {
  const {
    userRating,
    newRating,
    setNewRating,
    comment,
    setComment,
    loading: ratingLoading,
    isWithinThreeDays,
    canRate,
    handleSubmit,
  } = useRating({
    productId,
    user,
  });

  const { ratingStats, loading: statsLoading } = useRatingStats(productId);

  if (ratingLoading || statsLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack gap="lg">
      <Box>
        <Text size="lg" fw={600}>
          Product Rating
        </Text>
        <RatingStars productId={productId} size="sm" />
      </Box>

      {user ? (
        canRate ? (
          <RatingForm
            userRating={userRating}
            newRating={newRating}
            setNewRating={setNewRating}
            comment={comment}
            setComment={setComment}
            isWithinThreeDays={isWithinThreeDays}
            onSubmit={handleSubmit}
            size="lg"
          />
        ) : (
          <Text c="dimmed">
            Only verified purchasers can rate this product.
          </Text>
        )
      ) : (
        <Text c="dimmed">Please log in to rate this product.</Text>
      )}

      <Divider my="lg" />

      {/* Rating Distribution */}
      <Stack gap="xs">
        <Text fw={500}>Rating Distribution</Text>
        {Object.entries(ratingStats.ratingDistribution)
          .reverse()
          .map(([rating, count]) => (
            <Group key={rating} gap="xs" wrap="nowrap">
              <Text w={32}>{rating}★</Text>
              <Box
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: "var(--mantine-color-gray-2)",
                  borderRadius: "var(--mantine-radius-xl)",
                  overflow: "hidden",
                }}
              >
                <Box
                  style={{
                    height: "100%",
                    backgroundColor: "var(--mantine-color-pink-4)",
                    width: `${
                      ratingStats.totalRatings > 0
                        ? (count / ratingStats.totalRatings) * 100
                        : 0
                    }%`,
                  }}
                />
              </Box>
              <Text size="sm" c="dimmed" w={32}>
                {count}
              </Text>
            </Group>
          ))}
      </Stack>
    </Stack>
  );
};
