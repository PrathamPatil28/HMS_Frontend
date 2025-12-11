import { Paper, Group, ThemeIcon, Title, Badge, SimpleGrid, Text, Divider, Grid } from "@mantine/core";
import { IconAmbulance, IconMapPin2, IconBellRinging } from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";

interface AmbulanceAnalyticsProps {
    data: any; 
}

const AmbulanceAnalyticsCard = ({ data }: AmbulanceAnalyticsProps) => {

    // --- 1. AMBULANCE CHART (Donut) ---
    const ambulanceOption = {
        tooltip: { trigger: 'item' },
        legend: { 
            bottom: 0, 
            left: 'center', 
            icon: 'circle', 
            itemGap: 15, 
            textStyle: { fontSize: 11 },
            padding: [15, 0, 0, 0] 
        },
        series: [
            {
                name: 'Ambulance Status',
                type: 'pie',
                radius: ['55%', '75%'],
                center: ['50%', '40%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
                label: { show: false, position: 'center' },
                emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', formatter: '{c}' } },
                data: [
                    { value: data.availableAmbulances || 0, name: 'Available', itemStyle: { color: '#10B981' } },
                    { value: data.bookedAmbulances || 0, name: 'Busy/Booked', itemStyle: { color: '#F59E0B' } },
                    { value: data.outOfServiceAmbulances || 0, name: 'Maintenance', itemStyle: { color: '#9CA3AF' } }
                ]
            }
        ]
    };

    // --- 2. DRIVER CHART (Bar) ---
    const driverOption = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        // ✅ FIX: Increased 'right' padding to make space for the number labels
        grid: { left: '2%', right: '15%', bottom: '5%', top: '5%', containLabel: true },
        xAxis: { type: 'value', show: false },
        yAxis: { 
            type: 'category', 
            data: ['Off Duty', 'On Trip', 'Available'],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#6B7280', fontSize: 11, fontWeight: 600 }
        },
        series: [
            {
                name: 'Drivers',
                type: 'bar',
                barWidth: '22px', 
                label: { show: true, position: 'right', fontWeight: 'bold', color: '#374151' },
                data: [
                    { value: data.offDutyDrivers || 0, itemStyle: { color: '#9CA3AF' } },
                    { value: data.onTripDrivers || 0, itemStyle: { color: '#6366F1' } },
                    { value: data.availableDrivers || 0, itemStyle: { color: '#10B981' } }
                ],
                itemStyle: { borderRadius: [0, 6, 6, 0] }
            }
        ]
    };

    return (
        <Paper shadow="sm" radius="md" p="lg" className="border-none !bg-white h-full min-h-[450px] flex flex-col">
            
            {/* Header */}
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <ThemeIcon color="grape" variant="light" size="lg"><IconAmbulance size={20} /></ThemeIcon>
                    <Title order={5}>Ambulance Fleet</Title>
                </Group>
                <Badge variant="light" color="grape">Operations</Badge>
            </Group>

            {/* KPI Cards */}
            <SimpleGrid cols={2} spacing="md" mb="lg">
                <Paper withBorder p="md" radius="md" className="bg-indigo-50 border-indigo-100">
                    <Group gap="xs">
                        <IconMapPin2 size={26} className="text-indigo-500 animate-pulse" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Active Trips</Text>
                            <Text size="xl" fw={800} c="indigo">{data.activeTrips || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="md" radius="md" className="bg-orange-50 border-orange-100">
                    <Group gap="xs">
                        <IconBellRinging size={26} className="text-orange-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Requests</Text>
                            <Text size="xl" fw={800} c="orange">{data.pendingRequests || 0}</Text>
                        </div>
                    </Group>
                </Paper>
            </SimpleGrid>

            <Divider my="sm" />

            {/* Charts Section */}
            <Grid gutter="xs" align="center" className="flex-1">
                <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" fw={700} ta="center" mb={5} tt="uppercase">Vehicles</Text>
                    <div className="h-56">
                        <ReactECharts option={ambulanceOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" fw={700} ta="center" mb={5} tt="uppercase">Drivers</Text>
                    <div className="h-56">
                        <ReactECharts option={driverOption} style={{ height: '100%', width: '100%' }} />
                    </div>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default AmbulanceAnalyticsCard;