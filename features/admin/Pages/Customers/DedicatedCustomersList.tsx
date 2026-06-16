import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import { useCustomers } from "@/hooks/admin/useCustomers";
import { ICustomer } from "@/types/sales-expenses";
import {
  Badge,
  Box, Button,
  Group,
  Modal,
  Paper,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconHistory, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import CustomerPaymentHistory from "./CustomerPaymentHistory";

export default function DedicatedCustomersList() {
  const { data: customers, isLoading, createCustomer, updateCustomer } = useCustomers();
  const { adminUser } = useCurrentAdminUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCustomer, setEditingCustomer] = useState<ICustomer | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    address: "" 
  });

  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.phone?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  const handleOpenModal = (customer?: ICustomer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ 
        name: customer.name, 
        phone: customer.phone || "", 
        email: customer.email || "", 
        address: customer.address || "" 
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: "", phone: "", email: "", address: "" });
    }
    open();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      if (editingCustomer) {
        await updateCustomer({
          id: editingCustomer.id,
          ...formData,
          updatedBy: {
            userId: adminUser?.id || "",
            name: adminUser?.firstName + " " + adminUser?.lastName,
            email: adminUser?.email || "",
            role: adminUser?.role || "",
            image: adminUser?.avatar || "",
          }
        });
      } else {
        await createCustomer({
          ...formData,
          createdBy: {
            userId: adminUser?.id || "",
            name: adminUser?.firstName + " " + adminUser?.lastName,
            email: adminUser?.email || "",
            role: adminUser?.role || "",
            image: adminUser?.avatar || "",
          }
        });
      }
      close();
    } catch (err) {
      // Handled in hook
    }
  };

  return (
    <Box>
      <Paper withBorder p="md">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: 400 }}
          />
          <Button leftSection={<IconPlus size="1rem" />} color="pink" onClick={() => handleOpenModal()}>
            Add Customer
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Total Spent</Table.Th>
              <Table.Th>Total Arrears (Debt)</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">Loading...</Table.Td>
              </Table.Tr>
            ) : filteredCustomers.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">No customers found.</Table.Td>
              </Table.Tr>
            ) : (
              filteredCustomers.map((customer) => (
                <Table.Tr key={customer.id}>
                  <Table.Td fw={500}>{customer.name}</Table.Td>
                  <Table.Td>
                    <Text size="sm">{customer.phone}</Text>
                    <Text size="xs" c="dimmed">{customer.email}</Text>
                  </Table.Td>
                  <Table.Td fw={600} c="green">{CURRENCY_SYMBOL} {(customer.total_spent || 0).toLocaleString()}</Table.Td>
                  <Table.Td>
                    {(customer.total_debt || 0) > 0 ? (
                      <Badge color="red" variant="light" size="lg">
                        {CURRENCY_SYMBOL} {(customer.total_debt || 0).toLocaleString()}
                      </Badge>
                    ) : (
                      <Badge color="gray" variant="light">No Debt</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button variant="light" size="xs" color="pink" onClick={() => handleOpenModal(customer)}>
                        Manage
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal opened={opened} onClose={close} title={editingCustomer ? "Manage Customer" : "Add New Customer"} size="lg">
        {editingCustomer ? (
          <Tabs defaultValue="details">
            <Tabs.List mb="md">
              <Tabs.Tab value="details" leftSection={<IconEdit size="1rem" />}>Details</Tabs.Tab>
              <Tabs.Tab value="history" leftSection={<IconHistory size="1rem" />}>Payment History</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="details">
              <Stack gap="md">
                <TextInput
                  label="Customer Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe or Company Name"
                />
                <TextInput
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0244123456"
                />
                <TextInput
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                />
                <TextInput
                  label="Physical Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <Group justify="flex-end" mt="md">
                  <Button variant="light" color="gray" onClick={close}>Close</Button>
                  <Button color="pink" onClick={handleSubmit}>Update Details</Button>
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="history">
              <CustomerPaymentHistory customerId={editingCustomer.id} />
            </Tabs.Panel>
          </Tabs>
        ) : (
          <Stack gap="md">
            <TextInput
              label="Customer Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe or Company Name"
            />
            <TextInput
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 0244123456"
            />
            <TextInput
              label="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john@example.com"
            />
            <TextInput
              label="Physical Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" color="gray" onClick={close}>Cancel</Button>
              <Button color="pink" onClick={handleSubmit}>Save</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}