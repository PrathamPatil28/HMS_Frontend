import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
    SimpleGrid, Text, Paper, Title, Group, Badge, 
    Avatar,  ScrollArea, Grid, Button, Stack, ThemeIcon 
} from "@mantine/core";

import { 
    IconAmbulance, IconCalendarEvent, IconReceipt2, IconFlask, 
    IconPill, IconClock, IconDroplet,
} from "@tabler/icons-react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from "recharts";
import { useNavigate } from "react-router-dom";

import { 
    getActiveAmbulanceBooking, getPatientDashboardData, 
    getPatientUnpaidDue, getRecentBloodRequests, getRecentLabRequests 
} from "../../../Service/PatientStatsService";
import { formatDateApp, formatDateAppShort } from "../../../util/DateFormat";

// --- COLORS & STYLES ---
const COLORS = ['#7C4DFF', '#00E676', '#FFB74D', '#FF5252']; // Purple, Green, Orange, Red
const WAVE_DATA = [
    { v: 20 }, { v: 40 }, { v: 30 }, { v: 50 }, { v: 40 }, { v: 60 }, { v: 50 },
    { v: 70 }, { v: 60 }, { v: 80 }, { v: 70 }, { v: 90 }, { v: 80 }, { v: 100 }
];

// --- COMPONENT: WAVY STAT CARD ---
const StatCard = ({ title, value, subtext, icon, color, waveColor, bgColor, onClick }: any) => (
    <Paper 
        radius="md" 
        onClick={onClick}
        className={`overflow-hidden shadow-sm hover:shadow-md transition-all h-36 relative border-none ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className={`absolute inset-0 ${bgColor} opacity-20`}></div>
        
        <div className="p-4 h-full flex flex-col justify-between relative z-10">
            <Group justify="space-between" align="start">
                <div>
                    <Text c="dimmed" size="xs" fw={700} tt="uppercase">{title}</Text>
                    <Text fw={800} size="1.5rem" className="text-slate-800 leading-tight mt-1">
                        {value}
                    </Text>
                    {subtext && <Text size="xs" c={color.replace("bg-","text-")} fw={600} mt={1}>{subtext}</Text>}
                </div>
                <div className={`p-2 rounded-lg text-white shadow-md ${color}`}>
                    {icon}
                </div>
            </Group>
            
            {/* Decorative Wave Chart */}
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-40">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={WAVE_DATA}>
                        <Area type="monotone" dataKey="v" stroke={waveColor} fill={waveColor} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </Paper>
);

const PatientDashboard = () => {
    const user = useSelector((state: any) => state.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState<any>({
        apptData: {},
        billDue: 0,
        labRequests: [],
        bloodRequests: [],
        ambulance: null
    });

    useEffect(() => {
        if (!user?.profileId) return;

        const fetchData = async () => {
            try {
                const [appt, bill, lab, blood, amb] = await Promise.all([
                    getPatientDashboardData(user.profileId),
                    getPatientUnpaidDue(user.profileId),
                    getRecentLabRequests(user.profileId),
                    getRecentBloodRequests(user.profileId),
                    getActiveAmbulanceBooking(user.profileId)
                ]);

                setData({
                    apptData: appt,
                    billDue: bill,
                    labRequests: lab,
                    bloodRequests: blood,
                    ambulance: amb
                });
            } catch (error) {
                console.error("Dashboard Load Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.profileId]);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

    const { nextAppointment, latestPrescription, recentHistory } = data.apptData;

    // --- CHART DATA PREPARATION ---
    // 1. Visit History Trend (Mocking trend based on history dates for visual)
    const visitData = recentHistory?.slice().reverse().map((h:any) => ({
        date: formatDateAppShort(h.appointmentTime),
        Visits: 1 // Just marking occurrence
    })) || [];

    // 2. Lab Status Distribution
    const labStatusData = [
        { name: 'Completed', value: data.labRequests.filter((l:any) => l.status === 'COMPLETED').length },
        { name: 'Pending', value: data.labRequests.filter((l:any) => l.status === 'PENDING').length },
    ].filter(d => d.value > 0);

    return (
        <div className="p-6 space-y-6 bg-[#F3F4F6] min-h-screen font-sans text-slate-800">
            
            <div className="flex justify-between items-end">
                <div>
                    <Title order={3} className="text-slate-800">Hello, {user.name} 👋</Title>
                    <Text size="sm" c="dimmed">Here is your health summary</Text>
                </div>
                <Button color="blue" radius="md" onClick={() => navigate("/patient/appointment")}>
                    Book New Appointment
                </Button>
            </div>

            {/* --- 1. TOP KPI CARDS --- */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                
                {/* AMBULANCE STATUS */}
                <StatCard 
                    title="Ambulance" 
                    value={data.ambulance ? "On The Way" : "No Active Trips"}
                    subtext={data.ambulance ? `To: ${data.ambulance.destinationLocation}` : "Tap for Emergency"}
                    icon={<IconAmbulance size={24} />} 
                    color={data.ambulance ? "bg-red-500" : "bg-gray-400"}
                    waveColor={data.ambulance ? "#FF5252" : "#9E9E9E"}
                    bgColor={data.ambulance ? "bg-red-100" : "bg-gray-100"}
                    onClick={() => navigate("/patient/ambulance")}
                />

                {/* NEXT APPOINTMENT */}
                <StatCard 
                    title="Next Appointment" 
                    value={nextAppointment ? formatDateApp(nextAppointment.appointmentTime) : "None Scheduled"} 
                    subtext={nextAppointment ? `Dr. ${nextAppointment.doctorName}` : "Book now"}
                    icon={<IconCalendarEvent size={24} />} 
                    color="bg-violet-500" 
                    waveColor="#7C4DFF"
                    bgColor="bg-violet-100"
                />

                {/* PAYMENT DUE */}
                <StatCard 
                    title="Payment Due" 
                    value={`₹${data.billDue}`} 
                    subtext={data.billDue > 0 ? "Action Required" : "All Paid"}
                    icon={<IconReceipt2 size={24} />} 
                    color={data.billDue > 0 ? "bg-orange-400" : "bg-emerald-500"}
                    waveColor={data.billDue > 0 ? "#FFB74D" : "#00E676"}
                    bgColor={data.billDue > 0 ? "bg-orange-100" : "bg-emerald-100"}
                    onClick={() => data.billDue > 0 && navigate("/patient/billing")}
                />

                {/* LAB REPORTS */}
                <StatCard 
                    title="Recent Lab Reports" 
                    value={data.labRequests.length} 
                    subtext="Last 30 Days"
                    icon={<IconFlask size={24} />} 
                    color="bg-blue-500" 
                    waveColor="#2979FF"
                    bgColor="bg-blue-100"
                    onClick={() => navigate("/patient/lab-reports")}
                />
            </SimpleGrid>

            {/* --- 2. MIDDLE SECTION (Charts & Activity) --- */}
            <Grid gutter="lg">
                
                {/* 2A. VISIT HISTORY GRAPH */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper shadow="sm" radius="md" p="lg" className="border-none h-full">
                        <Group justify="space-between" mb="lg">
                            <Title order={5}>Visit History</Title>
                            <Badge variant="light" color="violet">Timeline</Badge>
                        </Group>
                        <div className="h-72">
                            {visitData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={visitData}>
                                        <defs>
                                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <CartesianGrid vertical={false} stroke="#E0E0E0" strokeDasharray="3 3"/>
                                        <Tooltip 
                                            contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}
                                        />
                                        <Area type="step" dataKey="Visits" stroke="#7C4DFF" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    No visit history available to chart.
                                </div>
                            )}
                        </div>
                    </Paper>
                </Grid.Col>

                {/* 2B. LAB RESULTS DISTRIBUTION */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" radius="md" p="lg" className="h-full border-none">
                        <Title order={5} mb="lg">Lab Reports Status</Title>
                        <div className="h-56 relative">
                            {labStatusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={labStatusData}
                                            cx="50%" cy="50%"
                                            innerRadius={60} outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {labStatusData.map((_entry:any, index:number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <IconFlask size={40} className="mb-2 opacity-50"/>
                                    <Text size="sm">No recent lab data</Text>
                                </div>
                            )}
                        </div>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* --- 3. BOTTOM SECTION (Detailed Lists) --- */}
            <Grid gutter="lg">
                
                {/* 3A. LATEST PRESCRIPTION */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper shadow="sm" radius="md" p="lg" className="border-none h-full">
                        <Group justify="space-between" mb="md">
                            <Title order={5} className="flex items-center gap-2">
                                <IconPill className="text-indigo-600"/> Latest Prescription
                            </Title>
                            <Button variant="subtle" size="xs" onClick={() => navigate("/patient/prescription")}>View All</Button>
                        </Group>

                        {latestPrescription ? (
                            <Stack gap="md">
                                <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl">
                                    <Avatar color="indigo" radius="xl" size="md">
                                        {latestPrescription.doctorName?.charAt(0)}
                                    </Avatar>
                                    <div className="flex-1">
                                        <Text fw={600} size="sm">Dr. {latestPrescription.doctorName}</Text>
                                        <Text size="xs" c="dimmed">{formatDateAppShort(latestPrescription.prescriptionDate)}</Text>
                                    </div>
                                    <Badge color="indigo">{latestPrescription.medicines?.length || 0} Meds</Badge>
                                </div>
                                
                                {latestPrescription.medicines && latestPrescription.medicines.slice(0,3).map((med:any, i:number) => (
                                    <Group key={i} justify="space-between" className="px-2">
                                        <Text size="sm" fw={500}>{med.name}</Text>
                                        <Text size="xs" c="dimmed">{med.dosage} • {med.duration} Days</Text>
                                    </Group>
                                ))}
                            </Stack>
                        ) : (
                            <Text c="dimmed" size="sm" ta="center" py="xl">No prescriptions found.</Text>
                        )}
                    </Paper>
                </Grid.Col>

                {/* 3B. PAST APPOINTMENTS & BLOOD REQUESTS */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper shadow="sm" radius="md" p="lg" className="border-none h-full">
                        <Title order={5} mb="md" className="flex items-center gap-2">
                            <IconClock className="text-gray-600"/> Recent Activity
                        </Title>
                        
                        <ScrollArea h={250}>
                            <Stack gap="sm">
                                {recentHistory?.map((hist:any) => (
                                    <div key={hist.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
                                        <Group>
                                            <ThemeIcon variant="light" color="gray" radius="xl"><IconCalendarEvent size={16}/></ThemeIcon>
                                            <div>
                                                <Text size="sm" fw={600}>Dr. {hist.doctorName}</Text>
                                                <Text size="xs" c="dimmed">{hist.reason}</Text>
                                            </div>
                                        </Group>
                                        <Text size="xs" fw={600} c="dimmed">{formatDateAppShort(hist.appointmentTime)}</Text>
                                    </div>
                                ))}

                                {data.bloodRequests?.map((req:any) => (
                                    <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
                                        <Group>
                                            <ThemeIcon variant="light" color="red" radius="xl"><IconDroplet size={16}/></ThemeIcon>
                                            <div>
                                                <Text size="sm" fw={600}>Blood Request: {req.requestedGroup}</Text>
                                                <Text size="xs" c="dimmed">{req.unitsRequired} Units</Text>
                                            </div>
                                        </Group>
                                        <Badge color={req.status === 'APPROVED' ? 'green' : 'orange'} size="sm">{req.status}</Badge>
                                    </div>
                                ))}

                                {(!recentHistory?.length && !data.bloodRequests?.length) && (
                                    <Text c="dimmed" size="sm" ta="center" mt="xl">No recent history.</Text>
                                )}
                            </Stack>
                        </ScrollArea>
                    </Paper>
                </Grid.Col>
            </Grid>
        </div>
    );
};

export default PatientDashboard;