"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Grid,
    Group,
    Stack,
    Text,
    Title,
    Divider,
    Paper,
    Table,
    Badge,
    MultiSelect,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconPrinter, IconSearch } from "@tabler/icons-react";
import { startOfMonth, endOfMonth, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns";

import {
    useFinancialSummaryReport,
    useTopCustomersReport,
    useTopPerformingServicesReport,
    useTopPerformingProductTypesReport,
    useDetailedServicePerformanceReport,
    useExpensesByTypeReport,
} from "@/hooks/admin/useReports";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

export const ReportsPage = () => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        startOfMonth(new Date()),
        endOfMonth(new Date()),
    ]);

    const startDate = dateRange[0] ? startOfDay(dateRange[0]).toISOString() : startOfMonth(new Date()).toISOString();
    const endDate = dateRange[1] ? endOfDay(dateRange[1]).toISOString() : endOfMonth(new Date()).toISOString();

    const { data: summary } = useFinancialSummaryReport(startDate, endDate);
    const { data: topCustomers } = useTopCustomersReport(startDate, endDate, 10);
    const { data: topServices } = useTopPerformingServicesReport(startDate, endDate);
    const { data: topProductTypes } = useTopPerformingProductTypesReport(startDate, endDate);
    const { data: expensesByType } = useExpensesByTypeReport(startDate, endDate);
    const { data: detailedPerformance } = useDetailedServicePerformanceReport(startDate, endDate);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);

    const [printMode, setPrintMode] = useState<'global' | 'detailed' | null>(null);

    // Clean up print mode after printing completes or cancels
    useEffect(() => {
        const handleAfterPrint = () => setPrintMode(null);
        window.addEventListener('afterprint', handleAfterPrint);
        return () => window.removeEventListener('afterprint', handleAfterPrint);
    }, []);

    const handlePrintGlobal = () => {
        setPrintMode('global');
        setTimeout(() => window.print(), 100);
    };

    const handlePrintDetailed = () => {
        setPrintMode('detailed');
        setTimeout(() => window.print(), 100);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
        }).format(value);
    };

    const setPreset = (preset: 'today' | 'this_week' | 'this_month' | 'this_year' | 'all_time') => {
        const now = new Date();
        switch (preset) {
            case 'today':
                setDateRange([now, now]);
                break;
            case 'this_week':
                setDateRange([startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 })]);
                break;
            case 'this_month':
                setDateRange([startOfMonth(now), endOfMonth(now)]);
                break;
            case 'this_year':
                setDateRange([startOfYear(now), endOfYear(now)]);
                break;
            case 'all_time':
                setDateRange([new Date(2020, 0, 1), now]); // Just a wide range
                break;
        }
    };

    // Filter detailed performance based on selections
    const filteredDetailedPerformance = useMemo(() => {
        if (!detailedPerformance) return [];
        return detailedPerformance.filter(item => {
            const matchCat = selectedCategories.length === 0 || selectedCategories.includes(item.category);
            const matchType = selectedProductTypes.length === 0 || selectedProductTypes.includes(item.product_type);
            return matchCat && matchType;
        });
    }, [detailedPerformance, selectedCategories, selectedProductTypes]);

    // Unique options for filters
    const categoryOptions = useMemo(() => {
        if (!detailedPerformance) return [];
        return Array.from(new Set(detailedPerformance.map(item => item.category))).map(c => ({ value: c, label: c }));
    }, [detailedPerformance]);

    const productTypeOptions = useMemo(() => {
        if (!detailedPerformance) return [];
        return Array.from(new Set(detailedPerformance.map(item => item.product_type))).map(pt => ({ value: pt, label: pt }));
    }, [detailedPerformance]);

    return (
        <Box>
            <Group justify="space-between" mb="lg">
                <Title order={2}>Reports & Analytics</Title>
                <Group>
                    <DatePickerInput
                        type="range"
                        placeholder="Select date range"
                        value={dateRange}
                        onChange={setDateRange}
                        clearable
                        w={300}
                    />
                    <Button
                        leftSection={<IconPrinter size={16} />}
                        onClick={handlePrintGlobal}
                        disabled={!dateRange[0] || !dateRange[1]}
                        className="hide-in-print"
                    >
                        Print / Save Global PDF
                    </Button>
                </Group>
            </Group>

            <Group mb="xl" gap="sm">
                <Button variant="light" size="xs" onClick={() => setPreset('today')}>Today</Button>
                <Button variant="light" size="xs" onClick={() => setPreset('this_week')}>This Week</Button>
                <Button variant="light" size="xs" onClick={() => setPreset('this_month')}>This Month</Button>
                <Button variant="light" size="xs" onClick={() => setPreset('this_year')}>This Year</Button>
                <Button variant="light" size="xs" onClick={() => setPreset('all_time')}>All Time</Button>
            </Group>

            {/* The Printable Area */}
            <Box id={printMode === 'global' ? 'print-mount' : undefined} p="md" bg="white" style={{ minHeight: "100vh" }} className="print-container">
                {/* Header for Print */}
                <Box mb="xl" style={{ display: "none" }} className="print-header">
                    <Title order={2} ta="center">FMT Design and Print</Title>
                    <Text ta="center" c="dimmed">Financial & Analytics Report</Text>
                    <Text ta="center" size="sm" c="dimmed" mb="lg">
                        {dateRange[0]?.toLocaleDateString()} - {dateRange[1]?.toLocaleDateString()}
                    </Text>
                </Box>

                <Stack gap="xl">
                    {/* Summary Cards */}
                    <Paper withBorder p="md" radius="md">
                        <Title order={4} mb="md">Financial Summary</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                <Card padding="lg" radius="md" bg="blue.0">
                                    <Text size="sm" c="dimmed" fw={500}>Total Revenue</Text>
                                    <Text size="xl" fw={700} c="blue.7">
                                        {formatCurrency(summary?.totalRevenue || 0)}
                                    </Text>
                                </Card>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                <Card padding="lg" radius="md" bg="red.0">
                                    <Text size="sm" c="dimmed" fw={500}>Total Expenses</Text>
                                    <Text size="xl" fw={700} c="red.7">
                                        {formatCurrency(summary?.totalExpenses || 0)}
                                    </Text>
                                </Card>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                <Card padding="lg" radius="md" bg="green.0">
                                    <Text size="sm" c="dimmed" fw={500}>Net Profit</Text>
                                    <Text size="xl" fw={700} c="green.7">
                                        {formatCurrency(summary?.totalProfit || 0)}
                                    </Text>
                                </Card>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                <Card padding="lg" radius="md" bg="orange.0">
                                    <Text size="sm" c="dimmed" fw={500}>Total Bad Debts</Text>
                                    <Text size="xl" fw={700} c="orange.7">
                                        {formatCurrency(summary?.totalBadDebts || 0)}
                                    </Text>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    <Grid>
                        {/* Top Performing Categories */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="md" radius="md" h="100%">
                                <Title order={4} mb="md">Top 5 Performing Categories</Title>
                                <Box h={300} mb="md">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={(topServices || []).slice(0, 5)}
                                            layout="vertical"
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" tickFormatter={(value) => `GH₵${value}`} />
                                            <YAxis dataKey="category" type="category" width={180} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Bar dataKey="total_revenue" fill="#339af0" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                                                <LabelList
                                                    dataKey="total_revenue"
                                                    position="right"
                                                    formatter={(val: number) => formatCurrency(val)}
                                                    style={{ fill: '#495057', fontSize: 12 }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Table striped highlightOnHover mt="lg">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Category</Table.Th>
                                            <Table.Th ta="right">Revenue</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(topServices || []).slice(0, 5).map((item, i) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>{item.category}</Table.Td>
                                                <Table.Td ta="right" fw={500}>{formatCurrency(item.total_revenue)}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Paper>
                        </Grid.Col>

                        {/* Top Performing Product Types */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="md" radius="md" h="100%">
                                <Title order={4} mb="md">Top 5 Performing Product Types</Title>
                                <Box h={300} mb="md">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={(topProductTypes || []).slice(0, 5)}
                                            layout="vertical"
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" tickFormatter={(value) => `GH₵${value}`} />
                                            <YAxis dataKey="product_type" type="category" width={180} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Bar dataKey="total_revenue" fill="#845ef7" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                                                <LabelList
                                                    dataKey="total_revenue"
                                                    position="right"
                                                    formatter={(val: number) => formatCurrency(val)}
                                                    style={{ fill: '#495057', fontSize: 12 }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Table striped highlightOnHover mt="lg">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Product Type</Table.Th>
                                            <Table.Th ta="right">Revenue</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(topProductTypes || []).slice(0, 5).map((item, i) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>{item.product_type}</Table.Td>
                                                <Table.Td ta="right" fw={500}>{formatCurrency(item.total_revenue)}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    <Grid>
                        {/* Expenses Breakdown */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="md" radius="md" h="100%">
                                <Title order={4} mb="md">Expenses by Type</Title>
                                <Box h={300} mb="md">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={(expensesByType || []).slice(0, 5)}
                                            layout="vertical"
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" tickFormatter={(value) => `GH₵${value}`} />
                                            <YAxis dataKey="expense_type" type="category" width={180} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Bar dataKey="total_amount" fill="#ff6b6b" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                                                <LabelList
                                                    dataKey="total_amount"
                                                    position="right"
                                                    formatter={(val: number) => formatCurrency(val)}
                                                    style={{ fill: '#495057', fontSize: 12 }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Table striped highlightOnHover mt="lg">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Expense Type</Table.Th>
                                            <Table.Th ta="right">Amount</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(expensesByType || []).slice(0, 5).map((item, i) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>{item.expense_type}</Table.Td>
                                                <Table.Td ta="right" fw={500}>{formatCurrency(item.total_amount)}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Paper>
                        </Grid.Col>

                        {/* Customer Leaderboard */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="md" radius="md" h="100%">
                                <Title order={4} mb="md">Top Customers (By Spending)</Title>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Customer Name</Table.Th>
                                            <Table.Th>Phone</Table.Th>
                                            <Table.Th>Total Spent</Table.Th>
                                            <Table.Th>Current Debt</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(topCustomers || []).map((customer) => (
                                            <Table.Tr key={customer.id}>
                                                <Table.Td fw={500}>{customer.name}</Table.Td>
                                                <Table.Td>{customer.phone || "N/A"}</Table.Td>
                                                <Table.Td c="green.7" fw={600}>{formatCurrency(customer.period_spent)}</Table.Td>
                                                <Table.Td>
                                                    {customer.period_debt > 0 ? (
                                                        <Badge color="red" variant="light">
                                                            {formatCurrency(customer.period_debt)}
                                                        </Badge>
                                                    ) : (
                                                        <Text size="sm" c="dimmed">No Debt</Text>
                                                    )}
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                        {(!topCustomers || topCustomers.length === 0) && (
                                            <Table.Tr>
                                                <Table.Td colSpan={4} ta="center">No customer data for this period</Table.Td>
                                            </Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    <Divider my="md" />

                    {/* Detailed Service Performance Section */}
                    <Paper withBorder p="md" radius="md" bg="gray.0">
                        <Group justify="space-between" mb="md">
                            <Box>
                                <Title order={4}>Detailed Service Performance Search</Title>
                                <Text size="sm" c="dimmed">Select categories or product types to filter revenue performance within the date range.</Text>
                            </Box>
                            <Button
                                variant="outline"
                                leftSection={<IconPrinter size={16} />}
                                onClick={handlePrintDetailed}
                                className="hide-in-print"
                            >
                                Print Table
                            </Button>
                        </Group>

                        <Grid mb="lg">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <MultiSelect
                                    label="Filter by Category"
                                    placeholder="Select categories"
                                    data={categoryOptions}
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    searchable
                                    clearable
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <MultiSelect
                                    label="Filter by Product Type"
                                    placeholder="Select product types"
                                    data={productTypeOptions}
                                    value={selectedProductTypes}
                                    onChange={setSelectedProductTypes}
                                    searchable
                                    clearable
                                />
                            </Grid.Col>
                        </Grid>

                        <Box id={printMode === 'detailed' ? 'print-mount' : undefined} p="md" bg="white" className="print-container">
                            <Box mb="xl" style={{ display: "none" }} className="print-header">
                                <Title order={3} ta="center">Service Performance Report</Title>
                                <Text ta="center" size="sm" c="dimmed" mb="lg">
                                    {dateRange[0]?.toLocaleDateString()} - {dateRange[1]?.toLocaleDateString()}
                                </Text>
                            </Box>

                            <Table striped highlightOnHover withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Category</Table.Th>
                                        <Table.Th>Product Type</Table.Th>
                                        <Table.Th ta="right">Total Sales</Table.Th>
                                        <Table.Th ta="right">Total Revenue</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredDetailedPerformance.map((item, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Td fw={500}>{item.category}</Table.Td>
                                            <Table.Td>{item.product_type}</Table.Td>
                                            <Table.Td ta="right">{item.sales_count}</Table.Td>
                                            <Table.Td ta="right" c="blue.7" fw={600}>{formatCurrency(item.total_revenue)}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                    {filteredDetailedPerformance.length === 0 && (
                                        <Table.Tr>
                                            <Table.Td colSpan={4} ta="center">No data found for the selected filters</Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                                {filteredDetailedPerformance.length > 0 && (
                                    <Table.Tfoot>
                                        <Table.Tr>
                                            <Table.Th colSpan={2}>Total</Table.Th>
                                            <Table.Th ta="right">
                                                {filteredDetailedPerformance.reduce((acc, item) => acc + item.sales_count, 0)}
                                            </Table.Th>
                                            <Table.Th ta="right">
                                                {formatCurrency(filteredDetailedPerformance.reduce((acc, item) => acc + item.total_revenue, 0))}
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Tfoot>
                                )}
                            </Table>
                        </Box>
                    </Paper>
                </Stack>

                <style dangerouslySetInnerHTML={{
                    __html: `
            @media print {
              @page { size: landscape; margin: 10mm; }
              
              body * {
                  visibility: hidden;
              }

              #print-mount, #print-mount * {
                  visibility: visible;
              }

              #print-mount {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background-color: white !important;
              }

              .hide-in-print, .hide-in-print * {
                  display: none !important;
              }

              .print-header {
                  display: block !important;
              }

              /* Force charts to render their colors and avoid blanking out */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Optional: If Recharts resize breaks in print, setting a fixed min-width can help */
              .recharts-wrapper {
                  min-width: 600px !important;
              }
            }
          `
                }} />
            </Box>
        </Box>
    );
};

export default ReportsPage;
