import { QuoteStatus } from "@/types/quote";
import { Badge } from "@mantine/core";
import React from "react";

export const QuoteStatusRenderer = ({ status }: { status: QuoteStatus }) => {
  if (status === "paid") {
    return (
      <Badge variant="light" size="sm" color="green">
        {status}
      </Badge>
    );
  }

  if (status === "cancelled") {
    return (
      <Badge variant="light" size="sm" color="red">
        {status}
      </Badge>
    );
  }

  if (status === "expired") {
    return (
      <Badge variant="light" size="sm" color="yellow">
        {status}
      </Badge>
    );
  }

  if (status === "active") {
    return (
      <Badge variant="light" size="sm" color="blue">
        {status}
      </Badge>
    );
  }

  if (status === "created") {
    return (
      <Badge variant="light" size="sm" color="gray">
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant="light" size="sm" color="gray">
      {status}
    </Badge>
  );
};
