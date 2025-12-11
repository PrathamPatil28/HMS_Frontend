import { Paper, Group, ThemeIcon, Title, Badge, Text, SimpleGrid, } from "@mantine/core";
import { IconDroplet, IconHeartHandshake, IconActivity } from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts';

interface BloodAnalyticsProps {
    data: any; 
}

const BloodAnalyticsCard = ({ data }: BloodAnalyticsProps) => {

    const stockData = data.stockLevels || [];

    const formatLabel = (label: string) => {
        return label.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
    };

    const order = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    const chartLabels = order;
    const chartValues = order.map(group => {
        const found = stockData.find((d: any) => formatLabel(d.bloodGroup) === group);
        return found ? found.count : 0;
    });

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: '{b}: {c} units'
        },
        grid: {
            left: '2%', right: '2%', bottom: '5%', top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: chartLabels,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { color: '#6B7280', fontWeight: 'bold', interval: 0, fontSize: 11 }
        },
        yAxis: { type: 'value', show: false },
        series: [
            {
                name: 'Units',
                type: 'bar',
                barWidth: '24px', // ✅ Thicker bars
                data: chartValues,
                label: { show: true, position: 'top', color: '#EF4444', fontWeight: 'bold', fontSize: 12 },
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#EF4444' }, 
                        { offset: 1, color: '#FCA5A5' } 
                    ])
                },
                showBackground: true,
                backgroundStyle: { color: '#FEF2F2', borderRadius: [6, 6, 0, 0] }
            }
        ]
    };

    // ✅ ADDED: min-h-[450px]
    return (
        <Paper shadow="sm" radius="md" p="lg" className="border-none !bg-white h-full min-h-[450px] flex flex-col">
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <ThemeIcon color="red" variant="light" size="lg"><IconDroplet size={20} /></ThemeIcon>
                    <Title order={5}>Blood Bank</Title>
                </Group>
                <Badge variant="light" color="red">Live Stock</Badge>
            </Group>

            <SimpleGrid cols={2} spacing="md" mb="lg">
                <Paper withBorder p="md" radius="md" className="bg-red-50 border-red-100">
                    <Group gap="xs">
                        <IconHeartHandshake size={26} className="text-red-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Donors</Text>
                            <Text size="xl" fw={800} c="dark">{data.totalDonors || 0}</Text>
                        </div>
                    </Group>
                </Paper>
                <Paper withBorder p="md" radius="md" className="bg-orange-50 border-orange-100">
                    <Group gap="xs">
                        <IconActivity size={26} className="text-orange-500" />
                        <div>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Requests</Text>
                            <Text size="xl" fw={800} c="dark">{data.pendingRequests || 0}</Text>
                        </div>
                    </Group>
                </Paper>
            </SimpleGrid>

            {/* ✅ INCREASED HEIGHT: h-64 (256px) */}
            <div className="flex-1 min-h-[250px] h-64">
                <Text size="xs" c="dimmed" fw={700} ta="center" mb="xs" tt="uppercase">
                    Stock Levels by Group
                </Text>
                <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
            </div>
        </Paper>
    );
};

export default BloodAnalyticsCard;