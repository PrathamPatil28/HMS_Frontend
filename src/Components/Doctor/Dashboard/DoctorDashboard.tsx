import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
    SimpleGrid, Text, Paper, Title, Group, 
    RingProgress, Skeleton, Stack, ThemeIcon,
    Grid,
    Badge
} from "@mantine/core";

import { 
    IconUsers, IconCalendarEvent, IconClockHour4, IconChecklist
} from "@tabler/icons-react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

import { getDoctorDashboardStats } from "../../../Service/DoctorStatsService";
import ScheduleTimeline from "./ScheduleTimeline";


// --- COLORS ---
const COLORS = {
    primary: '#4F46E5', // Indigo
    accent: '#06B6D4'   // Cyan
};

// --- KPI CARD ---
const KpiCard = ({ title, value, icon, color, bgColor }: any) => (
    <Paper p="lg" radius="md" className={`border-none shadow-sm relative overflow-hidden ${bgColor}`}>
        <Group justify="space-between" align="start">
            <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">{title}</Text>
                <Text size="2rem" fw={800} mt={4} className="text-slate-800">{value}</Text>
            </div>
            <ThemeIcon size={48} radius="md" variant="white" color={color}>
                {icon}
            </ThemeIcon>
        </Group>
    </Paper>
);

const DoctorDashboard = () => {
    const user = useSelector((state: any) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        if (user?.profileId) {
            getDoctorDashboardStats(user.profileId)
                .then((data) => {
                    setStats(data);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading || !stats) return <div className="p-10"><Skeleton height={200} mb="md"/><Skeleton height={400}/></div>;

    // Calculate Completion Rate
    const totalToday = stats.todayAppointments || 1; // avoid division by zero
    const completedToday = stats.todaySchedule?.filter((a:any) => a.status === 'COMPLETED').length || 0;
    const progress = (completedToday / totalToday) * 100;

    // Mock trend data (Since we didn't implement doctor-specific history trend in backend yet)
    // You can use 'stats.totalAppointments' to show a flat line or implement history endpoint later
    const mockTrend = [
        { day: 'Mon', v: 4 }, { day: 'Tue', v: 6 }, { day: 'Wed', v: 8 }, 
        { day: 'Thu', v: 5 }, { day: 'Fri', v: stats.todayAppointments || 7 }, { day: 'Sat', v: 3 }
    ];

    return (
        <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
            
            {/* HEADER */}
            <div>
                <Title order={2}>Dr. {user.name}</Title>
                <Text c="dimmed">Here's your daily summary</Text>
            </div>

            {/* --- 1. KPI CARDS --- */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                <KpiCard 
                    title="Appointments Today" 
                    value={stats.todayAppointments} 
                    icon={<IconCalendarEvent size={28}/>} 
                    color="indigo" 
                    bgColor="bg-indigo-50"
                />
                <KpiCard 
                    title="Pending" 
                    value={stats.pendingAppointments} 
                    icon={<IconClockHour4 size={28}/>} 
                    color="orange" 
                    bgColor="bg-orange-50"
                />
                <KpiCard 
                    title="Total Patients" 
                    value={stats.totalPatients} 
                    icon={<IconUsers size={28}/>} 
                    color="cyan" 
                    bgColor="bg-cyan-50"
                />
                <KpiCard 
                    title="Total Consultations" 
                    value={stats.totalAppointments} 
                    icon={<IconChecklist size={28}/>} 
                    color="emerald" 
                    bgColor="bg-emerald-50"
                />
            </SimpleGrid>

            {/* --- 2. MAIN CONTENT GRID --- */}
            <Grid gutter="lg">
                
                {/* 2A. TODAY'S SCHEDULE (Timeline) */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <ScheduleTimeline schedule={stats.todaySchedule} />
                </Grid.Col>

                {/* 2B. PROGRESS & CHART */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg" h="100%">
                        
                        {/* Progress Section */}
                        <Paper shadow="sm" radius="md" p="lg" className="border-none flex items-center justify-between bg-white">
                            <div>
                                <Text size="lg" fw={700}>Daily Goal</Text>
                                <Text c="dimmed" size="sm">
                                    You have completed <b>{completedToday}</b> out of <b>{stats.todayAppointments}</b> appointments today.
                                </Text>
                            </div>
                            <RingProgress 
                                size={80} 
                                roundCaps 
                                thickness={8} 
                                sections={[{ value: progress, color: 'indigo' }]} 
                                label={
                                    <Text c="indigo" fw={700} ta="center" size="xs">
                                        {Math.round(progress)}%
                                    </Text>
                                } 
                            />
                        </Paper>

                        {/* Weekly Trend Chart */}
                        <Paper shadow="sm" radius="md" p="lg" className="border-none flex-1 bg-white">
                            <Group justify="space-between" mb="lg">
                                <Title order={5}>Weekly Activity</Title>
                                <Badge variant="light" color="indigo">Consultations</Badge>
                            </Group>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mockTrend}>
                                        <defs>
                                            <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                                        <Tooltip 
                                            cursor={{ stroke: COLORS.primary, strokeWidth: 2 }}
                                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="v" 
                                            stroke={COLORS.primary} 
                                            fillOpacity={1} 
                                            fill="url(#colorV)" 
                                            strokeWidth={3} 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Paper>
                    </Stack>
                </Grid.Col>
            </Grid>
        </div>
    );
};

export default DoctorDashboard;