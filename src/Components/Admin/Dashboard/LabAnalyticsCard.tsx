import { Paper, Group, ThemeIcon, Title, Badge, Text, SimpleGrid, Grid } from "@mantine/core";
import { IconMicroscope, IconFlask, IconReportMedical, IconActivity } from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts'; // ✅ Import echarts for Gradients

interface LabAnalyticsProps {
    data: any; 
}

const LabAnalyticsCard = ({ data }: LabAnalyticsProps) => {

    // --- 1. BAR CHART (Test Status - Sorted & Gradients) ---
    const rawStatusData = [
        { 
            name: 'Pending', 
            value: data.pendingTests || 0, 
            // Gradient: Orange to Red-Orange
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#FBBF24' }, // Amber 400
                { offset: 1, color: '#EA580C' }  // Orange 600
            ])
        },
        { 
            name: 'Processing', 
            value: data.sampleCollectedTests || 0, 
            // Gradient: Light Blue to Deep Blue
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#60A5FA' }, // Blue 400
                { offset: 1, color: '#2563EB' }  // Blue 600
            ])
        },
        { 
            name: 'Completed', 
            value: data.completedTests || 0, 
            // Gradient: Light Green to Emerald
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#34D399' }, // Emerald 400
                { offset: 1, color: '#059669' }  // Emerald 600
            ])
        }
    ];

    // Sort Data: Ascending (Smallest at Bottom, Largest at Top)
    const sortedStatusData = [...rawStatusData].sort((a, b) => a.value - b.value);

    const barOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        grid: {
            left: '3%', right: '12%', bottom: '3%', top: '3%', 
            containLabel: true
        },
        xAxis: {
            type: 'value',
            show: false, 
            splitLine: { show: false }
        },
        yAxis: {
            type: 'category',
            data: sortedStatusData.map(d => d.name),
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
                color: '#4B5563',
                fontWeight: '600',
                fontSize: 11
            }
        },
        series: [
            {
                name: 'Tests',
                type: 'bar',
                barWidth: '24px',
                data: sortedStatusData.map(d => ({
                    value: d.value,
                    itemStyle: {
                        color: d.color,
                        borderRadius: [0, 6, 6, 0] // Smoother rounding
                    }
                })),
                label: {
                    show: true,
                    position: 'right', 
                    fontWeight: 'bold',
                    color: '#374151',
                    fontSize: 12
                },
                showBackground: true,
                backgroundStyle: {
                    color: '#F3F4F6',
                    borderRadius: [0, 6, 6, 0]
                }
            }
        ]
    };

    // --- 2. PIE CHART (Categories) ---
    const categoryMap = data.categoryBreakdown || {};
    const pieData = Object.keys(categoryMap).map(key => ({
        name: key.charAt(0) + key.slice(1).toLowerCase(),
        value: categoryMap[key]
    }));

    const pieOption = {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { 
            type: 'scroll', orient: 'vertical', right: 0, top: 'middle', 
            icon: 'circle', itemGap: 10, textStyle: { fontSize: 11 } 
        },
        series: [{
            name: 'Test Categories',
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
            label: { show: false },
            data: pieData,
            color: ['#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1']
        }]
    };

    return (
        <Paper shadow="sm" radius="md" p="lg" className="border-none !bg-white h-full min-h-[350px] flex flex-col">
            
            {/* Header */}
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <ThemeIcon color="teal" variant="light" size="lg"><IconMicroscope size={20} /></ThemeIcon>
                    <Title order={5}>Lab Operations</Title>
                </Group>
                <Badge variant="light" color="teal">Live Reports</Badge>
            </Group>

            {/* KPI Cards */}
            <SimpleGrid cols={3} spacing="md" mb="xl">
                <Paper withBorder p="xs" radius="md" className="bg-orange-50 border-orange-100">
                    <Group gap="xs">
                        <IconFlask size={20} className="text-orange-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Pending</Text>
                            <Text size="lg" fw={800} c="dark">{data.pendingTests || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="xs" radius="md" className="bg-blue-50 border-blue-100">
                    <Group gap="xs">
                        <IconActivity size={20} className="text-blue-500 animate-pulse" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Processing</Text>
                            <Text size="lg" fw={800} c="dark">{data.sampleCollectedTests || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="xs" radius="md" className="bg-green-50 border-green-100">
                    <Group gap="xs">
                        <IconReportMedical size={20} className="text-green-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Completed</Text>
                            <Text size="lg" fw={800} c="dark">{data.completedTests || 0}</Text>
                        </div>
                    </Group>
                </Paper>
            </SimpleGrid>

            {/* Charts Section */}
            <Grid gutter="lg" align="center" className="flex-1">
                
                {/* 1. STATUS WORKFLOW (Sorted Bar Chart with Gradients) */}
                <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" fw={700} ta="center" mb={5} tt="uppercase">Status Overview</Text>
                    <div className="h-56">
                        <ReactECharts option={barOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                </Grid.Col>

                {/* 2. CATEGORY BREAKDOWN (Pie) */}
                <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" fw={700} ta="center" mb={5} tt="uppercase">Test Categories</Text>
                    <div className="h-56">
                        <ReactECharts option={pieOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default LabAnalyticsCard;    