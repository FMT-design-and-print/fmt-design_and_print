import { OrderStatusTextRenderer } from "@/components/OrderStatusTextRenderer";
import { formatOrderStatus } from "@/functions/orders";
import { useUpdateOrder } from "@/hooks/admin/useUpdateOrder";
import { OrderStatus } from "@/types/order";
import { ActionIcon, Loader, Menu, Text } from "@mantine/core";
import { IconArrowRight, IconDotsVertical } from "@tabler/icons-react";
import { ReactNode } from "react";
import { toast } from "react-toastify";
import { ConfirmOrder } from "./ConfirmOrder";
import { QuoteModal } from "./Quote/QuoteModal";

interface Props {
  status: OrderStatus;
  orderId: string;
  totalAmount: number;
  numberOfItems: number;
  orderNumber: string;
}
export function OrderStatusOptions({
  status,
  orderId,
  orderNumber,
  numberOfItems,
  totalAmount,
}: Props) {
  const { mutate: updateOrder, isPending: isLoading } = useUpdateOrder();
  const updateStatus = (status: OrderStatus) => {
    updateOrder(
      {
        orderId,
        update: { status, updated_at: new Date() },
      },
      {
        onSuccess: () => close(),
        onError: () => toast.error("Failed to update order status. Try again!"),
      }
    );
  };

  if (status === "pending") {
    return (
      <ConfirmOrder
        orderId={orderId}
        orderNumber={orderNumber}
        totalAmount={totalAmount}
        numberOfItems={numberOfItems}
      />
    );
  }

  if (status === "requested") {
    return (
      <QuoteModal
        title="Create quote for order"
        orderId={orderId}
        orderNumber={orderNumber}
        triggerLabel="Create Quote"
      />
    );
  }

  if (status === "placed") {
    return (
      <MenuContainer
        options={["processing"]}
        updateStatus={updateStatus}
        isLoading={isLoading}
      />
    );
  }

  if (status === "processing") {
    return (
      <MenuContainer
        options={["packaging", "shipped", "ready"]}
        updateStatus={updateStatus}
        isLoading={isLoading}
      />
    );
  }

  if (status === "packaging") {
    return (
      <MenuContainer
        options={["shipped", "ready"]}
        updateStatus={updateStatus}
        isLoading={isLoading}
      />
    );
  }

  if (status === "shipped") {
    return (
      <MenuContainer
        options={["delivered", "completed"]}
        updateStatus={updateStatus}
        isLoading={isLoading}
      />
    );
  }

  if (status === "delivered") {
    return (
      <MenuContainer
        options={["completed"]}
        updateStatus={updateStatus}
        isLoading={isLoading}
      />
    );
  }

  if (status === "ready") {
    return (
      <MenuContainer
        options={["completed"]}
        updateStatus={updateStatus}
        isLoading={isLoading}
      />
    );
  }

  if (status === "pending-cancellation") {
    return (
      <MenuContainer
        options={["cancelled"]}
        updateStatus={updateStatus}
        isLoading={isLoading}
      />
    );
  }

  return <></>;
}

interface MenuContainerProps {
  options: OrderStatus[];
  updateStatus: (status: OrderStatus) => void;
  children?: ReactNode;
  isLoading: boolean;
}
const MenuContainer = ({
  options,
  children,
  updateStatus,
  isLoading,
}: MenuContainerProps) => {
  return (
    <Menu shadow="md" width={200}>
      {isLoading ? (
        <Loader size="xs" color="pink" />
      ) : (
        <Menu.Target>
          <ActionIcon
            variant="transparent"
            color="gray"
            size="xs"
            px="0"
            mx="0"
          >
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
      )}

      <Menu.Dropdown>
        {children}
        {options.map((option) => (
          <Menu.Item
            key={option}
            onClick={() => updateStatus(option)}
            color="gray"
            leftSection={<IconArrowRight size="0.7rem" />}
          >
            <OrderStatusTextRenderer status={option} />
            <Text size="10px">({formatOrderStatus(option)})</Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
