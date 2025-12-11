import { useEffect, useState } from "react";
import { 
    SimpleGrid, Text, Paper, Title, Group 
    , RingProgress, LoadingOverlay, Button 
} from "@mantine/core";
import { 
    IconTestPipe, IconFlask, IconCheckbox,  IconArrowRight 
} from "@tabler/icons-react";
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from "recharts";
import { useNavigate } from "react-router-dom";


import { getLabDashboardStats } from "../../../Service/LabService";
import { errorNotification } from "../../../util/NotificationUtil";

// --- COLORS ---
const COLORS = ['#FFBB28', '#00C49F', '#0088FE', '#FF8042'];

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon, color, bgColor, onClick }: any) => (
    <Paper 
        radius="md" 
        p="lg" 
        className={`border-none shadow-sm relative overflow-hidden ${bgColor} transition-transform hover:-translate-y-1 cursor-pointer`}
        onClick={onClick}
    >
        <Group justify="space-between" align="start" className="relative z-10">
            <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">{title}</Text>
                <Text size="2.5rem" fw={800} mt={4} className="text-slate-800">{value}</Text>
            </div>
            <div className={`p-3 rounded-full text-white shadow-md ${color}`}>
                {icon}
            </div>
        </Group>
        {/* Decorative Circle */}
        <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20 ${color}`}></div>
    </Paper>
);

const LabTechnicianDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getLabDashboardStats()
            .then((data) => setStats(data))
            .catch((err) => {
                console.error(err);
                errorNotification("Failed to load dashboard data");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-screen flex justify-center items-center"><LoadingOverlay visible={true}/></div>;

    // --- DATA PREPARATION ---
    
    // 1. Status Distribution (Pie Chart)
    const statusData = stats?.statusBreakdown?.map((s:any) => ({
        name: s.status.replace("_", " "),
        value: s.count
    })) || [];

    // 2. Category Distribution (Bar Chart)
    const categoryData = stats?.categoryBreakdown?.map((c:any) => ({
        name: c.category,
        count: c.count
    })) || [];

    // Calculate Completion Rate
    const totalActive = (stats?.pendingRequests || 0) + (stats?.sampleCollected || 0) + (stats?.completedToday || 0);
    const progress = totalActive > 0 ? ((stats?.completedToday || 0) / totalActive) * 100 : 0;

    return (
        <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
            
            <Group justify="space-between" align="end">
                <div>
                    <Title order={2}>Lab Overview</Title>
                    <Text c="dimmed">Manage test requests and results</Text>
                </div>
                <Button 
                    rightSection={<IconArrowRight size={16}/>} 
                    onClick={() => navigate("/technician/requests")}
                >
                    View Request List
                </Button>
            </Group>

            {/* --- 1. KPI CARDS --- */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                <StatCard 
                    title="Pending Requests" 
                    value={stats?.pendingRequests || 0} 
                    icon={<IconTestPipe size={32}/>} 
                    color="bg-orange-500" 
                    bgColor="bg-orange-50"
                    onClick={() => navigate("/technician/requests?tab=PENDING")}
                />
                <StatCard 
                    title="In Progress (Collected)" 
                    value={stats?.sampleCollected || 0} 
                    icon={<IconFlask size={32}/>} 
                    color="bg-blue-500" 
                    bgColor="bg-blue-50"
                    onClick={() => navigate("/technician/requests?tab=IN_PROGRESS")}
                />
                <StatCard 
                    title="Completed Today" 
                    value={stats?.completedToday || 0} 
                    icon={<IconCheckbox size={32}/>} 
                    color="bg-green-500" 
                    bgColor="bg-green-50"
                    onClick={() => navigate("/technician/requests?tab=COMPLETED")}
                />
            </SimpleGrid>

            {/* --- 2. CHARTS SECTION --- */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                
                {/* 2A. WORKLOAD DISTRIBUTION (Donut) */}
                <Paper shadow="sm" radius="md" p="lg" className="border-none h-96 flex flex-col">
                    <Title order={5} mb="lg">Workload Status</Title>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%" cy="50%"
                                    innerRadius={70} outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((_entry:any, index:number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <Text fw={800} size="2rem">{totalActive}</Text>
                            <Text size="xs" c="dimmed">Active Tests</Text>
                        </div>
                    </div>
                </Paper>

                {/* 2B. CATEGORY BREAKDOWN (Bar) */}
                <Paper shadow="sm" radius="md" p="lg" className="border-none h-96 flex flex-col">
                    <Title order={5} mb="lg">Test Categories</Title>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                                <XAxis type="number" hide/>
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fontWeight: 600}} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                />
                                <Bar dataKey="count" fill="#7C4DFF" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Paper>
            </SimpleGrid>

            {/* --- 3. BOTTOM SECTION --- */}
            <Paper shadow="sm" radius="md" p="lg" className="border-none bg-white">
                <Group justify="space-between">
                    <div className="flex items-center gap-4">
                        <RingProgress 
                            size={80} 
                            roundCaps 
                            thickness={8} 
                            sections={[{ value: progress, color: 'green' }]} 
                            label={
                                <Text c="green" fw={700} ta="center" size="xs">
                                    {Math.round(progress)}%
                                </Text>
                            } 
                        />
                        <div>
                            <Text fw={700} size="lg">Daily Goal</Text>
                            <Text size="sm" c="dimmed">You have completed {stats?.completedToday} tests today.</Text>
                        </div>
                    </div>
                    <Button variant="light" color="indigo" onClick={() => navigate("/technician/requests")}>
                        Go to Work Queue
                    </Button>
                </Group>
            </Paper>

        </div>
    );
};

export default LabTechnicianDashboard;