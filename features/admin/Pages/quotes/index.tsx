import { Button, Container, Group, Title } from "@mantine/core";
import { useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QuoteForm } from "./components/QuoteForm";
import { QuotesList } from "./components/QuotesList";
import { IconPlus } from "@tabler/icons-react";

type Section = "list" | "create" | "edit";

export default function QuotesPage() {
  const [currentSection, setCurrentSection] = useState<Section>("list");
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);

  const handleNavigateToCreate = () => {
    setCurrentSection("create");
  };

  const handleNavigateToList = () => {
    setCurrentSection("list");
    setEditQuoteId(null);
  };

  const handleNavigateToEdit = (quoteId: string) => {
    setEditQuoteId(quoteId);
    setCurrentSection("edit");
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Quotes & Invoices</Title>
        {currentSection === "list" ? (
          <Button
            color="pink"
            onClick={handleNavigateToCreate}
            size="xs"
            leftSection={<IconPlus size={16} />}
          >
            Create New
          </Button>
        ) : (
          <Button variant="subtle" color="pink" onClick={handleNavigateToList}>
            Back to List
          </Button>
        )}
      </Group>

      <ErrorBoundary>
        {currentSection === "list" && (
          <QuotesList onEdit={handleNavigateToEdit} />
        )}

        {currentSection === "create" && (
          <QuoteForm onSuccess={handleNavigateToList} />
        )}

        {currentSection === "edit" && editQuoteId && (
          <QuoteForm quoteId={editQuoteId} onSuccess={handleNavigateToList} />
        )}
      </ErrorBoundary>
    </Container>
  );
}
