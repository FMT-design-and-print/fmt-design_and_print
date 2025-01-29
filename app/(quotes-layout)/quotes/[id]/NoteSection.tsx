import { Box, Text } from "@mantine/core";
import { Paper } from "@mantine/core";
import React from "react";

interface Props {
  note: {
    paymentDetails?: string;
    AdditionalInformation?: string;
    thankYou?: string;
  };
}

export const NoteSection = ({ note }: Props) => {
  return (
    <>
      <Text fw={500} size="sm" mb={2}>
        Note:
      </Text>
      <Paper withBorder p="md" mt="md" bg="gray.0">
        <Box>
          {note.paymentDetails && (
            <Text size="sm" mt={4} style={{ whiteSpace: "pre-line" }}>
              <span className="font-bold block mb-2">Payment Details</span>
              {note.paymentDetails}
            </Text>
          )}
          {note.AdditionalInformation && (
            <Text size="sm" mt={16} style={{ whiteSpace: "pre-line" }}>
              <span className="font-bold block mb-2">
                Additional Information
              </span>
              {note.AdditionalInformation}
            </Text>
          )}
          {note.thankYou && (
            <Text
              size="sm"
              fs="italic"
              mt={16}
              c="gray.6"
              style={{ whiteSpace: "pre-line" }}
            >
              {note.thankYou}
            </Text>
          )}
        </Box>
      </Paper>
    </>
  );
};
