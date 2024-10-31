import {
  quoteStatusColors,
  quoteStatusLabels,
  quoteStatuses,
} from "@/constants/quote-statuses";
import { QuoteStatus } from "@/types/quote";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconArrowRight,
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const editExcludedStatuses = ["cancelled", "expired", "paid"];

interface Props {
  quoteId: string;
  orderId: string;
  status: QuoteStatus;
  editQuote: () => void;
}

export function QuoteMenu({ quoteId, orderId, status, editQuote }: Props) {
  const queryClient = useQueryClient();

  const handleUpdateQuoteStatus = async (status: QuoteStatus) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", quoteId)
      .select();

    if (error) {
      toast.error("Failed to update quote status. Try again!");
    } else {
      toast.success("Quote status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["quotes", orderId] });
    }
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="transparent" color="gray">
          <IconDotsVertical />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Action</Menu.Label>

        <Menu.Item
          leftSection={<IconPencil size="0.8rem" />}
          disabled={editExcludedStatuses.includes(status)}
          onClick={() => editQuote()}
        >
          Edit
        </Menu.Item>

        <Menu.Item
          color="red"
          leftSection={<IconTrash size="0.8rem" />}
          // disabled={status === "active" || status === "paid"}
          disabled
        >
          Delete
        </Menu.Item>
        {status !== "paid" && (
          <>
            <Menu.Divider />
            <Menu.Label>Set as</Menu.Label>
            {quoteStatuses
              .filter((s) => s !== status)
              .map((status) => (
                <Menu.Item
                  key={status}
                  onClick={() => handleUpdateQuoteStatus(status)}
                  color={quoteStatusColors[status]}
                  leftSection={<IconArrowRight size="0.8rem" />}
                >
                  {quoteStatusLabels[status] || status}
                </Menu.Item>
              ))}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
