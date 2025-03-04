"use client";
import { NoItemsFound } from "@/components/NoItemsFound";
import { ICustomOrder } from "@/types/order";
import { Box, Button, Container, Title } from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RequestsTable } from "./RequestsTable";
import { createClient } from "@/utils/supabase/client";
import { RequestsCard } from "./RequestsCard";
import { Channels } from "@/constants/channels";

interface Props {
  requests: Partial<ICustomOrder[]>;
}
export const CustomRequests = ({ requests = [] }: Props) => {
  const [newRequests, setNewRequests] = useState<ICustomOrder[]>(
    requests as ICustomOrder[]
  );

  useEffect(() => {
    const supabase = createClient();

    const channels = supabase
      .channel(Channels.CustomOrdersUpdate)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "custom-orders" },
        (payload) => {
          setNewRequests((prevState) => {
            return prevState.map((obj) => {
              if (obj.id === (payload.new as ICustomOrder).id) {
                return { ...obj, ...payload.new };
              }
              return obj;
            });
          });
        }
      )
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, []);
  return (
    <Container size="lg">
      <Title order={3} c="dimmed" mb="md">
        Custom Requests
      </Title>
      {requests.length === 0 ? (
        <NoItemsFound
          icon={<IconPackage size="6rem" color="var(--primary-300)" />}
          label="You have no Custom Requests"
        >
          <Button component={Link} href="/custom-request" className="btn">
            Make a Request
          </Button>
        </NoItemsFound>
      ) : (
        <Box>
          <RequestsTable requests={newRequests} />
          <RequestsCard requests={newRequests} />
        </Box>
      )}
    </Container>
  );
};
