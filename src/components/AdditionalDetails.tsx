import { SelectedProductOptions } from "@/types";
import { Box, Text, Textarea } from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  note?: string;
  setSelectedProductOptions: Dispatch<SetStateAction<SelectedProductOptions>>;
}
export const AdditionalDetails = ({
  note,
  setSelectedProductOptions,
}: Props) => {
  return (
    <Box>
      <Text fw="bold">Leave a Note</Text>
      <Text size="sm" c="dimmed">
        Feel free to include any additional helpful details.
      </Text>
      <Textarea
        value={note}
        onChange={(e) =>
          setSelectedProductOptions((prevState) => ({
            ...prevState,
            note: e.currentTarget.value,
          }))
        }
        placeholder="Optional note"
      />
    </Box>
  );
};
