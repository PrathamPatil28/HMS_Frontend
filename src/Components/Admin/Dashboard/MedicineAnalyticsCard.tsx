import { 
    Paper, Group, ThemeIcon, Title, Badge, SimpleGrid, 
    Text, Divider, Grid, Stack, 
} from "@mantine/core";
import { 
    IconPill, IconBoxSeam, IconAlertTriangle, IconClockHour4, 
    IconCoinRupee, IconShoppingCart,
} from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts';

interface MedicineAnalyticsProps {
    data: any; 
}

const MedicineAnalyticsCard = ({ data }: MedicineAnalyticsProps) => {

    // --- 1. RADAR CHART CONFIGURATION ---
    const categoryData = data.categoryBreakdown || [];
    
    // Find max value to scale the chart dynamically
    const maxVal = Math.max(...categoryData.map((c: any) => c.count), 10); // Default to 10 if empty

    const radarOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textStyle: { color: '#333' }
        },
        radar: {
            // Shape and Size
            shape: 'circle', 
            radius: '65%', // Leave space for labels
            center: ['50%', '50%'],
            
            // Axis Indicators (The labels)
            indicator: categoryData.map((c: any) => ({
                name: c.label,
                max: maxVal + (maxVal * 0.2) // Add 20% buffer
            })),
            
            // Styling the Web
            splitNumber: 4,
            axisName: {
                color: '#6B7280', // Gray text
                fontWeight: '600',
                fontSize: 10,
                formatter: (value: string) => {
                    // Wrap long text
                    return value.length > 10 ? value.replace(' ', '\n') : value;
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['#F9FAFB', '#F3F4F6', '#F9FAFB', '#F3F4F6'], // Alternating light gray
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(211, 211, 211, 0.5)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(211, 211, 211, 0.5)'
                }
            }
        },
        series: [
            {
                name: 'Stock Distribution',
                type: 'radar',
                data: [
                    {
                        value: categoryData.map((c: any) => c.count),
                        name: 'Inventory Count',
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#3B82F6' // Point color
                        },
                        lineStyle: {
                            width: 2,
                            color: '#3B82F6' // Line color
                        },
                        areaStyle: {
                            // Beautiful Blue Gradient
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(59, 130, 246, 0.6)' }, // Blue
                                { offset: 1, color: 'rgba(6, 182, 212, 0.2)' }   // Cyan transparent
                            ])
                        }
                    }
                ]
            }
        ]
    };

    // --- 2. PIE CHART CONFIGURATION ---
    const typeData = data.typeBreakdown?.map((t: any) => ({ name: t.label, value: t.count })) || [];
    
    const pieOption = {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 0,
            top: 'middle',
            icon: 'circle',
            itemGap: 10,
            pageIconColor: '#3B82F6',
            textStyle: { color: '#666', fontSize: 11 }
        },
        series: [{
            name: 'Medicine Type',
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
            label: { show: false },
            data: typeData,
            color: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']
        }]
    };

    return (
        <Paper shadow="sm" radius="md" p="lg" className="border-none !bg-white h-full">
            {/* Header */}
            <Group justify="space-between" mb="lg">
                <Group gap="xs">
                    <ThemeIcon color="cyan" variant="light" size="lg">
                        <IconPill size={20} />
                    </ThemeIcon>
                    <Title order={5}>Medicine Stock & Sales</Title>
                </Group>
                <Badge variant="light" color="cyan">Inventory Live</Badge>
            </Group>

            {/* Top KPI Cards (Horizontal) */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
                <Paper withBorder p="xs" radius="md" className="bg-gray-50 border-gray-100">
                    <Group>
                        <ThemeIcon size="lg" variant="light" color="gray"><IconBoxSeam size={20} /></ThemeIcon>
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Stock Units</Text>
                            <Text size="lg" fw={800} c="dark">{data.totalStockItems || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="xs" radius="md" className="bg-red-50 border-red-100">
                    <Group>
                        <ThemeIcon size="lg" variant="light" color="red"><IconAlertTriangle size={20} /></ThemeIcon>
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Low Stock</Text>
                            <Text size="lg" fw={800} c="red">{data.lowStockMedicines || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="xs" radius="md" className="bg-amber-50 border-amber-100">
                    <Group>
                        <ThemeIcon size="lg" variant="light" color="orange"><IconClockHour4 size={20} /></ThemeIcon>
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Expiring</Text>
                            <Text size="lg" fw={800} c="amber">{data.expiringInventory || 0}</Text>
                        </div>
                    </Group>
                </Paper>
            </SimpleGrid>

            <Divider my="sm" label="Analytics Breakdown" labelPosition="center" />

            {/* Main Layout: 3 Columns (KPIs - Radar - Pie) */}
            <Grid gutter="xl" align="center">
                
                {/* 1. FINANCIAL KPI (Left Sidebar) */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Stack gap="md">
                        <Paper p="md" radius="md" className="bg-green-50 border border-green-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10"><IconCoinRupee size={60} /></div>
                            <Text size="xs" c="green.8" fw={700} tt="uppercase" mb={4}>Total Revenue</Text>
                            <Text size="1.8rem" fw={800} c="green.9" lh={1} mb={5}>
                                {data.overallRevenue?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) || "0"}
                            </Text>
                            <Badge color="green" variant="light" size="xs">+12% vs last month</Badge>
                        </Paper>

                        <Paper p="md" radius="md" className="bg-blue-50 border border-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10"><IconShoppingCart size={60} /></div>
                            <Text size="xs" c="blue.8" fw={700} tt="uppercase" mb={4}>Items Sold</Text>
                            <Text size="1.8rem" fw={800} c="blue.9" lh={1} mb={5}>
                                {data.totalItemsSold?.toLocaleString() || "0"}
                            </Text>
                            <Badge color="blue" variant="light" size="xs">High Demand</Badge>
                        </Paper>
                    </Stack>
                </Grid.Col>

                {/* 2. RADAR CHART (Center Stage) */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <div className="flex flex-col items-center h-full">
                        <Text size="xs" c="dimmed" fw={700} mb="xs" tt="uppercase">Category Distribution</Text>
                        <div className="h-[280px] w-full">
                            <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
                        </div>
                    </div>
                </Grid.Col>

                {/* 3. PIE CHART (Right) */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <div className="flex flex-col items-center h-full">
                        <Text size="xs" c="dimmed" fw={700} mb="xs" tt="uppercase">Medicine Type</Text>
                        <div className="h-[280px] w-full">
                            <ReactECharts option={pieOption} style={{ height: '100%', width: '100%' }} />
                        </div>
                    </div>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default MedicineAnalyticsCard;