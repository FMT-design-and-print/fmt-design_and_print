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
    ThemeIcon,
    Tooltip as MantineTooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconPrinter, IconSearch, IconCurrencyDollar, IconReceipt2, IconWallet, IconPigMoney, IconInfoCircle } from "@tabler/icons-react";
import { startOfMonth, endOfMonth, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns";

import { CURRENCY_SYMBOL } from "@/lib/constants";
import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import {
    useFinancialSummaryReport,
    useTopCustomersReport,
    useTopPerformingServicesReport,
    useTopPerformingProductTypesReport,
    useDetailedServicePerformanceReport,
    useExpensesByTypeReport,
} from "@/hooks/admin/useReports";
import { RankedChartSection } from "./components/RankedChartSection";

export const ReportsPage = () => {
    const { adminUser } = useCurrentAdminUser();
    const canViewTips = canViewTips || adminUser?.role === "admin" || adminUser?.role === "manager";
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

            {/* The Interactive Area (on-screen only) */}
            <Box p="md" bg="white" style={{ minHeight: "100vh" }} className="screen-only">
                <Stack gap="xl">
                    {/* Summary Cards */}
                    <Paper withBorder p="md" radius="md">
                        <Title order={4} mb="md">Financial Summary</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                <Card shadow="xs" p="lg" radius="md" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Group gap={4}>
                                            <Text size="sm" c="dimmed" fw={500}>Service Revenue (Expected)</Text>
                                            <MantineTooltip
                                                label="Total value of all sales billed in this period — whether the customer has paid in full or still owes you. Tips are not included."
                                                multiline
                                                w={260}
                                                withArrow
                                            >
                                                <IconInfoCircle size={14} className="hide-in-print" style={{ color: "var(--mantine-color-gray-5)", cursor: "help" }} />
                                            </MantineTooltip>
                                        </Group>
                                        <ThemeIcon color="pink" variant="light" size="sm">
                                            <IconCurrencyDollar size={16} />
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="xl" fw={700}>
                                        {CURRENCY_SYMBOL} {summary?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </Text>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                <Card shadow="xs" p="lg" radius="md" bg="blue.0" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Group gap={4}>
                                            <Text size="sm" c="dimmed" fw={500}>Total Cash Received</Text>
                                            <MantineTooltip
                                                label="Actual cash collected from customers in this period — money already in hand. Includes tips. Unpaid customer debts are not counted here."
                                                multiline
                                                w={260}
                                                withArrow
                                            >
                                                <IconInfoCircle size={14} className="hide-in-print" style={{ color: "var(--mantine-color-gray-5)", cursor: "help" }} />
                                            </MantineTooltip>
                                        </Group>
                                        <ThemeIcon color="blue" variant="light" size="sm">
                                            <IconCurrencyDollar size={16} />
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="xl" fw={700} c="blue.7">
                                        {CURRENCY_SYMBOL} {summary?.totalCashReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </Text>
                                    {canViewTips && (
                                        <Text size="xs" c="teal" mt={4}>
                                            Includes {CURRENCY_SYMBOL} {(summary?.totalTips || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in tips
                                        </Text>
                                    )}
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                <Card shadow="xs" p="lg" radius="md" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Group gap={4}>
                                            <Text size="sm" c="dimmed" fw={500}>Total Expenses</Text>
                                            <MantineTooltip
                                                label="Everything spent during this period — supplies, bills, salaries, and bad debts from spoilt items. Bad debts are already counted in this total."
                                                multiline
                                                w={260}
                                                withArrow
                                            >
                                                <IconInfoCircle size={14} className="hide-in-print" style={{ color: "var(--mantine-color-gray-5)", cursor: "help" }} />
                                            </MantineTooltip>
                                        </Group>
                                        <ThemeIcon color="red" variant="light" size="sm">
                                            <IconReceipt2 size={16} />
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="xl" fw={700}>
                                        {CURRENCY_SYMBOL} {summary?.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </Text>
                                    <Text size="xs" c="dimmed" mt={4}>
                                        Includes {CURRENCY_SYMBOL} {(summary?.totalBadDebts || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in bad debts (spoilt items)
                                    </Text>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                <Card shadow="xs" p="lg" radius="md" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Group gap={4}>
                                            <Text size="sm" c="dimmed" fw={500}>Customer Debts (Unpaid)</Text>
                                            <MantineTooltip
                                                label="Money customers still owe you from sales in this period. This is part of Service Revenue but hasn't been received as cash yet."
                                                multiline
                                                w={260}
                                                withArrow
                                            >
                                                <IconInfoCircle size={14} className="hide-in-print" style={{ color: "var(--mantine-color-gray-5)", cursor: "help" }} />
                                            </MantineTooltip>
                                        </Group>
                                        <ThemeIcon color="orange" variant="light" size="sm">
                                            <IconWallet size={16} />
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="xl" fw={700}>
                                        {CURRENCY_SYMBOL} {summary?.totalDebts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </Text>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                <Card shadow="xs" p="lg" radius="md" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Group gap={4}>
                                            <Text size="sm" c="dimmed" fw={500}>Net Profit (Accrual)</Text>
                                            <MantineTooltip
                                                label="Service Revenue minus Total Expenses. Counts all billed sales — paid or unpaid — so it shows profit on paper, not cash in hand. Tips are not included."
                                                multiline
                                                w={260}
                                                withArrow
                                            >
                                                <IconInfoCircle size={14} className="hide-in-print" style={{ color: "var(--mantine-color-gray-5)", cursor: "help" }} />
                                            </MantineTooltip>
                                        </Group>
                                        <ThemeIcon color="green" variant="light" size="sm">
                                            <IconPigMoney size={16} />
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="xl" fw={700}>
                                        {CURRENCY_SYMBOL} {summary?.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </Text>
                                    <Text size="xs" c="dimmed" mt={4}>
                                        Excludes tips
                                    </Text>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                <Card shadow="xs" p="lg" radius="md" bg="green.0" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Group gap={4}>
                                            <Text size="sm" c="dimmed" fw={500}>Net Cash Flow</Text>
                                            <MantineTooltip
                                                label="The cash you should actually have in hand right now: Cash Received minus Expenses. Includes tips. Does not count unpaid customer debts."
                                                multiline
                                                w={260}
                                                withArrow
                                            >
                                                <IconInfoCircle size={14} className="hide-in-print" style={{ color: "var(--mantine-color-gray-5)", cursor: "help" }} />
                                            </MantineTooltip>
                                        </Group>
                                        <ThemeIcon color="green" variant="light" size="sm">
                                            <IconPigMoney size={16} />
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="xl" fw={700} c="green.7">
                                        {CURRENCY_SYMBOL} {((summary?.totalCashReceived || 0) - (summary?.totalExpenses || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <RankedChartSection
                                title="Top Performing Categories"
                                storageKey="topCategories"
                                data={(topServices || []).map(s => ({ label: s.category, value: s.total_revenue }))}
                                labelHeader="Category"
                                valueHeader="Revenue"
                                primaryColor="#339af0"
                                formatAbsolute={formatCurrency}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <RankedChartSection
                                title="Top Performing Product Types"
                                storageKey="topProductTypes"
                                data={(topProductTypes || []).map(p => ({ label: p.product_type, value: p.total_revenue }))}
                                labelHeader="Product Type"
                                valueHeader="Revenue"
                                primaryColor="#845ef7"
                                formatAbsolute={formatCurrency}
                            />
                        </Grid.Col>
                    </Grid>

                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <RankedChartSection
                                title="Expenses by Type"
                                storageKey="expensesByType"
                                data={(expensesByType || []).map(e => ({ label: e.expense_type, value: e.total_amount }))}
                                labelHeader="Expense Type"
                                valueHeader="Amount"
                                primaryColor="#ff6b6b"
                                formatAbsolute={formatCurrency}
                            />
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

                        <Box p="md" bg="white">
                            <Table striped highlightOnHover withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Category</Table.Th>
                                        <Table.Th>Product Type</Table.Th>
                                        <Table.Th ta="right">Total Sales</Table.Th>
                                        <Table.Th ta="right">Expected Revenue</Table.Th>
                                        {canViewTips && <Table.Th ta="right">Tips</Table.Th>}
                                        <Table.Th ta="right">Cash Received</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredDetailedPerformance.map((item, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Td fw={500}>{item.category}</Table.Td>
                                            <Table.Td>{item.product_type}</Table.Td>
                                            <Table.Td ta="right">{item.sales_count}</Table.Td>
                                            <Table.Td ta="right" c="blue.7" fw={600}>{formatCurrency(item.total_revenue)}</Table.Td>
                                            {canViewTips && (
                                                <Table.Td ta="right" c="teal" fw={500}>
                                                    {item.total_tips > 0 ? `+${formatCurrency(item.total_tips)}` : '--'}
                                                </Table.Td>
                                            )}
                                            <Table.Td ta="right" c="green" fw={600}>{formatCurrency(item.total_cash_received)}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                    {filteredDetailedPerformance.length === 0 && (
                                        <Table.Tr>
                                            <Table.Td colSpan={canViewTips ? 6 : 5} ta="center">No data found for the selected filters</Table.Td>
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
                                            <Table.Th ta="right" c="blue.7">
                                                {formatCurrency(filteredDetailedPerformance.reduce((acc, item) => acc + item.total_revenue, 0))}
                                            </Table.Th>
                                            {canViewTips && (
                                                <Table.Th ta="right" c="teal">
                                                    {formatCurrency(filteredDetailedPerformance.reduce((acc, item) => acc + (item.total_tips || 0), 0))}
                                                </Table.Th>
                                            )}
                                            <Table.Th ta="right" c="green">
                                                {formatCurrency(filteredDetailedPerformance.reduce((acc, item) => acc + (item.total_cash_received || 0), 0))}
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Tfoot>
                                )}
                            </Table>
                        </Box>
                    </Paper>
                </Stack>

            </Box>

            {printMode && (
                <Box id="print-mount" className="print-only">
                    <Box mb="lg" ta="center">
                        <Title order={2}>FMT Design and Print</Title>
                        <Text c="dimmed">
                            {printMode === 'global' ? 'Financial & Analytics Report' : 'Service Performance Report'}
                        </Text>
                        <Text size="sm" c="dimmed">
                            {dateRange[0]?.toLocaleDateString()} – {dateRange[1]?.toLocaleDateString()}
                        </Text>
                    </Box>

                    {printMode === 'global' ? (
                        <Stack gap="lg">
                            <Box>
                                <Title order={5} mb="xs">Financial Summary</Title>
                                <Table withTableBorder withColumnBorders striped className="print-table">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Metric</Table.Th>
                                            <Table.Th ta="right">Value</Table.Th>
                                            <Table.Th>Notes</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Td>Service Revenue (Expected)</Table.Td>
                                            <Table.Td ta="right">{formatCurrency(summary?.totalRevenue || 0)}</Table.Td>
                                            <Table.Td>Billed sales — paid or unpaid. Excludes tips.</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Total Cash Received</Table.Td>
                                            <Table.Td ta="right">{formatCurrency(summary?.totalCashReceived || 0)}</Table.Td>
                                            <Table.Td>
                                                Cash in hand.
                                                {canViewTips && ` Includes ${formatCurrency(summary?.totalTips || 0)} in tips.`}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Total Expenses</Table.Td>
                                            <Table.Td ta="right">{formatCurrency(summary?.totalExpenses || 0)}</Table.Td>
                                            <Table.Td>Includes {formatCurrency(summary?.totalBadDebts || 0)} in bad debts (spoilt items).</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Customer Debts (Unpaid)</Table.Td>
                                            <Table.Td ta="right">{formatCurrency(summary?.totalDebts || 0)}</Table.Td>
                                            <Table.Td>Money customers still owe.</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td><strong>Net Profit (Accrual)</strong></Table.Td>
                                            <Table.Td ta="right"><strong>{formatCurrency(summary?.totalProfit || 0)}</strong></Table.Td>
                                            <Table.Td>Revenue − Expenses. Excludes tips.</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td><strong>Net Cash Flow</strong></Table.Td>
                                            <Table.Td ta="right"><strong>{formatCurrency((summary?.totalCashReceived || 0) - (summary?.totalExpenses || 0))}</strong></Table.Td>
                                            <Table.Td>Cash Received − Expenses. Includes tips, excludes unpaid debts.</Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Box>

                            <Box>
                                <Title order={5} mb="xs">Top Performing Categories</Title>
                                <Table withTableBorder withColumnBorders striped className="print-table">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Category</Table.Th>
                                            <Table.Th ta="right">Revenue</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(topServices || []).map((item, i) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>{item.category}</Table.Td>
                                                <Table.Td ta="right">{formatCurrency(item.total_revenue)}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                        {(!topServices || topServices.length === 0) && (
                                            <Table.Tr><Table.Td colSpan={2} ta="center">No data for this period</Table.Td></Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Box>

                            <Box>
                                <Title order={5} mb="xs">Top Performing Product Types</Title>
                                <Table withTableBorder withColumnBorders striped className="print-table">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Product Type</Table.Th>
                                            <Table.Th ta="right">Revenue</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(topProductTypes || []).map((item, i) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>{item.product_type}</Table.Td>
                                                <Table.Td ta="right">{formatCurrency(item.total_revenue)}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                        {(!topProductTypes || topProductTypes.length === 0) && (
                                            <Table.Tr><Table.Td colSpan={2} ta="center">No data for this period</Table.Td></Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Box>

                            <Box>
                                <Title order={5} mb="xs">Expenses by Type</Title>
                                <Table withTableBorder withColumnBorders striped className="print-table">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Expense Type</Table.Th>
                                            <Table.Th ta="right">Amount</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(expensesByType || []).map((item, i) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>{item.expense_type}</Table.Td>
                                                <Table.Td ta="right">{formatCurrency(item.total_amount)}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                        {(!expensesByType || expensesByType.length === 0) && (
                                            <Table.Tr><Table.Td colSpan={2} ta="center">No expenses recorded</Table.Td></Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Box>

                            <Box>
                                <Title order={5} mb="xs">Top Customers (by Spending)</Title>
                                <Table withTableBorder withColumnBorders striped className="print-table">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Customer Name</Table.Th>
                                            <Table.Th>Phone</Table.Th>
                                            <Table.Th ta="right">Total Spent</Table.Th>
                                            <Table.Th ta="right">Current Debt</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(topCustomers || []).map((c) => (
                                            <Table.Tr key={c.id}>
                                                <Table.Td>{c.name}</Table.Td>
                                                <Table.Td>{c.phone || 'N/A'}</Table.Td>
                                                <Table.Td ta="right">{formatCurrency(c.period_spent)}</Table.Td>
                                                <Table.Td ta="right">{c.period_debt > 0 ? formatCurrency(c.period_debt) : '—'}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                        {(!topCustomers || topCustomers.length === 0) && (
                                            <Table.Tr><Table.Td colSpan={4} ta="center">No customer activity for this period</Table.Td></Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Box>
                        </Stack>
                    ) : (
                        <Box>
                            {(selectedCategories.length > 0 || selectedProductTypes.length > 0) && (
                                <Text size="sm" c="dimmed" mb="sm">
                                    {selectedCategories.length > 0 && <>Categories: <strong>{selectedCategories.join(', ')}</strong>. </>}
                                    {selectedProductTypes.length > 0 && <>Product Types: <strong>{selectedProductTypes.join(', ')}</strong>.</>}
                                </Text>
                            )}
                            <Table withTableBorder withColumnBorders striped className="print-table">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Category</Table.Th>
                                        <Table.Th>Product Type</Table.Th>
                                        <Table.Th ta="right">Sales</Table.Th>
                                        <Table.Th ta="right">Expected Revenue</Table.Th>
                                        {canViewTips && <Table.Th ta="right">Tips</Table.Th>}
                                        <Table.Th ta="right">Cash Received</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredDetailedPerformance.map((item, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Td>{item.category}</Table.Td>
                                            <Table.Td>{item.product_type}</Table.Td>
                                            <Table.Td ta="right">{item.sales_count}</Table.Td>
                                            <Table.Td ta="right">{formatCurrency(item.total_revenue)}</Table.Td>
                                            {canViewTips && (
                                                <Table.Td ta="right">{item.total_tips > 0 ? formatCurrency(item.total_tips) : '—'}</Table.Td>
                                            )}
                                            <Table.Td ta="right">{formatCurrency(item.total_cash_received)}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                    {filteredDetailedPerformance.length === 0 && (
                                        <Table.Tr>
                                            <Table.Td colSpan={canViewTips ? 6 : 5} ta="center">No data found for the selected filters</Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                                {filteredDetailedPerformance.length > 0 && (
                                    <Table.Tfoot>
                                        <Table.Tr>
                                            <Table.Th colSpan={2}>Total</Table.Th>
                                            <Table.Th ta="right">{filteredDetailedPerformance.reduce((acc, item) => acc + item.sales_count, 0)}</Table.Th>
                                            <Table.Th ta="right">{formatCurrency(filteredDetailedPerformance.reduce((acc, item) => acc + item.total_revenue, 0))}</Table.Th>
                                            {canViewTips && (
                                                <Table.Th ta="right">{formatCurrency(filteredDetailedPerformance.reduce((acc, item) => acc + (item.total_tips || 0), 0))}</Table.Th>
                                            )}
                                            <Table.Th ta="right">{formatCurrency(filteredDetailedPerformance.reduce((acc, item) => acc + (item.total_cash_received || 0), 0))}</Table.Th>
                                        </Table.Tr>
                                    </Table.Tfoot>
                                )}
                            </Table>
                        </Box>
                    )}

                    <Text size="xs" c="dimmed" ta="right" mt="lg">
                        Generated {new Date().toLocaleString()}
                    </Text>
                </Box>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                    /* On screen, the print-only mount sits off-canvas so it never disrupts layout. */
                    .print-only {
                        position: absolute;
                        left: -10000px;
                        top: 0;
                    }

                    @media print {
                        @page { size: A4 portrait; margin: 12mm; }

                        html, body {
                            background: white !important;
                        }

                        /* Hide every element on the page (admin shell, sidebar, screen UI, etc.) */
                        body * {
                            visibility: hidden !important;
                        }

                        /* …then reveal only the print mount and its descendants. */
                        #print-mount,
                        #print-mount * {
                            visibility: visible !important;
                        }

                        /* Pull the print mount to the top-left so it becomes the page content. */
                        #print-mount {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: white !important;
                            color: black !important;
                        }

                        #print-mount * {
                            color: black !important;
                        }

                        .print-table {
                            font-size: 11px;
                            page-break-inside: auto;
                        }
                        .print-table tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        .print-table thead {
                            display: table-header-group;
                        }
                        .print-table tfoot {
                            display: table-footer-group;
                        }

                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `
            }} />
        </Box>
    );
};

export default ReportsPage;
