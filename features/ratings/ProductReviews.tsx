"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { IRating } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { User } from "@supabase/supabase-js";
import {
  Avatar,
  Card,
  Text,
  Stack,
  Group,
  Box,
  Divider,
  Button,
  ScrollArea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { RatingStars } from "./RatingStars";
import { ratingEvents } from "./utils/ratingEvents";

interface ProductReviewsProps {
  productId: string;
  user: User | null;
}

interface ReviewWithUser extends IRating {
  user: {
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  };
}

export const ProductReviews = ({ productId, user }: ProductReviewsProps) => {
  const supabase = createClient();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();

    // Subscribe to rating updates
    const unsubscribe = ratingEvents.subscribe(productId, fetchReviews);

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("ratings")
      .select(
        `
        *,
        user:users (
          firstName,
          lastName,
          profileImage
        )
      `
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (data && !error) {
      setReviews(data as unknown as ReviewWithUser[]);
    }
    setLoading(false);
  };

  const handleDeleteUpdate = async (reviewId: string) => {
    if (!user) return;

    try {
      const { error: updateError } = await supabase
        .from("ratings")
        .update({
          update_type: "original",
          update_comment: null,
          update_date: null,
        })
        .eq("id", reviewId);

      if (updateError) throw updateError;

      notifications.show({
        title: "Success",
        message: "Update comment deleted successfully!",
        color: "green",
      });
      fetchReviews();
    } catch (error) {
      console.error("Delete update error:", error);
      notifications.show({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete update. Please try again.",
        color: "red",
      });
    }
  };

  if (loading) {
    return <Text>Loading reviews...</Text>;
  }

  if (reviews.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No reviews yet. Be the first to review this product!
      </Text>
    );
  }

  return (
    <Stack gap="xl">
      <Group align="center">
        <Text size="lg" fw={600}>
          Customer Reviews
        </Text>
        <RatingStars productId={productId} size="sm" />
      </Group>
      <Stack gap="md">
        <ScrollArea.Autosize mah="800px" type="hover">
          {reviews.map((review) => (
            <Card key={review.id} withBorder my={16}>
              <Stack gap="md">
                <Group>
                  <Avatar
                    src={review.user?.profileImage}
                    alt={`${review.user?.firstName || "Unknown"}'s profile`}
                    radius="xl"
                  >
                    {review.user?.firstName?.[0] || "U"}
                  </Avatar>
                  <Box>
                    <Text fw={500}>
                      {review.user?.firstName || "Unknown"}{" "}
                      {review.user?.lastName || "User"}
                    </Text>
                    <Group gap="xs">
                      <RatingStars
                        size="sm"
                        showCount={false}
                        value={review.rating}
                      />
                      <Text size="sm" c="dimmed">
                        {formatDistanceToNow(new Date(review.created_at), {
                          addSuffix: true,
                        })}
                      </Text>
                    </Group>
                  </Box>
                </Group>

                {review.comment && <Text>{review.comment}</Text>}

                {review.update_type === "update" && review.update_comment && (
                  <>
                    <Divider />
                    <Box
                      pl="md"
                      style={{
                        borderLeft: "2px solid var(--mantine-color-blue-1)",
                      }}
                    >
                      <Group justify="space-between" align="flex-start">
                        <Text size="sm" c="dimmed" mb="xs">
                          Updated{" "}
                          {formatDistanceToNow(new Date(review.update_date!), {
                            addSuffix: true,
                          })}
                        </Text>
                        {user?.id === review.user_id && (
                          <Button
                            variant="subtle"
                            color="red"
                            size="xs"
                            onClick={() => handleDeleteUpdate(review.id)}
                          >
                            Delete Update
                          </Button>
                        )}
                      </Group>
                      <Text>{review.update_comment}</Text>
                    </Box>
                  </>
                )}
              </Stack>
            </Card>
          ))}
        </ScrollArea.Autosize>
      </Stack>
    </Stack>
  );
};
