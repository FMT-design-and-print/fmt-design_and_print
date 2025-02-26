import { Button, Textarea, Stack, Text, Box } from "@mantine/core";
import { RatingStars } from "../RatingStars";
import { IRating } from "@/types";

interface RatingFormProps {
  userRating: IRating | null;
  newRating: number;
  setNewRating: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  isWithinThreeDays: boolean;
  onSubmit: () => void;
  size?: "sm" | "lg";
}

export const RatingForm = ({
  userRating,
  newRating,
  setNewRating,
  comment,
  setComment,
  isWithinThreeDays,
  onSubmit,
  size = "lg",
}: RatingFormProps) => {
  return (
    <Stack gap="md">
      <Box>
        <Text fw={500} mb="xs">
          Your Rating
        </Text>
        <RatingStars
          value={newRating}
          onChange={isWithinThreeDays ? setNewRating : undefined}
          readOnly={!isWithinThreeDays}
          size={size}
          showCount={false}
        />
      </Box>
      <Box>
        {isWithinThreeDays ? (
          <>
            <Text fw={500} mb="xs">
              Your Review
            </Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              minRows={size === "lg" ? 8 : 4}
              resize="vertical"
            />
          </>
        ) : userRating ? (
          <>
            <Text fw={500} mb="xs">
              Original Review
            </Text>
            <Textarea
              value={userRating.comment || ""}
              readOnly
              minRows={size === "lg" ? 8 : 4}
              resize="none"
              styles={{
                input: { backgroundColor: "var(--mantine-color-gray-0)" },
              }}
            />
            <Text fw={500} mt="md" mb="xs">
              Update Your Review
            </Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add an update to your review..."
              minRows={size === "lg" ? 8 : 4}
              resize="vertical"
            />
          </>
        ) : null}
      </Box>
      <Button
        onClick={onSubmit}
        disabled={newRating === 0}
        variant="filled"
        className="btn"
        w="200px"
      >
        {userRating
          ? isWithinThreeDays
            ? "Update Rating"
            : "Add Review Update"
          : "Submit Rating"}
      </Button>
    </Stack>
  );
};
