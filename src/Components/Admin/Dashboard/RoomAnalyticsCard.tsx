import ReactECharts from "echarts-for-react";
import { Paper, Title, Group, Badge, Text, Center, RingProgress } from "@mantine/core";
import { IconBed } from "@tabler/icons-react";

// Colors aligned with BedStatus Enums:
// OCCUPIED -> Red
// AVAILABLE -> Green
// MAINTENANCE -> Yellow
const COLORS = ['#FF6B6B', '#20C997', '#FCC419']; 

const RoomAnalyticsCard = ({ data }: { data: any }) => {
    
    // Default values to prevent crash
    const stats = data || { occupiedBeds: 0, availableBeds: 0, maintenanceBeds: 0, totalBeds: 0 };
    const total = stats.totalBeds || 0;

    // Check if there is absolutely no data
    const hasData = total > 0;

    const chartData = hasData ? [
        { value: stats.occupiedBeds, name: 'Occupied' },
        { value: stats.availableBeds, name: 'Available' },
        { value: stats.maintenanceBeds, name: 'Maintenance' }
    ] : [];

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textStyle: { fontFamily: 'Urbanist, sans-serif', color: '#333' },
            formatter: (params: any) => `
                <div style="font-weight: 600; margin-bottom: 2px;">${params.name}</div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params.color};"></span>
                    <b>${params.value}</b> Beds
                </div>
            `
        },
        legend: {
            bottom: '0%',
            left: 'center',
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 12, color: '#9CA3AF' }
        },
        series: [
            {
                name: 'Room Status',
                type: 'pie',
                radius: ['50%', '70%'], // Donut shape
                center: ['50%', '45%'], 
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: { show: false, position: 'center' },
                emphasis: {
                    label: { show: true, fontSize: '18', fontWeight: 'bold', color: '#333', formatter: '{c}' }
                },
                data: chartData
            }
        ],
        color: COLORS
    };

    return (
        <Paper shadow="sm" radius="md" p="lg" className="h-full border-none !bg-white flex flex-col">
            <Group justify="space-between" mb="sm">
                <Group gap="xs">
                    <IconBed size={20} className="text-blue-500" />
                    <Title order={5}>Room Occupancy</Title>
                </Group>
                <Badge variant="light" color="blue">Total: {total}</Badge>
            </Group>

            <div className="flex-1 min-h-[200px] relative">
                {hasData ? (
                    <>
                        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                            <Text fw={800} size="1.8rem" c="dark">{stats.occupiedBeds}</Text>
                            <Text size="xs" c="dimmed" fw={600}>Booked</Text>
                        </div>
                    </>
                ) : (
                    <Center h="100%">
                         <RingProgress 
                            sections={[{ value: 100, color: 'gray', opacity: 0.1 }]} 
                            size={160} 
                            thickness={16} 
                            label={<Text c="dimmed" ta="center" size="xs">No Rooms Configured</Text>}
                        />
                    </Center>
                )}
            </div>

            {/* Quick Text Summary */}
            <Group grow mt="xs" gap="xs">
                <div className="text-center p-2 bg-green-50 rounded-lg transition-colors hover:bg-green-100">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Free</Text>
                    <Text fw={800} c="green" size="lg">{stats.availableBeds}</Text>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg transition-colors hover:bg-red-100">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Booked</Text>
                    <Text fw={800} c="red">{stats.occupiedBeds}</Text>
                </div>
            </Group>
        </Paper>
    );
};

export default RoomAnalyticsCard;