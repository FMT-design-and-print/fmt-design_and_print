import { IQuote } from "@/types/quote";
import { createClient } from "@/utils/supabase/server";
import { Alert, Card, Container, Text } from "@mantine/core";
import { cookies } from "next/headers";
import { Layout } from "./Layout";

interface Props {
  params: { id: string };
}

const QuotePage = async ({ params }: Props) => {
  // db request to load quote
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", params.id)
    .returns<IQuote[]>();

  if (error) {
    return (
      <Alert color="red" variant="light" mt="md" py="xl">
        <Text ta="center" c="red.6" fs="italic" size="sm">
          Error Loading data. Try again!
        </Text>
      </Alert>
    );
  }

  return (
    <Container size="md">
      <Card withBorder shadow="0" py={8} my={16}>
        {data && data.length > 0 ? (
          <Layout quote={data[0]} />
        ) : (
          <Text ta="center" fs="italic" py="xl">
            No item found
          </Text>
        )}
      </Card>
    </Container>
  );
};

export default QuotePage;
