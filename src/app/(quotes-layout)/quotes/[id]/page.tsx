import { IQuote } from "@/types/quote";
import { createClient } from "@/utils/supabase/server";
import { Alert, Card, Center, Container, Text } from "@mantine/core";
import { cookies } from "next/headers";
import { Layout } from "./Layout";
import { QuoteStatusRenderer } from "./QuoteStatusRenderer";

interface Props {
  params: { id: string };
}

const QuotePage = async ({ params }: Props) => {
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

  if (data && data.length > 0) {
    const {
      status,
      numberOfReactivationRequested,
      quoteNumber,
      id,
      reactivationReasons,
    } = data[0];
    if (["paid", "cancelled", "expired"].includes(status))
      return (
        <Center py="xl">
          <QuoteStatusRenderer
            status={status}
            numberOfReactivationRequested={numberOfReactivationRequested}
            quoteId={id}
            quoteNumber={quoteNumber}
            reactivationReasons={reactivationReasons || []}
          />
        </Center>
      );
  }

  return (
    <Container size="md">
      <Card withBorder shadow="0" py={8} my={16}>
        {data && data.length > 0 && data[0].status === "active" ? (
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
