import { useState, useMemo } from "react";
import { Table, ScrollArea, Select, Text, Group, Paper, Title, TextInput } from "@mantine/core";
import { format } from "date-fns";
import { PageView, Visitor } from "@/hooks/admin/useVisitorAnalytics";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";

interface PageViewsProps {
  pageViews: PageView[] | undefined;
  visitors: Visitor[] | undefined;
}

export const PageViews = ({ pageViews, visitors }: PageViewsProps) => {
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null);
  const [searchUrl, setSearchUrl] = useState("");

  const filteredViews = useMemo(() => {
    if (!pageViews) return [];
    let filtered = pageViews;

    if (selectedVisitor) {
      filtered = filtered.filter((pv) => pv.visitor_id === selectedVisitor);
    }

    if (searchUrl) {
      filtered = filtered.filter((pv) => 
        pv.url.toLowerCase().includes(searchUrl.toLowerCase())
      );
    }

    return filtered;
  }, [pageViews, selectedVisitor, searchUrl]);

  const visitorOptions = useMemo(() => {
    if (!visitors) return [];
    return visitors.map((v) => ({
      value: v.id,
      label: `${v.ip_address || "Unknown IP"} - ${v.country || "Unknown Location"}`,
    }));
  }, [visitors]);

  return (
    <Paper p="md" withBorder radius="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Page Views History</Title>
        <Group>
            <TextInput
            placeholder="Search URL..."
            leftSection={<IconSearch size={16} />}
            value={searchUrl}
            onChange={(event) => setSearchUrl(event.currentTarget.value)}
            style={{ width: 300 }}
            />
          <Select
            placeholder="Filter by Visitor"
            data={visitorOptions}
            value={selectedVisitor}
            onChange={setSelectedVisitor}
            clearable
            searchable
            style={{ width: 300 }}
          />
        </Group>
      </Group>

      <ScrollArea h={600}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>Visitor</Table.Th>
              <Table.Th>Referrer</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredViews.map((view) => {
              const visitor = visitors?.find(
                (v) =>
                  v.id === view.visitor_id ||
                  (v.visitor_id && v.visitor_id === view.visitor_id)
              );
              return (
                <Table.Tr key={view.id}>
                  <Table.Td>
                    {format(new Date(view.created_at), "yyyy MMM dd HH:mm:aa")}
                  </Table.Td>
                  <Table.Td style={{ maxWidth: 300 }} className="truncate" title={view.url}>
                    <Link href={view.url} target="_blank" rel="noopener noreferrer">
                      <Text size="sm" truncate>{view.url}</Text>
                    </Link>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {visitor ? (
                        <>
                          {visitor.ip_address}  - {' '}
                          <Text span c="dimmed" size="xs">
                            {visitor?.country || "Unknown"}-{visitor?.region || "Unknown"}
                          </Text>
                        </>
                      ) : (
                        view.visitor_id
                      )}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ maxWidth: 200 }} className="truncate">
                     <Text size="xs" truncate>{view.referrer || "-"}</Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
             {filteredViews.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed">No page views found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};
