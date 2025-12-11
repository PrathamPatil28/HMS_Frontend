import { useEffect, useState } from "react";
import { SimpleGrid, Text, Paper, Group, Grid, Stack,  } from "@mantine/core";
import { IconUserPlus, IconCash, IconCalendarStats, IconActivity,  } from "@tabler/icons-react";
import ReactECharts from "echarts-for-react";

// --- SERVICES ---
import { 
    getAmbulanceStats, getAppointmentStats, getAppointmentTrend, 
    getBillingStats, getBloodStats, getLabStats, getPharmacyStats, getProfileStats 
} from "../../../Service/StatsService";
import { errorNotification } from "../../../util/NotificationUtil";

// --- SUB-COMPONENTS ---
import AppointmentDonutChart from "./AppointmentDonutChart ";
import MedicineAnalyticsCard from "./MedicineAnalyticsCard"; 
import BloodAnalyticsCard from "./BloodAnalyticsCard"; 
import AmbulanceAnalyticsCard from "./AmbulanceAnalyticsCard"; 
import LabAnalyticsCard from "./LabAnalyticsCard"; 
import ProfileAnalyticsCard from "./ProfileAnalyticsCard"; 
import RevenueAnalyticsCard from "./RevenueAnalyticsCard"; // ✅ IMPORT NEW COMPONENT
import RoomAnalyticsCard from "./RoomAnalyticsCard";

// --- REUSABLE STAT CARD ---
const StatCard = ({ title, value, icon, color, waveColor, bgColor }: any) => {
    const waveOption = {
        grid: { top: 0, bottom: 0, left: 0, right: 0 },
        xAxis: { show: false, type: 'category', boundaryGap: false },
        yAxis: { show: false, min: 0, max: 100 },
        series: [{
            data: [20, 40, 30, 50, 40, 60, 50, 70, 60, 80, 70, 90, 80, 100],
            type: 'line', smooth: 0.4, symbol: 'none', lineStyle: { width: 0 },
            areaStyle: { color: waveColor, opacity: 0.3 }
        }]
    };
    return (
        <Paper radius="md" className="overflow-hidden shadow-sm hover:shadow-md transition-all h-32 relative !border-none">
            <div className={`absolute inset-0 ${bgColor} opacity-20`}></div>
            <div className="p-4 h-full flex flex-col justify-between relative z-10">
                <Group justify="space-between" align="start">
                    <div className={`p-2 rounded-lg text-white shadow-md ${color}`}>{icon}</div>
                    <div className="text-right">
                        <Text c="dimmed" size="xs" fw={700} tt="uppercase">{title}</Text>
                        <Text fw={800} size="1.7rem" className="text-slate-800">{value}</Text>
                    </div>
                </Group>
                <div className="absolute bottom-0 left-0 right-0 h-12 opacity-60"><ReactECharts option={waveOption} style={{ height: '100%', width: '100%' }} /></div>
            </div>
        </Paper>
    );
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        appointments: {}, profiles: {}, pharmacy: {}, billing: {}, 
        blood: {}, lab: {}, ambulance: {}, trend: []
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [appt, prof, pharm, bill, blood, lab, amb, trend] = await Promise.all([
                    getAppointmentStats(), getProfileStats(), getPharmacyStats(), getBillingStats(),
                    getBloodStats(), getLabStats(), getAmbulanceStats(), getAppointmentTrend()
                ]);

                setStats({
                    appointments: appt, profiles: prof, pharmacy: pharm, billing: bill,
                    blood: blood, lab: lab, ambulance: amb,
                    trend: trend.map((t: any) => ({
                        date: new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                        count: t.count
                    }))
                });
            } catch (error) {
                console.error("Dashboard Error", error);
                errorNotification("Failed to load metrics");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="p-6 space-y-6 bg-[#F3F4F6] min-h-screen font-sans text-slate-800">
            
            {/* 1. TOP STAT CARDS */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                <StatCard title="Total Appointments" value={stats.appointments.totalAppointments} icon={<IconCalendarStats size={24} />} color="bg-violet-500" waveColor="#7C4DFF" bgColor="bg-violet-100" />
                <StatCard title="Lab Operations" value={stats.lab.completedTests} icon={<IconActivity size={24} />} color="bg-orange-400" waveColor="#FFB74D" bgColor="bg-orange-100" />
                <StatCard title="Total Patients" value={stats.profiles.totalPatients} icon={<IconUserPlus size={24} />} color="bg-emerald-500" waveColor="#00E676" bgColor="bg-emerald-100" />
                <StatCard title="Today's Earnings" value={`₹${stats.billing.todayRevenue || 0}`} icon={<IconCash size={24} />} color="bg-blue-500" waveColor="#2979FF" bgColor="bg-blue-100" />
            </SimpleGrid>

            {/* 2. MIDDLE SECTION */}
            <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <AppointmentDonutChart data={[{ name: 'Completed', value: stats.appointments.completed }, { name: 'Scheduled', value: stats.appointments.scheduled }, { name: 'Cancelled', value: stats.appointments.cancelled }]} totalToday={stats.appointments.todayAppointments} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <AmbulanceAnalyticsCard data={stats.ambulance} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                     <BloodAnalyticsCard data={stats.blood} />
                </Grid.Col>
            </Grid>

            {/* 3. PROFILE & LAB */}
            <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <ProfileAnalyticsCard data={stats.profiles} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <LabAnalyticsCard data={stats.lab} />
                </Grid.Col>
            </Grid>

            {/* 4. MEDICINE & REVENUE */}
            <Stack gap="lg">
                <MedicineAnalyticsCard data={stats.pharmacy} />
                <RoomAnalyticsCard data={stats.rooms} />
                
                {/* ✅ REPLACED WITH NEW COMPONENT */}
                <RevenueAnalyticsCard data={stats.billing} />
            </Stack>
        </div>
    );
};

export default AdminDashboard;