import { ISales } from "@/types/sales-expenses";
import { IProductType } from "@/types";
import {
  Avatar,
  Group,
  Table,
  Text,
  ActionIcon,
  Drawer,
  Stack,
  Button,
  Tooltip,
  TextInput,
  Box,
  Pagination,
  Badge,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEdit, IconSearch, IconTrash, IconPrinter, IconDotsVertical, IconCash, IconReceipt } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import { IAdminUser } from "@/types/admin";
import { formatDate } from "./utils";
import { useSalesSearch } from "./hooks/useSearch";
import { useFilters, Filters, initialFilters } from "./hooks/useFilters";
import { TableFilters } from "./components/TableFilters";
import { ExportButton } from "./components/ExportButton";
import { useCustomers } from "@/hooks/admin/useCustomers";
import { PrintModal } from "../Receipts/components/PrintModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import SalesDetails from "./SalesDetails";
import { toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";
import { Modal, NumberInput, Select } from "@mantine/core";
import { usePaymentHistory } from "@/hooks/admin/usePaymentHistory";
import { useActivityLogger } from "@/hooks/admin/useActivityLogger";

interface SalesTableProps {
  sales: ISales[];
  onEdit: (data: ISales) => Promise<void>;
  isLoading?: boolean;
  productTypes: IProductType[];
  adminUser: IAdminUser | null;
}

export default function SalesTable({
  sales,
  onEdit,
  isLoading,
  productTypes,
  adminUser,
}: SalesTableProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSale, setSelectedSale] = useState<ISales | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { filteredSales } = useSalesSearch(sales, search);
  const filteredAndSortedSales = useFilters(sales, filters, filteredSales);
  const { data: customers } = useCustomers();
  const supabase = createClient();

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const { logActivity } = useActivityLogger();

  const [printModalOpened, setPrintModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<ISales | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [paymentModalOpened, setPaymentModalOpened] = useState(false);
  const [saleForPayment, setSaleForPayment] = useState<ISales | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Create a dummy customerId for the hook, as we're recording for a specific sale but the hook requires a customerId.
  // It's okay if customer_id is undefined for walk-in sales, but usePaymentHistory expects a string.
  // We'll pass a dummy string if missing and override it in the actual submission.
  const dummyCustomerId = saleForPayment?.customer_id || "walk-in";
  const { recordPayment } = usePaymentHistory(dummyCustomerId);

  useEffect(() => {
    setActivePage(1);
  }, [search, filters]);

  const totalPages = Math.ceil(filteredAndSortedSales.length / itemsPerPage);
  const paginatedSales = filteredAndSortedSales.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const handleViewDetails = (sale: ISales) => {
    setSelectedSale(sale);
    open();
  };

  const handleEditClick = (sale: ISales) => {
    // If the parent provided an onEdit function that just changes the view, we can call it.
    // Wait, the parent handles switching to edit view if we call onEdit without await, but let's check the signature.
    // We will just call onEdit and pass the sale.
    onEdit(sale as any);
  };

  const handleDeleteClick = (sale: ISales) => {
    setSaleToDelete(sale);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!saleToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("sales")
        .update({
          isDeleted: true,
          updatedBy: {
            userId: adminUser?.id,
            name: adminUser?.firstName + " " + adminUser?.lastName,
            email: adminUser?.email || "",
            role: adminUser?.role || "",
            image: adminUser?.avatar || "",
          }
        })
        .eq("id", saleToDelete.id);

      if (error) throw error;
      toast.success("Sale deleted successfully");

      logActivity({
        action: "DELETE",
        entity_type: "SALE",
        entity_id: saleToDelete.id,
        description: `Deleted Sale record`,
      });

      setDeleteModalOpened(false);
      setSaleToDelete(null);
    } catch (err) {
      toast.error("Failed to delete sale");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintReceipt = (sale: ISales) => {
    setSelectedSale(sale);
    setPrintModalOpened(true);

    logActivity({
      action: "PRINT_RECEIPT",
      entity_type: "SALE",
      entity_id: sale.id,
      description: `Printed receipt for Sale`,
    });
  };

  const handleRecordPaymentClick = (sale: ISales) => {
    setSaleForPayment(sale);
    setPaymentAmount(sale.balanceDue || 0);
    setPaymentModalOpened(true);
  };

  const handleRecordPayment = async () => {
    if (!saleForPayment) return;
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmittingPayment(true);
    try {
      await recordPayment({
        customer_id: saleForPayment.customer_id || "walk-in",
        amount_paid: paymentAmount,
        payment_method: paymentMethod,
        reference_type: "sales",
        reference_id: saleForPayment.id,
        notes: paymentNotes,
        payment_date: new Date().toISOString(),
        createdBy: {
          userId: adminUser?.id || "",
          name: adminUser?.firstName + " " + adminUser?.lastName,
          email: adminUser?.email || "",
          role: adminUser?.role || "",
          image: adminUser?.avatar || "",
        }
      });

      // Update the sales record as well
      const newAmountPaid = (saleForPayment.amountPaid || 0) + paymentAmount;
      const newBalanceDue = (saleForPayment.totalAmount || 0) - newAmountPaid;

      await supabase
        .from("sales")
        .update({
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue > 0 ? newBalanceDue : 0,
          paymentMethods: Array.from(new Set([...(saleForPayment.paymentMethods || []), paymentMethod])),
        })
        .eq("id", saleForPayment.id);

      toast.success("Payment recorded successfully");
      setPaymentModalOpened(false);
      setSaleForPayment(null);
      setPaymentAmount(undefined);
      setPaymentNotes("");
    } catch (err) {
      toast.error("Failed to record payment");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const getAvailableProductTypes = (currentType?: string) => {
    if (!currentType) return productTypes;

    const exists = productTypes.some((type) => type.title === currentType);
    if (exists) return productTypes;

    return [
      ...productTypes,
      {
        id: "custom",
        title: currentType,
        slug: { current: "custom" },
        value: "custom",
      },
    ];
  };

  return (
    <Stack gap="md">
      <TableFilters
        filters={filters}
        onFiltersChange={setFilters}
        data={sales}
      />

      <Group justify="space-between" align="flex-start">
        <TextInput
          placeholder="Search by description or product type..."
          leftSection={<IconSearch size="1rem" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Box w="160px">
          <ExportButton data={filteredAndSortedSales} filename="sales" />
        </Box>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: "200px" }}>Created By</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Product</Table.Th>
            <Table.Th style={{ width: "120px" }}>Amount</Table.Th>
            <Table.Th style={{ width: "120px" }}>Debt</Table.Th>
            <Table.Th style={{ width: "120px" }}>Date</Table.Th>
            <Table.Th style={{ width: "120px" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center">Loading sales...</Text>
              </Table.Td>
            </Table.Tr>
          ) : filteredAndSortedSales.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center">No sales found</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedSales.map((sale) => {
              const customer = customers?.find(c => c.id === sale.customer_id);
              return (
                <Table.Tr key={sale.id}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar size="sm" src={sale.createdBy.image} />
                      <Tooltip label={sale.createdBy.name}>
                        <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
                          {sale.createdBy.name}
                        </Text>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {customer ? (
                      <Text size="sm" fw={500}>{customer.name}</Text>
                    ) : (
                      <Text size="sm" c="dimmed">Walk-in</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={1} fw={500}>
                      {sale.productType}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {sale.description}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600} c="green">
                      {CURRENCY_SYMBOL} {sale.totalAmount.toLocaleString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {(sale.balanceDue || 0) > 0 ? (
                      <Badge color="red" variant="light">
                        {CURRENCY_SYMBOL} {sale.balanceDue?.toLocaleString()}
                      </Badge>
                    ) : (
                      <Badge color="green" variant="light">Paid</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(sale.created_at)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Menu shadow="md" width={200} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size="1.1rem" />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEye size="1rem" />}
                          onClick={() => handleViewDetails(sale)}
                        >
                          View Details
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconEdit size="1rem" />}
                          onClick={() => handleEditClick(sale)}
                        >
                          Edit Sale
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconReceipt size={16} />}
                          onClick={() => handlePrintReceipt(sale)}
                        >
                          Print Receipt
                        </Menu.Item>
                        {(sale.balanceDue || 0) > 0 && (
                          <Menu.Item
                            leftSection={<IconCash size="1rem" />}
                            color="green"
                            onClick={() => handleRecordPaymentClick(sale)}
                          >
                            Record Payment
                          </Menu.Item>
                        )}
                        <Menu.Divider />
                        <Menu.Item
                          leftSection={<IconTrash size="1rem" />}
                          color="red"
                          onClick={() => handleDeleteClick(sale)}
                        >
                          Delete Sale
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
            color="pink"
          />
        </Group>
      )}

      {selectedSale && (
        <PrintModal
          opened={printModalOpened}
          onClose={() => setPrintModalOpened(false)}
          receipt={
            {
              id: selectedSale.id,
              receiptNumber: selectedSale.id.substring(0, 8).toUpperCase(),
              customerName: customers?.find(c => c.id === selectedSale.customer_id)?.name || "Walk-in Customer",
              customerAddress: customers?.find(c => c.id === selectedSale.customer_id)?.address || "",
              customerPhone: customers?.find(c => c.id === selectedSale.customer_id)?.phone || "",
              customerEmail: customers?.find(c => c.id === selectedSale.customer_id)?.email || "",
              date: selectedSale.created_at ? new Date(selectedSale.created_at).toISOString() : new Date().toISOString(),
              items: selectedSale.items && selectedSale.items.length > 0
                ? selectedSale.items.map(item => ({
                  id: item.id || selectedSale.id,
                  description: item.productType + (item.description ? ` - ${item.description}` : ""),
                  quantity: item.quantity || 1,
                  unitPrice: item.unitPrice || 0,
                  total: item.totalAmount || 0,
                }))
                : [
                  {
                    id: selectedSale.id,
                    description: selectedSale.productType + (selectedSale.description ? ` - ${selectedSale.description}` : ""),
                    quantity: selectedSale.quantity || 1,
                    unitPrice: selectedSale.unitPrice || 0,
                    total: selectedSale.totalAmount || 0,
                  }
                ],
              subtotal: selectedSale.totalAmount || 0,
              taxRate: 0,
              taxAmount: 0,
              totalAmount: selectedSale.totalAmount || 0,
              amountPaid: selectedSale.amountPaid,
              balanceDue: selectedSale.balanceDue,
              paymentMethod: selectedSale.paymentMethods?.[0] || "CASH",
              paymentStatus: (selectedSale.balanceDue || 0) > 0 ? "pending" : "paid",
              notes: selectedSale.balanceDue && selectedSale.balanceDue > 0 ? `Balance Due: ${CURRENCY_SYMBOL} ${selectedSale.balanceDue.toLocaleString()}` : undefined,
              created_at: selectedSale.created_at ? new Date(selectedSale.created_at).toISOString() : new Date().toISOString(),
              updated_at: selectedSale.updated_at ? new Date(selectedSale.updated_at).toISOString() : new Date().toISOString(),
              createdBy: selectedSale.createdBy
            } as any
          }
        />
      )}

      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={confirmDelete}
        title="Delete Sale"
        loading={isDeleting}
        confirmLabel="Delete"
        confirmColor="red"
      >
        Are you sure you want to delete this sale? This action can be reversed by an administrator.
      </ConfirmationModal>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xl"
        title="Sale Details"
      >
        {selectedSale && (
          <Stack>
            <SalesDetails sale={selectedSale} onPrint={() => handlePrintReceipt(selectedSale)} />
          </Stack>
        )}
      </Drawer>

      <Modal opened={paymentModalOpened} onClose={() => setPaymentModalOpened(false)} title="Record Payment">
        <Stack gap="md">
          <NumberInput
            label="Amount Paid"
            required
            value={paymentAmount}
            onChange={(val) => setPaymentAmount(val as number)}
            prefix={`${CURRENCY_SYMBOL} `}
            min={0.01}
            max={saleForPayment?.balanceDue || 0}
            description={`Balance Due: ${CURRENCY_SYMBOL} ${(saleForPayment?.balanceDue || 0).toLocaleString()}`}
          />
          <Select
            label="Payment Method"
            data={["Cash", "Mobile Money", "Bank Transfer", "Credit Card"]}
            value={paymentMethod}
            onChange={(val) => setPaymentMethod(val || "Cash")}
            required
          />
          <TextInput
            label="Notes (Optional)"
            placeholder="e.g. Final payment via momo"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" color="gray" onClick={() => setPaymentModalOpened(false)}>Cancel</Button>
            <Button color="pink" onClick={handleRecordPayment} loading={isSubmittingPayment}>Save Payment</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
