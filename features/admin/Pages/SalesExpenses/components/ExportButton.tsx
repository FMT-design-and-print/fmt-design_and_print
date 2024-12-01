import { Button } from "@mantine/core";
import { CSVLink } from "react-csv";
import { IconDownload } from "@tabler/icons-react";
import { ISales, Expenses } from "@/types/sales-expenses";
import { formatDate } from "../utils";

interface ExportButtonProps {
  data: (ISales | Expenses)[];
  filename: string;
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const headers = [
    { label: "Description", key: "description" },
    { label: "Amount", key: "amount" },
    { label: "Created By", key: "createdBy.name" },
    { label: "Created At", key: "created_at" },
  ];

  const csvData = data.map((item) => ({
    description: item.description,
    amount: "totalAmount" in item ? item.totalAmount : item.amount,
    "createdBy.name": item.createdBy.name,
    created_at: formatDate(item.created_at),
  }));

  return (
    <CSVLink
      data={csvData}
      headers={headers}
      filename={`${filename}-${formatDate(new Date())}.csv`}
      style={{ textDecoration: "none" }}
    >
      <Button
        variant="light"
        color="pink"
        leftSection={<IconDownload size="1rem" />}
        size="sm"
        w="100%"
      >
        Export to CSV
      </Button>
    </CSVLink>
  );
}
