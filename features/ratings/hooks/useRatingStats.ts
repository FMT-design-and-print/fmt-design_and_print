import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { IRatingStats } from "@/types";

export const useRatingStats = (productId: string) => {
  const [ratingStats, setRatingStats] = useState<IRatingStats>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchRatingStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchRatingStats = async () => {
    const { data: ratings } = await supabase
      .from("ratings")
      .select("rating")
      .eq("product_id", productId);

    if (ratings) {
      const distribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      ratings.forEach((r) => {
        distribution[r.rating as keyof typeof distribution]++;
      });

      const total = ratings.length;
      const average =
        total > 0
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / total
          : 0;

      setRatingStats({
        averageRating: Number(average.toFixed(1)),
        totalRatings: total,
        ratingDistribution: distribution,
      });
    }
    setLoading(false);
  };

  return { ratingStats, loading };
};
