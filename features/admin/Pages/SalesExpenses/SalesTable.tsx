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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEdit, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import SalesForm from "./SalesForm";
import SalesDetails from "./SalesDetails";
import { IAdminUser } from "@/types/admin";
import { formatDate } from "./utils";
import { useSalesSearch } from "./hooks/useSearch";
import { useFilters, Filters, initialFilters } from "./hooks/useFilters";
import { TableFilters } from "./components/TableFilters";
import { ExportButton } from "./components/ExportButton";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { filteredSales } = useSalesSearch(sales, search);
  const filteredAndSortedSales = useFilters(sales, filters, filteredSales);

  const handleViewDetails = (sale: ISales) => {
    setSelectedSale(sale);
    setIsEditMode(false);
    open();
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleUpdate = async (updatedData: ISales) => {
    await onEdit(updatedData);
    setIsEditMode(false);
    close();
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
            <Table.Th>Description</Table.Th>
            <Table.Th style={{ width: "120px" }}>Amount</Table.Th>
            <Table.Th style={{ width: "120px" }}>Created At</Table.Th>
            <Table.Th style={{ width: "70px" }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center">Loading sales...</Text>
              </Table.Td>
            </Table.Tr>
          ) : filteredAndSortedSales.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center">No sales found</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            filteredAndSortedSales.map((sale) => (
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
                  <Text size="sm" lineClamp={1}>
                    {sale.description}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {CURRENCY_SYMBOL} {sale.totalAmount.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDate(sale.created_at)}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="pink"
                    onClick={() => handleViewDetails(sale)}
                  >
                    <IconEye size="1.1rem" />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xl"
        title={isEditMode ? "Edit Sale" : "Sale Details"}
      >
        {selectedSale && (
          <>
            {isEditMode ? (
              <SalesForm
                productTypes={
                  getAvailableProductTypes(
                    selectedSale.productType
                  ) as IProductType[]
                }
                onSubmit={handleUpdate}
                loading={isLoading || false}
                adminUser={adminUser}
                initialData={selectedSale}
                onCancel={handleCancelEdit}
              />
            ) : (
              <Stack>
                <SalesDetails sale={selectedSale} />
                <Button
                  leftSection={<IconEdit size="1.1rem" />}
                  onClick={handleEdit}
                  color="pink"
                >
                  Edit
                </Button>
              </Stack>
            )}
          </>
        )}
      </Drawer>
    </Stack>
  );
}
