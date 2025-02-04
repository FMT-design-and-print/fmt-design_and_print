import { Group, Rating, Text } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface ItemRatingProps {
  productId?: string;
  showCount?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  readOnly?: boolean;
  value?: number;
  onChange?: (value: number) => void;
}

export const RatingStars = ({
  productId,
  showCount = true,
  size = "xs",
  color = "pink",
  readOnly = true,
  value,
  onChange,
}: ItemRatingProps) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (productId) {
      fetchRatingStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchRatingStats = async () => {
    if (!productId) return;

    const { data: ratings } = await supabase
      .from("ratings")
      .select("rating")
      .eq("product_id", productId);

    if (ratings) {
      const total = ratings.length;
      const average =
        total > 0
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / total
          : 0;

      setAverageRating(Number(average.toFixed(1)));
      setTotalRatings(total);
    }
  };

  return (
    <Group gap="xs">
      <Rating
        size={size}
        value={value ?? averageRating}
        fractions={2}
        readOnly={readOnly}
        color={color}
        onChange={onChange}
      />
      {showCount && (
        <Text size={size} c="dimmed">
          ({totalRatings})
        </Text>
      )}
    </Group>
  );
};
