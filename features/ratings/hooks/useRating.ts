import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { IRating, ICartItem } from "@/types";
import { notifications } from "@mantine/notifications";
import { IUserDetails } from "@/types/user";
import { ratingEvents } from "../utils/ratingEvents";

interface UseRatingProps {
  productId: string;
  user: IUserDetails | null;
  onSuccess?: () => void;
  skipPurchaseCheck?: boolean;
  orderId?: string;
}

export const useRating = ({
  productId,
  user,
  onSuccess,
  skipPurchaseCheck = false,
  orderId,
}: UseRatingProps) => {
  const [userRating, setUserRating] = useState<IRating | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [canRate, setCanRate] = useState(false);

  const supabase = createClient();

  const isWithinThreeDays = userRating
    ? Date.now() - new Date(userRating.created_at).getTime() <
      3 * 24 * 60 * 60 * 1000
    : true;

  useEffect(() => {
    if (user) {
      if (skipPurchaseCheck && orderId) {
        verifyOrderPayment();
      } else if (!skipPurchaseCheck) {
        checkUserCanRate();
      }
      fetchUserRating();
    } else {
      setLoading(false);
    }
  }, [user, productId, skipPurchaseCheck, orderId]);

  const verifyOrderPayment = async () => {
    if (!user || !orderId) return;

    const { data: order } = await supabase
      .from("orders")
      .select("paymentStatus")
      .eq("id", orderId)
      .single();

    setCanRate(order?.paymentStatus === "paid");
    setLoading(false);
  };

  const checkUserCanRate = async () => {
    if (!user) return;

    const { data: orders } = await supabase
      .from("orders")
      .select("items")
      .eq("user_id", user.id)
      .eq("paymentStatus", "paid");

    const hasPurchased = orders?.some((order) =>
      order.items.some((item: ICartItem) => item.id === productId)
    );

    setCanRate(Boolean(hasPurchased));
    setLoading(false);
  };

  const fetchUserRating = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("ratings")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setUserRating(data[0] as IRating);
      setNewRating(data[0].rating);
      setComment(data[0].update_comment || data[0].comment || "");
    }
    if (skipPurchaseCheck) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || (!canRate && !skipPurchaseCheck) || newRating === 0) return;

    try {
      const now = new Date().toISOString();

      if (userRating) {
        // If updating within 3 days and no previous update
        if (
          userRating.update_type === "original" &&
          Date.now() - new Date(userRating.created_at).getTime() <
            3 * 24 * 60 * 60 * 1000
        ) {
          const { error: updateError } = await supabase
            .from("ratings")
            .update({
              rating: newRating,
              comment: comment,
              updated_at: now,
            })
            .eq("id", userRating.id);

          if (updateError) throw updateError;
        } else {
          // Add update to existing rating
          const { error: updateError } = await supabase
            .from("ratings")
            .update({
              update_type: "update",
              update_comment: comment,
              update_date: now,
            })
            .eq("id", userRating.id);

          if (updateError) throw updateError;
        }
      } else {
        // Create new rating
        const newRatingData = {
          product_id: productId,
          user_id: user.id,
          rating: newRating,
          comment: comment,
          created_at: now,
          update_type: "original" as const,
        };

        const { error: insertError } = await supabase
          .from("ratings")
          .insert(newRatingData)
          .select()
          .single();

        if (insertError) throw insertError;
      }

      notifications.show({
        title: "Success",
        message: "Rating submitted successfully!",
        color: "green",
      });

      // Emit event before fetching new data
      ratingEvents.emit(productId);

      fetchUserRating();
      onSuccess?.();
    } catch (error) {
      console.error("Rating submission error:", error);
      notifications.show({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit rating. Please try again.",
        color: "red",
      });
    }
  };

  return {
    userRating,
    newRating,
    setNewRating,
    comment,
    setComment,
    loading,
    isWithinThreeDays,
    canRate,
    handleSubmit,
  };
};
