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
}

export const RatingModal = ({
  productId,
  user,
  opened,
  onClose,
}: RatingModalProps) => {
  const {
    userRating,
    newRating,
    setNewRating,
    comment,
    setComment,
    loading,
    isWithinThreeDays,
    handleSubmit,
  } = useRating({
    productId,
    user,
    onSuccess: onClose,
    skipPurchaseCheck: true,
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
      <RatingForm
        userRating={userRating}
        newRating={newRating}
        setNewRating={setNewRating}
        comment={comment}
        setComment={setComment}
        isWithinThreeDays={isWithinThreeDays}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
