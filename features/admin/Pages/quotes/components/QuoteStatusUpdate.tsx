import { QuoteStatus } from "@/types/quote";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Group, Select } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "./ConfirmationDialog";
interface QuoteStatusUpdateProps {
  quoteId: string;
  currentStatus: QuoteStatus;
  onUpdate: () => void;
}

export function QuoteStatusUpdate({
  quoteId,
  currentStatus,
  onUpdate,
}: QuoteStatusUpdateProps) {
  const [status, setStatus] = useState<QuoteStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (currentStatus === "paid") {
    return (
      <Group gap="xs">
        <Select
          value={currentStatus}
          data={[{ value: "paid", label: "Paid" }]}
          style={{ width: 100 }}
          disabled
          size="xs"
        />
      </Group>
    );
  }

  const handleUpdate = async () => {
    if (status === currentStatus) return;

    const supabase = createClient();
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", quoteId);

      if (error) throw error;
      toast.success("Status updated successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
      setStatus(currentStatus); // Reset on error
    } finally {
      setIsUpdating(false);
      setShowConfirmation(false);
    }
  };

  const getConfirmationMessage = () => {
    if (status === "active") {
      return "Activating a quote will make it visible to the client. Continue?";
    }
    if (status === "cancelled") {
      return "Are you sure you want to cancel this quote?";
    }
    return `Are you sure you want to change the status to ${status}?`;
  };

  return (
    <>
      <Group gap="xs">
        <Select
          value={status}
          onChange={(value) => setStatus(value as QuoteStatus)}
          data={[
            { value: "created", label: "Created" },
            { value: "active", label: "Active" },
            { value: "paid", label: "Paid" },
            { value: "cancelled", label: "Cancelled" },
            { value: "expired", label: "Expired" },
          ]}
          style={{ width: 100 }}
          size="xs"
        />
        {status !== currentStatus && (
          <ActionIcon
            color="pink"
            variant="filled"
            onClick={() => setShowConfirmation(true)}
            loading={isUpdating}
          >
            <IconCheck size={16} />
          </ActionIcon>
        )}
      </Group>

      <ConfirmationDialog
        opened={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setStatus(currentStatus);
        }}
        onConfirm={handleUpdate}
        title="Update Status"
        message={getConfirmationMessage()}
        isLoading={isUpdating}
      />
    </>
  );
}
