"use client";
import { NoItemsFound } from "@/components/NoItemsFound";
import { Container, Title } from "@mantine/core";
import { FiInbox } from "react-icons/fi";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedItems: any[];
}
export const SavedItems = ({ savedItems }: Props) => {
  return (
    <Container size="lg">
      <Title order={3} c="dimmed" mb="md">
        Saved Items
      </Title>

      {savedItems.length === 0 ? (
        <NoItemsFound
          icon={
            <FiInbox size="10rem" style={{ color: "var(--primary-300)" }} />
          }
        />
      ) : (
        <>{/* saved items */}</>
      )}
    </Container>
  );
};
