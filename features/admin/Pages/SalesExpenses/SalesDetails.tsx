import { ISales, IPaymentHistory } from "@/types/sales-expenses";
import { Stack, Text, Group, Avatar, Card, Title, Grid, Badge, Button, Table, Divider, ActionIcon, CopyButton, Tooltip, Box } from "@mantine/core";
import { IconPrinter, IconCash, IconListDetails, IconHistory, IconCopy, IconCheck } from "@tabler/icons-react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import { useCustomers } from "@/hooks/admin/useCustomers";
import { formatDate } from "./utils";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface SalesDetailsProps {
  sale: ISales;
  onPrint?: () => void;
}

export default function SalesDetails({ sale, onPrint }: SalesDetailsProps) {
  const { data: customers } = useCustomers();
  const customer = customers?.find((c) => c.id === sale.customer_id);

  const [paymentHistory, setPaymentHistory] = useState<IPaymentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      const { data } = await supabase
        .from("payment_history")
        .select("*")
        .eq("reference_id", sale.id)
        .eq("isDeleted", false)
        .order("payment_date", { ascending: false });

      if (data) setPaymentHistory(data as IPaymentHistory[]);
      setLoadingHistory(false);
    };

    fetchHistory();
  }, [sale.id, supabase]);

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Group>
          <Avatar size="lg" src={sale.createdBy.image} radius="xl" />
          <Stack gap={0}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Recorded By
            </Text>
            <Text fw={500}>{sale.createdBy.name}</Text>
            <Text size="xs" c="dimmed">{formatDate(sale.created_at)}</Text>
          </Stack>
        </Group>

        {onPrint && (
          <Button
            leftSection={<IconPrinter size="1rem" />}
            color="pink"
            variant="light"
            onClick={onPrint}
          >
            Print Receipt
          </Button>
        )}
      </Group>


      <Card withBorder radius="md" p="md" h="100%">
        <Group mb="md">
          <IconListDetails size="1.2rem" className="text-pink-500" />
          <Title order={5}>Sales Details</Title>
        </Group>

        <Stack gap="sm">
          {sale.items && sale.items.length > 0 ? (
            <Stack gap="sm">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Subtotal</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {sale.items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text size="sm" fw={500}>{item.productType}</Text>
                        {item.description && (
                          <Text size="xs" c="dimmed" lineClamp={1}>{item.description}</Text>
                        )}
                      </Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>{CURRENCY_SYMBOL} {item.unitPrice.toLocaleString()}</Table.Td>
                      <Table.Td fw={500}>{CURRENCY_SYMBOL} {(item.totalAmount || 0).toLocaleString()}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Box bg="gray.1" mt="xs" px="md" py="xs" className="rounded-md">
                <Group justify="space-between" align="flex-start">
                  <Text size="sm">Customer</Text>
                  {customer ? (
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>{customer.name}</Text>
                      {customer.phone && (<Group gap="xs" justify="flex-end">
                        <Text size="xs" fw={500}>{customer.phone}</Text>
                        <CopyButton value={customer.phone} timeout={2000}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy Phone'} withArrow position="right">
                              <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy} size="sm">
                                {copied ? (
                                  <IconCheck size="1rem" />
                                ) : (
                                  <IconCopy size="1rem" />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                      )}
                    </Stack>
                  ) : (
                    <Text size="sm" fw={500}>Walk-in Customer</Text>
                  )}
                </Group>
              </Box>
            </Stack>
          ) : (
            <>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Product Type</Text>
                <Text size="sm" fw={500}>{sale.productType}</Text>
              </Group>
              <Divider variant="dashed" />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Description</Text>
                <Text size="sm" fw={500} style={{ maxWidth: '60%', textAlign: 'right' }}>
                  {sale.description || "N/A"}
                </Text>
              </Group>
              <Divider variant="dashed" />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Unit Price</Text>
                <Text size="sm" fw={500}>{CURRENCY_SYMBOL} {(sale.unitPrice || 0).toLocaleString()}</Text>
              </Group>
              <Divider variant="dashed" />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Customer</Text>
                {customer ? (
                  <Group gap="xs">
                    <Text size="sm" fw={500}>{customer.name}</Text>
                    {customer.phone && (
                      <CopyButton value={customer.phone} timeout={2000}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied' : 'Copy Phone'} withArrow position="right">
                            <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy} size="sm">
                              {copied ? (
                                <IconCheck size="1rem" />
                              ) : (
                                <IconCopy size="1rem" />
                              )}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    )}
                  </Group>
                ) : (
                  <Text size="sm" fw={500}>Walk-in Customer</Text>
                )}
              </Group>
            </>
          )}
          <Divider variant="dashed" />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Status</Text>
            {(sale.balanceDue || 0) > 0 ? (
              <Badge color="red" variant="light">Debt / Arrears</Badge>
            ) : (
              <Badge color="green" variant="light">Fully Paid</Badge>
            )}
          </Group>
        </Stack>
      </Card>


      <Card withBorder radius="md" p="md">
        <Group mb="md">
          <IconCash size="1.2rem" className="text-pink-500" />
          <Title order={5}>Pricing & Payment</Title>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="sm">
              {!(sale.items && sale.items.length > 0) && (
                <>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Unit Price</Text>
                    <Text size="sm" fw={500}>{CURRENCY_SYMBOL} {(sale.unitPrice || 0).toLocaleString()}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Quantity</Text>
                    <Text size="sm" fw={500}>{sale.quantity || 1}</Text>
                  </Group>
                </>
              )}
              {sale.discount && (
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Discount</Text>
                  <Text size="sm" fw={500} c="green">
                    {sale.discount.type === "percentage"
                      ? `${sale.discount.value}%`
                      : `${CURRENCY_SYMBOL} ${sale.discount.value}`}
                  </Text>
                </Group>
              )}
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Payment Method</Text>
                <Text size="sm" fw={500}>
                  {(sale.paymentMethods || []).join(", ") || "N/A"}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="sm" bg="gray.0" p="md" style={{ borderRadius: '8px' }}>
              <Group justify="space-between">
                <Text size="sm" fw={600}>Total Amount</Text>
                <Text size="sm" fw={700}>{CURRENCY_SYMBOL} {(sale.totalAmount || 0).toLocaleString()}</Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text size="sm" fw={600}>Amount Paid</Text>
                <Text size="sm" fw={700} c="green">{CURRENCY_SYMBOL} {(sale.amountPaid || sale.totalAmount || 0).toLocaleString()}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" fw={600}>Balance Due</Text>
                <Text size="sm" fw={700} c={(sale.balanceDue || 0) > 0 ? "red" : "gray"}>
                  {CURRENCY_SYMBOL} {(sale.balanceDue || 0).toLocaleString()}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      <Grid>
        <Grid.Col span={12}>
          <Card withBorder radius="md" p="md">
            <Group mb="md">
              <IconHistory size="1.2rem" className="text-pink-500" />
              <Title order={5}>Payment History</Title>
            </Group>

            {loadingHistory ? (
              <Text size="sm" c="dimmed" ta="center">Loading history...</Text>
            ) : paymentHistory.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center">No payment history recorded for this sale.</Text>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Method</Table.Th>
                    <Table.Th>Amount Paid</Table.Th>
                    <Table.Th>Recorded By</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paymentHistory.map((history) => (
                    <Table.Tr key={history.id}>
                      <Table.Td>{formatDate(history.payment_date)}</Table.Td>
                      <Table.Td>{history.payment_method || "N/A"}</Table.Td>
                      <Table.Td>
                        <Text fw={600} c="green">
                          {CURRENCY_SYMBOL} {history.amount_paid.toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {history.createdBy ? (
                          <Group gap="xs">
                            <Avatar size="xs" src={history.createdBy.image} />
                            <Text size="xs">{history.createdBy.name}</Text>
                          </Group>
                        ) : (
                          <Text size="xs" c="dimmed">System</Text>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
