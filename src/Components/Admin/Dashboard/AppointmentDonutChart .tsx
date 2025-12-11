import { useState, useMemo, useRef } from "react";
import { Paper, Title, Text, Group, Badge, Center, RingProgress, SimpleGrid, ThemeIcon } from "@mantine/core";
import { IconCalendarTime, } from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";

// Helper to get consistent colors based on status name
const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('completed')) return '#10B981'; // Emerald
    if (lower.includes('scheduled')) return '#6366F1'; // Indigo
    if (lower.includes('cancelled')) return '#EF4444'; // Red
    if (lower.includes('pending')) return '#F59E0B';   // Amber
    return '#9CA3AF'; // Gray default
};

const AppointmentDonutChart = ({ data, totalToday }: { data: any[], totalToday: number }) => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
    const chartRef = useRef<any>(null);

    // Calculate Total
    const total = useMemo(() => data.reduce((acc, cur) => acc + cur.value, 0), [data]);

    // Dynamic Center Text Logic
    const activeItem = activeIndex !== undefined ? data[activeIndex] : null;
    const centerLabel = activeItem ? activeItem.name : "Total Today";
    const centerValue = activeItem ? activeItem.value : (totalToday || total);
    const centerColor = activeItem ? getStatusColor(activeItem.name) : "dimmed";

    // Chart Options
    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textStyle: { color: '#333', fontSize: 12 },
            formatter: (params: any) => {
                return `
                    <div style="font-weight: 600; margin-bottom: 2px;">${params.name}</div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color};"></span>
                        <span style="font-weight: 700;">${params.value}</span>
                    </div>
                `;
            }
        },
        series: [
            {
                name: 'Appointments',
                type: 'pie',
                radius: ['65%', '85%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: { 
                    borderRadius: 8, 
                    borderColor: '#fff', 
                    borderWidth: 3 
                },
                label: { show: false },
                emphasis: { 
                    scale: true, 
                    scaleSize: 5,
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)'
                    }
                },
                data: data.map((item) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: { color: getStatusColor(item.name) }
                }))
            }
        ]
    };

    const onChartEvent = {
        'mouseover': (params: any) => setActiveIndex(params.dataIndex),
        'mouseout': () => setActiveIndex(undefined)
    };

    return (
        <Paper shadow="sm" radius="md" p="lg" className="h-full min-h-[450px] border-none flex flex-col justify-between relative !bg-white">
            
            {/* Header */}
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <ThemeIcon color="violet" variant="light" size="lg">
                        <IconCalendarTime size={20} />
                    </ThemeIcon>
                    <Title order={5}>Appointments</Title>
                </Group>
                <Badge variant="light" color="violet" size="sm">Today</Badge>
            </Group>

            {/* Chart Section */}
            <div className="h-72 relative flex-1">
                {data.length > 0 ? (
                    <>
                        <ReactECharts 
                            ref={chartRef}
                            option={option} 
                            style={{ height: '100%', width: '100%' }}
                            onEvents={onChartEvent}
                        />
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                            <Text fw={800} size="3rem" c={centerColor === 'dimmed' ? 'dark' : centerColor} lh={1}>
                                {centerValue}
                            </Text>
                            <Text size="sm" c="dimmed" fw={700} tt="uppercase" mt={5}>
                                {centerLabel}
                            </Text>
                        </div>
                    </>
                ) : (
                    <Center h="100%">
                        <RingProgress 
                            sections={[{ value: 100, color: 'gray', opacity: 0.1 }]} 
                            size={180} 
                            thickness={16} 
                            label={<Text c="dimmed" ta="center" size="xs">No Appointments</Text>} 
                        />
                    </Center>
                )}
            </div>

            {/* Detailed Legend Grid */}
            <SimpleGrid cols={3} spacing="xs" mt="md">
                {data.map((d: any, i: number) => {
                    const color = getStatusColor(d.name);
                    const percentage = total > 0 ? Math.round((d.value / total) * 100) : 0;
                    
                    return (
                        <Paper 
                            key={i} 
                            withBorder 
                            p="xs" 
                            radius="md" 
                            className={`cursor-pointer transition-all hover:bg-gray-50 ${activeIndex === i ? 'ring-1 ring-offset-1' : ''}`}
                            style={{ borderColor: activeIndex === i ? color : undefined }}
                            onMouseEnter={() => {
                                setActiveIndex(i);
                                chartRef.current?.getEchartsInstance().dispatchAction({ type: 'highlight', dataIndex: i });
                            }}
                            onMouseLeave={() => {
                                setActiveIndex(undefined);
                                chartRef.current?.getEchartsInstance().dispatchAction({ type: 'downplay', dataIndex: i });
                            }}
                        >
                            <div className="flex flex-col items-center text-center">
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={2}>{d.name}</Text>
                                <Text fw={800} size="lg" style={{ color: color }}>{d.value}</Text>
                                <Text size="10px" c="dimmed" fw={600}>{percentage}%</Text>
                            </div>
                        </Paper>
                    );
                })}
            </SimpleGrid>
        </Paper>
    );
};

export default AppointmentDonutChart;