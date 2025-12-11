import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
    Card, Text, Group, Badge, Loader, Center, 
    Container, SimpleGrid, ThemeIcon, Button, Paper 
} from '@mantine/core';
import { 
    IconCashBanknote, IconCalendar, IconDownload, 
    IconChartLine
} from '@tabler/icons-react';

import { getMySalaryHistory, SalarySlipDTO, PaymentStatus } from '../../../Service/PayrollService'; // Check path
import { errorNotification } from '../../../util/NotificationUtil'; // Check path

const MySalary: React.FC = () => {
    // Access User from Redux (Matches your Sidebar logic)
    const user = useSelector((state: any) => state.user);
    
    const [history, setHistory] = useState<SalarySlipDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchMySalary();
        }
    }, [user]);

    const fetchMySalary = async () => {
        try {
            const data = await getMySalaryHistory(user.id);
            // Sort by latest month/year (Optional logic)
            const sorted = data.sort((a:any, b:any) => b.id - a.id);
            setHistory(sorted);
        } catch (error) {
            errorNotification("Failed to load salary history");
        } finally {
            setLoading(false);
        }
    };

    // Helper: Currency Formatter (₹ 50,000)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    // Helper: Status Color
    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID: return 'green';
            case PaymentStatus.PROCESSING: return 'yellow';
            case PaymentStatus.FAILED: return 'red';
            default: return 'blue';
        }
    };

    if (loading) {
        return (
            <Center h="80vh">
                <Loader size="xl" color="indigo" variant="dots" />
            </Center>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Container size="lg">
                
                {/* --- HEADER SECTION --- */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <ThemeIcon size={40} radius="md" color="indigo" variant="light">
                                <IconCashBanknote size={24} />
                            </ThemeIcon>
                            Earnings & Payouts
                        </h1>
                        <Text c="dimmed" mt="xs">
                            View your monthly salary slips, performance bonuses, and payment status.
                        </Text>
                    </div>
                </div>

                {/* --- EMPTY STATE --- */}
                {history.length === 0 ? (
                    <Paper p="xl" radius="md" withBorder className="text-center bg-white">
                        <ThemeIcon size={60} radius="xl" color="gray" variant="light" mb="md">
                            <IconCashBanknote size={34} />
                        </ThemeIcon>
                        <Text size="lg" fw={500}>No Salary Records Found</Text>
                        <Text c="dimmed" size="sm">
                            Payslips will appear here once the payroll cycle is processed by HR.
                        </Text>
                    </Paper>
                ) : (
                    /* --- SALARY CARDS GRID --- */
                    <SimpleGrid cols={{ base: 1, md: 1 }} spacing="lg">
                        {history.map((slip) => (
                            <Card 
                                key={slip.id} 
                                shadow="sm" 
                                padding="lg" 
                                radius="md" 
                                withBorder 
                                className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-indigo-500"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    
                                    {/* LEFT: Date & Basic Info */}
                                    <div className="flex items-start gap-4">
                                        <ThemeIcon size={50} radius="xl" color="blue" variant="light">
                                            <IconCalendar size={26} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xl" fw={700} tt="uppercase" c="dark">
                                                {slip.month} {slip.year}
                                            </Text>
                                            <Text size="xs" c="dimmed">Generated: {slip.generatedDate}</Text>
                                            <Badge mt="xs" color={getStatusColor(slip.status)} variant="light" size="sm">
                                                {slip.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* CENTER: Breakdown */}
                                    <div className="flex-1 w-full md:w-auto px-0 md:px-8">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <Group justify="space-between" mb={4}>
                                                <Text size="sm" c="dimmed">Base Salary</Text>
                                                <Text size="sm" fw={500}>{formatCurrency(slip.baseAmount)}</Text>
                                            </Group>
                                            <Group justify="space-between">
                                                <Group gap={4}>
                                                    <IconChartLine size={14} className="text-green-600" />
                                                    <Text size="sm" c="dimmed">Performance Bonus</Text>
                                                </Group>
                                                <Text size="sm" fw={600} c="green">
                                                    +{formatCurrency(slip.variableAmount)}
                                                </Text>
                                            </Group>
                                        </div>
                                    </div>

                                    {/* RIGHT: Total & Actions */}
                                    <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                                        <div>
                                            <Text size="xs" c="dimmed" ta="right">NET PAY</Text>
                                            <Text size="xl" fw={800} c="indigo" style={{ lineHeight: 1 }}>
                                                {formatCurrency(slip.totalSalary)}
                                            </Text>
                                        </div>
                                        
                                        <Button 
                                            variant="subtle" 
                                            color="gray" 
                                            size="xs" 
                                            leftSection={<IconDownload size={14} />}
                                            onClick={() => alert("Download PDF Feature Coming Soon!")}
                                        >
                                            Download Slip
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </div>
    );
};

export default MySalary;