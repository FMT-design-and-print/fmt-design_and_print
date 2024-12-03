import { Modal, Button, Group } from "@mantine/core";
import { Receipt } from "@/types/receipts";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ReceiptPrint } from "./ReceiptPrint";

interface PrintModalProps {
  receipt: Receipt;
  opened: boolean;
  onClose: () => void;
}

export function PrintModal({ receipt, opened, onClose }: PrintModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Receipt",
    contentRef,
  });

  if (!receipt) return null;

  return (
    <Modal opened={opened} onClose={onClose} size="xl" title="Print Receipt">
      <div>
        <ReceiptPrint receipt={receipt} />
      </div>
      <div ref={contentRef} className="printable-content">
        <ReceiptPrint receipt={receipt} />
      </div>
      <Group justify="center" mt="xl">
        <Button onClick={() => handlePrint()} color="pink">
          Print Receipt
        </Button>
      </Group>
    </Modal>
  );
}
