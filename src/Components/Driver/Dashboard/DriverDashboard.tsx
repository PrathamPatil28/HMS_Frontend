import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
    Paper, Text, Title, Group, Button, Switch, Badge, 
    Stack, ThemeIcon, Card, Loader, Modal 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { 
    IconAmbulance, IconMapPin, IconPhone, IconNavigation, 
   
} from "@tabler/icons-react";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { getDriverDashboard, toggleDriverStatus, updateTripStatus } from "../../../Service/DriverService";
import RouteMap from "../../Maps/RouteMap";


const DriverDashboard = () => {
    const user = useSelector((state: any) => state.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<any>(null);
    const [statusLoading, setStatusLoading] = useState(false);

    // Modal for Confirmation
    const [opened, { open, close }] = useDisclosure(false);

    const fetchDashboard = () => {
        setLoading(true);
        getDriverDashboard(user.id) // Pass User ID (linked to Driver Profile)
            .then(data => setDashboard(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (user?.id) fetchDashboard();
        
        // Poll for new trips every 10 seconds if Online & Idle
        const interval = setInterval(() => {
            if (dashboard?.driverStatus === 'AVAILABLE' && !dashboard?.activeTrip) {
                // Silent refresh
                getDriverDashboard(user.id).then(data => setDashboard(data));
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [user, dashboard?.driverStatus]);

    // Actions
    const handleToggleStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isOnline = e.target.checked;
        setStatusLoading(true);
        toggleDriverStatus(user.id, isOnline)
            .then(() => {
                successNotification(isOnline ? "You are now ONLINE" : "You are now OFF DUTY");
                fetchDashboard();
            })
            .catch((err) => errorNotification(err.response?.data?.message || "Failed to change status"))
            .finally(() => setStatusLoading(false));
    };

    const handleUpdateTrip = (status: string) => {
        if(!dashboard?.activeTrip) return;
        setLoading(true);
        updateTripStatus(dashboard.activeTrip.id, status)
            .then(() => {
                successNotification(`Trip Updated: ${status}`);
                fetchDashboard(); // Refresh state
            })
            .catch(() => errorNotification("Action Failed"))
            .finally(() => setLoading(false));
    };

    // Open External Maps (Google Maps)
    const openNavigation = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    if (loading && !dashboard) return <div className="h-screen flex justify-center items-center"><Loader size="xl"/></div>;

    const activeTrip = dashboard?.activeTrip;
    const isOnline = dashboard?.driverStatus !== 'OFF_DUTY';
    const isOnTrip = dashboard?.driverStatus === 'ON_TRIP';

    return (
        <div className="p-4 bg-gray-100 min-h-screen pb-20">
            
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title order={3}>Driver Console</Title>
                    <Text size="sm" c="dimmed">{user.name}</Text>
                </div>
                <div className="flex flex-col items-end">
                    <Switch 
                        size="lg" 
                        onLabel="ON" 
                        offLabel="OFF" 
                        checked={isOnline}
                        onChange={handleToggleStatus}
                        disabled={isOnTrip || statusLoading}
                        color="green"
                    />
                    <Text size="xs" fw={700} c={isOnline ? "green" : "dimmed"} mt={4}>
                        {isOnline ? (isOnTrip ? "ON TRIP" : "AVAILABLE") : "OFF DUTY"}
                    </Text>
                </div>
            </div>

            {/* --- KPI STATS --- */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Paper p="md" radius="md" className="bg-white text-center">
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">Trips Today</Text>
                    <Text size="xl" fw={800} c="blue">{dashboard?.todayTrips || 0}</Text>
                </Paper>
                <Paper p="md" radius="md" className="bg-white text-center">
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">Earnings</Text>
                    <Text size="xl" fw={800} c="green">₹0</Text> {/* Backend logic pending for driver earnings */}
                </Paper>
            </div>

            {/* --- MAIN ACTION AREA --- */}
            
            {/* 1. OFFLINE STATE */}
            {!isOnline && (
                <Card padding="xl" radius="md" className="text-center bg-gray-200 text-gray-500 h-64 flex flex-col justify-center items-center">
                    <IconAmbulance size={48} className="mb-4 opacity-50"/>
                    <Title order={4}>You are Off Duty</Title>
                    <Text size="sm">Go online to start receiving ride requests.</Text>
                </Card>
            )}

            {/* 2. ONLINE BUT IDLE */}
            {isOnline && !activeTrip && (
                <div className="h-64 flex flex-col justify-center items-center bg-white rounded-xl shadow-sm animate-pulse">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping"></div>
                        <ThemeIcon size={60} radius="xl" color="green" variant="light">
                            <IconAmbulance size={32}/>
                        </ThemeIcon>
                    </div>
                    <Text fw={700} mt="lg" size="lg" c="dark">Scanning for Emergency...</Text>
                    <Text size="sm" c="dimmed">Stay alert.</Text>
                </div>
            )}

            {/* 3. TRIP ASSIGNED (NEW REQUEST) */}
            {activeTrip && activeTrip.status === 'REQUESTED' && ( // Should technically be ACCEPTED if driver sees it
                 // Logic note: Usually 'REQUESTED' is for Admin to see. 
                 // If using auto-assign, Driver sees it as 'ACCEPTED' immediately. 
                 // If using "Broadcast", Driver sees 'REQUESTED'. 
                 // Based on your backend, Admin *assigns* it, so it becomes 'ACCEPTED'.
                 null 
            )}

            {/* 4. ACTIVE TRIP (ACCEPTED / ON_THE_WAY) */}
            {activeTrip && (
                <Card padding={0} radius="lg" className="overflow-hidden shadow-lg border border-blue-100">
                    
                    {/* MAP SECTION */}
                    <div className="h-64 w-full relative">
                        <RouteMap 
                            pickupLat={activeTrip.pickupLat} 
                            pickupLng={activeTrip.pickupLng} 
                            dropLat={activeTrip.dropLat} 
                            dropLng={activeTrip.dropLng} 
                        />
                        <Badge 
                            size="lg" 
                            color={activeTrip.bookingType === 'EMERGENCY' ? 'red' : 'blue'} 
                            className="absolute top-4 right-4 z-[400] shadow-md"
                        >
                            {activeTrip.bookingType}
                        </Badge>
                    </div>

                    {/* DETAILS SECTION */}
                    <div className="p-5 bg-white">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Patient</Text>
                                <Text size="lg" fw={700}>Patient ID: {activeTrip.patientId}</Text>
                            </div>
                            <Button 
                                variant="light" 
                                color="green" 
                                size="xs" 
                                leftSection={<IconPhone size={14}/>}
                                component="a"
                                href="tel:102" // Replace with patient phone if available
                            >
                                Call
                            </Button>
                        </Group>

                        <Stack gap="sm" mb="xl">
                            <div className="flex gap-3">
                                <IconMapPin className="text-green-500 mt-1" size={20}/>
                                <div>
                                    <Text size="xs" c="dimmed">Pickup Location</Text>
                                    <Text size="sm" fw={500} lineClamp={2}>{activeTrip.pickupLocation}</Text>
                                    <Button 
                                        variant="outline" 
                                        size="compact-xs" 
                                        color="blue" 
                                        mt={4}
                                        leftSection={<IconNavigation size={12}/>}
                                        onClick={() => openNavigation(activeTrip.pickupLat, activeTrip.pickupLng)}
                                    >
                                        Navigate
                                    </Button>
                                </div>
                            </div>

                            <div className="w-0.5 h-6 bg-gray-200 ml-2.5"></div>

                            <div className="flex gap-3">
                                <IconMapPin className="text-red-500 mt-1" size={20}/>
                                <div>
                                    <Text size="xs" c="dimmed">Destination</Text>
                                    <Text size="sm" fw={500} lineClamp={2}>{activeTrip.destinationLocation}</Text>
                                </div>
                            </div>
                        </Stack>

                        {/* SLIDER / BUTTON ACTION */}
                        {activeTrip.status === 'ACCEPTED' && (
                            <Button 
                                fullWidth 
                                size="xl" 
                                color="blue" 
                                radius="md"
                                onClick={() => handleUpdateTrip('ON_THE_WAY')}
                            >
                                Start Trip 🚀
                            </Button>
                        )}

                        {activeTrip.status === 'ON_THE_WAY' && (
                            <Button 
                                fullWidth 
                                size="xl" 
                                color="green" 
                                radius="md"
                                onClick={open} // Confirm Completion
                            >
                                Complete Trip ✅
                            </Button>
                        )}
                    </div>
                </Card>
            )}

            {/* CONFIRM COMPLETION MODAL */}
            <Modal opened={opened} onClose={close} title="Confirm Completion" centered>
                <Text size="sm" mb="lg">
                    Are you sure you have dropped the patient at the destination?
                    This will free you up for new rides.
                </Text>
                <Group justify="end">
                    <Button variant="default" onClick={close}>Cancel</Button>
                    <Button color="green" onClick={() => { close(); handleUpdateTrip('COMPLETED'); }}>
                        Yes, Complete
                    </Button>
                </Group>
            </Modal>

        </div>
    );
};

export default DriverDashboard;