import { IQuote } from "@/types/quote";
import { createClient } from "@/utils/supabase/server";
import { Alert, Card, Center, Container, Text } from "@mantine/core";
import { Layout } from "./Layout";
import { QuoteStatusRenderer } from "./QuoteStatusRenderer";
import { QuoteTypeUpdater } from "./QuoteTypeUpdater";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import { Metadata } from "next";

type Params = {
  id: string;
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("quotes")
    .select("type, title")
    .eq("id", id)
    .single();

  const quoteTitle = data?.title;
  const type = data?.type || "quote";
  const title =
    (quoteTitle || `${type === "quote" ? "Quote" : "Invoice"}`) +
    " | FMT Design and Print";

  return generateMetaDetails(title);
}

const QuotePage = async ({ params }: { params: Promise<Params> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
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
      type,
      title,
    } = data[0];

    return (
      <>
        <QuoteTypeUpdater type={type} title={title} />
        {["paid", "cancelled", "expired"].includes(status) ? (
          <Center py="xl">
            <QuoteStatusRenderer
              status={status}
              numberOfReactivationRequested={numberOfReactivationRequested}
              quoteId={id}
              quoteNumber={quoteNumber}
              reactivationReasons={reactivationReasons || []}
            />
          </Center>
        ) : (
          <Container size="md">
            <Card withBorder shadow="0" py={8} my={16}>
              {data[0].status === "active" ? (
                <Layout quote={data[0]} />
              ) : (
                <Text ta="center" fs="italic" py="xl">
                  No item found
                </Text>
              )}
            </Card>
          </Container>
        )}
      </>
    );
  }

  return (
    <Container size="md">
      <Card withBorder shadow="0" py={8} my={16}>
        <Text ta="center" fs="italic" py="xl">
          No item found
        </Text>
      </Card>
    </Container>
  );
};

export default QuotePage;
