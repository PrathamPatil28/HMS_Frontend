import { Paper, Group, ThemeIcon, Title, Badge, Text, Grid, Stack, Divider, SimpleGrid } from "@mantine/core";
import { IconCoinRupee, IconChartPie, IconTrendingUp, IconReceipt } from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";

interface RevenueAnalyticsProps {
    data: any; // Replace with BillingStatsDTO
}

const RevenueAnalyticsCard = ({ data }: RevenueAnalyticsProps) => {

    // --- 1. DATA PROCESSING ---
    const revenueSourceData = data.revenueSources?.map((s: any) => ({
        name: s.serviceName.replace("_MS", "").replace("BANK", ""),
        value: s.totalAmount
    })) || [];

    const topService = revenueSourceData.reduce((prev: any, current: any) => 
        (prev.value > current.value) ? prev : current, { name: 'N/A', value: 0 }
    );

    const formatCurrency = (amount: number) => {
        return amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    };

    // --- 2. CHART CONFIGURATION ---
    const chartOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textStyle: { color: '#333' },
            formatter: (params: any) => {
                return `
                    <div style="font-weight: 600; margin-bottom: 2px;">${params.name}</div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color};"></span>
                        <span style="font-weight: 700;">₹${params.value.toLocaleString()}</span>
                        <span style="color: #6B7280; font-size: 11px;">(${params.percent}%)</span>
                    </div>
                `;
            }
        },
        legend: {
            orient: 'vertical',
            right: '0%',
            top: 'center',
            icon: 'circle',
            itemGap: 12,
            textStyle: { fontSize: 12, color: '#4B5563', fontWeight: 500 }
        },
        series: [
            {
                name: 'Revenue',
                type: 'pie',
                radius: ['60%', '85%'], 
                center: ['35%', '50%'], 
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 3
                },
                // ✅ FIX: Disable center label on hover to keep the static text visible
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: { show: false }, // Don't show text on hover
                    scale: true,
                    scaleSize: 5
                },
                data: revenueSourceData,
                color: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
            }
        ]
    };

    return (
        <Paper shadow="sm" radius="md" p="xl" className="border-none !bg-white min-h-[350px]">
            
            {/* Header */}
            <Group justify="space-between" mb="xl">
                <Group gap="xs">
                    <ThemeIcon color="green" variant="light" size="lg">
                        <IconCoinRupee size={22} />
                    </ThemeIcon>
                    <Title order={4} fw={800} c="dark">Financial Overview</Title>
                </Group>
                <Badge variant="light" color="green" size="lg">Live Financials</Badge>
            </Group>

            <Grid gutter="xl" align="center">
                
                {/* --- LEFT SIDE: STATS SUMMARY --- */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Stack gap="xl">
                        
                        <div>
                            <Text c="dimmed" size="xs" fw={700} tt="uppercase" mb={4}>Total Lifetime Revenue</Text>
                            <Text 
                                size="3.5rem" 
                                fw={900} 
                                lh={1} 
                                style={{ letterSpacing: '-1px' }}
                                variant="gradient"
                                gradient={{ from: 'dark', to: 'gray', deg: 45 }}
                            >
                                {formatCurrency(data.overallRevenue || 0)}
                            </Text>
                            <Group mt="xs" gap={5}>
                                <IconTrendingUp size={16} className="text-green-600" />
                                <Text size="sm" c="green.7" fw={600}>Revenue Stream Healthy</Text>
                            </Group>
                        </div>

                        <Divider />

                        <SimpleGrid cols={2} spacing="md">
                            <Paper withBorder p="sm" radius="md" className="bg-green-50/50 border-green-100 transition hover:shadow-sm">
                                <Group align="start" justify="space-between">
                                    <div>
                                        <Text size="xs" c="green.8" fw={700} tt="uppercase">Today</Text>
                                        <Text size="xl" fw={800} c="green.9">{formatCurrency(data.todayRevenue || 0)}</Text>
                                    </div>
                                    <ThemeIcon variant="white" color="green" radius="xl" size="sm"><IconCoinRupee size={14}/></ThemeIcon>
                                </Group>
                            </Paper>

                            <Paper withBorder p="sm" radius="md" className="bg-indigo-50/50 border-indigo-100 transition hover:shadow-sm">
                                <Group align="start" justify="space-between">
                                    <div className="overflow-hidden">
                                        <Text size="xs" c="indigo.8" fw={700} tt="uppercase">Top Source</Text>
                                        <Text size="md" fw={800} c="indigo.9" truncate>{topService.name}</Text>
                                        <Text size="xs" c="indigo.6" fw={600}>{formatCurrency(topService.value)}</Text>
                                    </div>
                                    <ThemeIcon variant="white" color="indigo" radius="xl" size="sm"><IconChartPie size={14}/></ThemeIcon>
                                </Group>
                            </Paper>

                            <Paper withBorder p="sm" radius="md" className="bg-orange-50/50 border-orange-100 transition hover:shadow-sm">
                                <Group align="start" justify="space-between">
                                    <div>
                                        <Text size="xs" c="orange.8" fw={700} tt="uppercase">Pending</Text>
                                        <Text size="xl" fw={800} c="orange.9">{data.pendingBills || 0}</Text>
                                    </div>
                                    <ThemeIcon variant="white" color="orange" radius="xl" size="sm"><IconReceipt size={14}/></ThemeIcon>
                                </Group>
                            </Paper>

                            <Paper withBorder p="sm" radius="md" className="bg-gray-50/50 border-gray-200 transition hover:shadow-sm">
                                <Group align="start" justify="space-between">
                                    <div>
                                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Bills</Text>
                                        <Text size="xl" fw={800} c="dark">{data.totalBills || 0}</Text>
                                    </div>
                                    <ThemeIcon variant="white" color="gray" radius="xl" size="sm"><IconReceipt size={14}/></ThemeIcon>
                                </Group>
                            </Paper>
                        </SimpleGrid>

                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 0, md: 1 }} className="flex justify-center">
                    <div className="h-64 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden md:block"></div>
                </Grid.Col>

                {/* --- RIGHT SIDE: CHART --- */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <div className="relative">
                        <Group justify="center" mb="sm">
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Revenue Breakdown by Department</Text>
                        </Group>
                        <div className="h-[300px] w-full">
                            <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
                        </div>
                        {/* Center Overlay for Donut */}
                        <div className="absolute top-[50%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center hidden md:block">
                            <Text size="xs" c="dimmed" fw={700}>TOTAL</Text>
                            <Text size="lg" fw={800} c="dark">100%</Text>
                        </div>
                    </div>
                </Grid.Col>

            </Grid>
        </Paper>
    );
};

export default RevenueAnalyticsCard;