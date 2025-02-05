"use client";
import { Modal, Text } from "@mantine/core";
import { useRating } from "./hooks/useRating";
import { RatingForm } from "./components/RatingForm";
import { IUserDetails } from "@/types/user";

interface RatingModalProps {
  productId: string;
  user: IUserDetails | null;
  opened: boolean;
  onClose: () => void;
  orderId: string;
}

export const RatingModal = ({
  productId,
  user,
  opened,
  onClose,
  orderId,
}: RatingModalProps) => {
  const {
    userRating,
    newRating,
    setNewRating,
    comment,
    setComment,
    loading,
    isWithinThreeDays,
    canRate,
    handleSubmit,
  } = useRating({
    productId,
    user,
    onSuccess: onClose,
    skipPurchaseCheck: true,
    orderId,
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Rate Product"
      size="lg"
      centered
    >
      {canRate ? (
        <RatingForm
          userRating={userRating}
          newRating={newRating}
          setNewRating={setNewRating}
          comment={comment}
          setComment={setComment}
          isWithinThreeDays={isWithinThreeDays}
          onSubmit={handleSubmit}
        />
      ) : (
        <Text c="dimmed">You can only rate products from paid orders.</Text>
      )}
    </Modal>
  );
};
