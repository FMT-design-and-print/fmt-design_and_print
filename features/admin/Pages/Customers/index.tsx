import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createClient } from "@/utils/supabase/client";
import { IUserDetails } from "@/types/user";
import CustomerEditModal from "./CustomerEditModal";
import { CustomerStats } from "./components/CustomerStats";
import { CustomerFilters } from "./components/CustomerFilters";
import { CustomerTable } from "./components/CustomerTable";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = useState<IUserDetails[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [genderStats, setGenderStats] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<IUserDetails | null>(
    null
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);

  const supabase = createClient();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAllCustomers(data || []);
      setTotalCustomers(data?.length || 0);
      return data || [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Failed to fetch customers");
      return [];
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchGenderStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("users").select("gender");

      if (error) throw error;

      const stats = data.reduce((acc: { [key: string]: number }, user) => {
        const gender = (user.gender || "unknown").toLowerCase();
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {});

      setGenderStats(stats);
    } catch (_error) {
      console.error("Error fetching gender stats:", _error);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCustomers();
    fetchGenderStats();
  }, [fetchCustomers, fetchGenderStats]);

  const handleCustomerUpdate = async () => {
    const updatedCustomers = await fetchCustomers();

    // Update gender stats locally
    const newGenderStats = updatedCustomers.reduce(
      (acc: { [key: string]: number }, user) => {
        const gender = (user.gender || "unknown").toLowerCase();
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      },
      {}
    );

    setGenderStats(newGenderStats);
    close();
  };

  // Filter and paginate customers on the client side
  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.email?.toLowerCase().includes(searchLower) ||
          customer.firstName?.toLowerCase().includes(searchLower) ||
          customer.lastName?.toLowerCase().includes(searchLower) ||
          customer.phone?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filterBy && filterValue) {
      result = result.filter(
        (customer) =>
          customer[filterBy as keyof IUserDetails]?.toString().toLowerCase() ===
          filterValue.toLowerCase()
      );
    }

    return result;
  }, [allCustomers, searchTerm, filterBy, filterValue]);

  // Get current page of customers
  const currentCustomers = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredCustomers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCustomers, page]);

  const csvData = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    () => currentCustomers.map(({ id, created_at, ...rest }) => rest),
    [currentCustomers]
  );

  return (
    <Box p="md">
      <LoadingOverlay visible={loading} />

      <CustomerStats
        totalCustomers={totalCustomers}
        genderStats={genderStats}
      />

      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterBy={filterBy}
        filterValue={filterValue}
        onFilterByChange={setFilterBy}
        onFilterValueChange={setFilterValue}
        customers={allCustomers}
        csvData={csvData}
      />

      <CustomerTable
        customers={currentCustomers}
        totalRecords={filteredCustomers.length}
        page={page}
        onPageChange={setPage}
        onEditCustomer={(customer) => {
          setSelectedCustomer(customer);
          open();
        }}
      />

      <CustomerEditModal
        opened={opened}
        onClose={close}
        customer={selectedCustomer}
        onUpdate={handleCustomerUpdate}
      />
    </Box>
  );
}
