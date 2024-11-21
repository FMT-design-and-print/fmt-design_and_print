import { statusColor } from "@/constants/status-colors";
import { getOrderStatusText } from "@/functions";
import { OrderStatus } from "@/types/order";
import { Badge, BadgeProps } from "@mantine/core";

interface Props {
  status: OrderStatus;
}

const defaultBadgeProps: BadgeProps = {
  variant: "light",
  size: "xs",
};
export const OrderStatusRenderer = ({ status }: Props) => {
  const statusText = getOrderStatusText(status);

  if (status === "pending") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "pending-cancellation") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "cancelled") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "completed") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "shipped") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "delivered") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "packaging") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "ready") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "processing") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {statusText}
      </Badge>
    );
  }

  if (status === "placed") {
    return (
      <Badge {...defaultBadgeProps} color={statusColor[status]}>
        {`${statusText}`}
      </Badge>
    );
  }

  return (
    <Badge {...defaultBadgeProps} color="gray">
      {statusText}
    </Badge>
  );
};
