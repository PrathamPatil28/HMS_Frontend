import { Paper, Group, ThemeIcon, Title, Badge, Text, SimpleGrid } from "@mantine/core";
import { IconUsers, IconStethoscope, IconSteeringWheel, IconMicroscope } from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";

interface ProfileAnalyticsProps {
    data: any; // ProfileStatsDTO
}

const ProfileAnalyticsCard = ({ data }: ProfileAnalyticsProps) => {

    const totalUsers = (data.totalPatients || 0) + (data.totalDoctors || 0) + (data.totalDrivers || 0) + (data.totalTechnicians || 0);

    // --- CHART DATA CONFIG ---
    const chartData = [
        { 
            name: 'Patients', 
            value: data.totalPatients || 0, 
            color: '#10B981', // Emerald
            icon: IconUsers 
        },
        { 
            name: 'Doctors', 
            value: data.totalDoctors || 0, 
            color: '#3B82F6', // Blue
            icon: IconStethoscope 
        },
        { 
            name: 'Staff', // Technicians
            value: data.totalTechnicians || 0, 
            color: '#EC4899', // Pink
            icon: IconMicroscope 
        },
        { 
            name: 'Drivers', 
            value: data.totalDrivers || 0, 
            color: '#F59E0B', // Amber
            icon: IconSteeringWheel 
        }
    ];

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textStyle: { color: '#333' }
        },
        grid: {
            left: '2%', right: '2%', bottom: '2%', top: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: chartData.map(d => d.name),
            axisTick: { alignWithLabel: true, show: false },
            axisLine: { show: true, lineStyle: { color: '#E5E7EB' } },
            axisLabel: {
                color: '#6B7280',
                fontWeight: '600',
                fontSize: 12,
                interval: 0,
                margin: 12
            }
        },
        yAxis: {
            type: 'value',
            splitLine: { 
                show: true,
                lineStyle: {
                    color: '#F3F4F6',
                    type: 'dashed'
                }
            },
            axisLine: { show: false },
            axisLabel: {
                color: '#9CA3AF',
                fontSize: 11
            }
        },
        series: [
            {
                name: 'Users',
                type: 'bar',
                barWidth: '40%', // Wider bars like the reference image
                data: chartData.map(d => ({
                    value: d.value,
                    itemStyle: {
                        color: d.color, // Keep your existing colors
                        borderRadius: [4, 4, 0, 0]
                    }
                })),
                label: {
                    show: true,
                    position: 'top',
                    fontWeight: 'bold',
                    color: '#4B5563',
                    fontSize: 12
                }
            }
        ]
    };

    return (
        <Paper shadow="sm" radius="md" p="lg" className="border-none !bg-white h-full min-h-[350px] flex flex-col">
            
            {/* Header */}
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <ThemeIcon color="grape" variant="light" size="lg"><IconUsers size={20} /></ThemeIcon>
                    <Title order={5}>User Demographics</Title>
                </Group>
                <Badge variant="light" color="grape">Total: {totalUsers}</Badge>
            </Group>

            {/* Vertical Bar Chart */}
            <div className="flex-1 h-[220px]">
                <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
            </div>

            {/* Legend / Stats Grid */}
            <SimpleGrid cols={2} spacing="md" mt="lg">
                <Paper withBorder p="xs" radius="md" className="bg-blue-50 border-blue-100">
                    <Group gap="xs">
                        <IconStethoscope size={20} className="text-blue-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Doctors</Text>
                            <Text size="md" fw={800} c="dark">{data.totalDoctors || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="xs" radius="md" className="bg-pink-50 border-pink-100">
                    <Group gap="xs">
                        <IconMicroscope size={20} className="text-pink-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Technicians</Text>
                            <Text size="md" fw={800} c="dark">{data.totalTechnicians || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="xs" radius="md" className="bg-amber-50 border-amber-100">
                    <Group gap="xs">
                        <IconSteeringWheel size={20} className="text-amber-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Drivers</Text>
                            <Text size="md" fw={800} c="dark">{data.totalDrivers || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="xs" radius="md" className="bg-gray-50 border-gray-100">
                    <Group gap="xs">
                        <IconUsers size={20} className="text-gray-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Users</Text>
                            <Text size="md" fw={800} c="dark">{totalUsers}</Text>
                        </div>
                    </Group>
                </Paper>
            </SimpleGrid>
        </Paper>
    );
};

export default ProfileAnalyticsCard;