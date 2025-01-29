import { IQuote, QuoteStatus } from "@/types/quote";
import { createClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  Center,
  Group,
  Loader,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  IconEdit,
  IconTrash,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";
import { type SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQuotes } from "../hooks/useQuotes";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { QuoteStatusUpdate } from "./QuoteStatusUpdate";
import { SortableHeader } from "./SortableHeader";
import { useClipboard } from "@mantine/hooks";
import { QuoteMessageButton } from "@/components/QuoteMessageButton";

const getDefaultMessage = (quote: IQuote) => {
  const documentType = quote.type === "invoice" ? "invoice" : "quote";

  return `We received a custom order request from you. we've create ${documentType} for you to review and make payment upon acceptance.`;
};

const cellStyle = {
  maxWidth: "200px",
  whiteSpace: "nowrap" as const,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export function QuotesList({ onEdit }: { onEdit: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<QuoteStatus | "">("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const debouncedSearch = useDebouncedValue(search, 300);
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const clipboard = useClipboard();

  const { data, isLoading, refetch } = useQuotes({
    search: debouncedSearch[0],
    status: status || undefined,
    sorting,
    page,
    pageSize,
  });

  const quotes = data?.data;
  const totalPages = data?.totalPages ?? 0;

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "created", label: "Created" },
    { value: "active", label: "Active" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
    { value: "expired", label: "Expired" },
  ];

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("quotes").delete().eq("id", id);

      if (error) throw error;
      toast.success("Quote deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete quote");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setDeleteQuoteId(null);
    }
  };

  const currentSort = sorting[0];

  const handleSort = (field: string) => {
    setSorting((current) => {
      const currentSort = current[0];

      if (!currentSort || currentSort.id !== field) {
        return [{ id: field, desc: false }];
      }

      if (!currentSort.desc) {
        return [{ id: field, desc: true }];
      }

      return [];
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getQuoteUrl = (id: string) => {
    return `${window.location.origin}/quotes/${id}`;
  };

  const handleCopyUrl = (id: string) => {
    clipboard.copy(getQuoteUrl(id));
    toast.success("URL copied to clipboard");
  };

  const handleOpenInNewTab = (id: string) => {
    window.open(getQuoteUrl(id), "_blank");
  };

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader color="pink" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Group mb="md">
        <TextInput
          placeholder="Search quotes..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          data={statusOptions}
          value={status}
          onChange={(value) => setStatus(value as QuoteStatus)}
          placeholder="Filter by status"
          clearable
        />
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <SortableHeader
              label="No.(#)"
              field="quoteNumber"
              currentSort={currentSort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Title"
              field="title"
              currentSort={currentSort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Client"
              field="clientName"
              currentSort={currentSort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Total Amount"
              field="totalAmount"
              currentSort={currentSort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Status"
              field="status"
              currentSort={currentSort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Due Date"
              field="dueDate"
              currentSort={currentSort}
              onSort={handleSort}
            />
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!quotes?.length ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Center py="xl">
                  <Text c="dimmed" size="lg">
                    No quotes found
                  </Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : (
            quotes.map((quote: IQuote) => (
              <Table.Tr key={quote.id}>
                <Table.Td style={{ width: 100 }}>{quote.quoteNumber}</Table.Td>
                <Table.Td style={cellStyle}>
                  <Tooltip label={quote.title} multiline>
                    <Text size="sm" truncate>
                      {quote.title}
                    </Text>
                  </Tooltip>
                </Table.Td>
                <Table.Td style={cellStyle}>
                  <Tooltip label={quote.clientName} multiline>
                    <Text size="sm" truncate>
                      {quote.clientName}
                    </Text>
                  </Tooltip>
                </Table.Td>
                <Table.Td>${quote.totalAmount.toFixed(2)}</Table.Td>
                <Table.Td>
                  <QuoteStatusUpdate
                    quoteId={quote.id}
                    currentStatus={quote.status}
                    onUpdate={refetch}
                  />
                </Table.Td>
                <Table.Td>
                  <Text size="xs">{formatDate(quote.dueDate)}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={8}>
                    <ActionIcon
                      variant="subtle"
                      color="pink"
                      onClick={() => onEdit(quote.id)}
                      disabled={quote.status === "paid"}
                      title={
                        quote.status === "paid"
                          ? "Paid quotes cannot be edited"
                          : ""
                      }
                      size="sm"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    {quote.status === "active" && (
                      <QuoteMessageButton
                        variant="icon"
                        label={`Message ${quote.clientName}`}
                        title={`Send Message to ${quote.clientName}`}
                        defaultMessage={getDefaultMessage(quote)}
                        orderDetails={quote.orderDetails}
                        clientName={quote.clientName}
                        quoteUrl={getQuoteUrl(quote.id)}
                        quoteTitle={quote.title}
                      />
                    )}
                    {quote.status === "active" && (
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleCopyUrl(quote.id)}
                        title="Copy URL"
                        size="sm"
                      >
                        <IconCopy size={16} />
                      </ActionIcon>
                    )}
                    {quote.status === "active" && (
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => handleOpenInNewTab(quote.id)}
                        title="Open in new tab"
                        size="sm"
                      >
                        <IconExternalLink size={16} />
                      </ActionIcon>
                    )}
                    {quote.status !== "active" && quote.status !== "paid" && (
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => setDeleteQuoteId(quote.id)}
                        size="sm"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <Group justify="center">
        <Pagination
          value={page}
          onChange={setPage}
          total={totalPages}
          color="pink"
        />
      </Group>

      <ConfirmationDialog
        opened={!!deleteQuoteId}
        onClose={() => setDeleteQuoteId(null)}
        onConfirm={() => deleteQuoteId && handleDelete(deleteQuoteId)}
        title="Delete Quote"
        message="Are you sure you want to delete this quote? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Stack>
  );
}
