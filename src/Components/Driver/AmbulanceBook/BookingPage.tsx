import { useEffect, useState } from "react";
import { Card, Text, Badge, Button, Timeline, Group, Title, Grid, ThemeIcon, Loader, Center, Alert } from "@mantine/core";
import { IconMapPin, IconSteeringWheel, IconCheck, IconClock, IconNavigation, IconAlertCircle } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { getAllBookings, updateBookingStatus, BookingDTO } from "../../../Service/AmbulanceService";
import { successNotification, errorNotification } from "../../../util/NotificationUtil";
import { formatDateAppShort } from "../../../util/DateFormat";
import LiveTrackingSimulator from "../LiveTrack/LiveTrackingSimulator";

const BookingPage = () => {
    const user = useSelector((state: any) => state.user);
    
    // ✅ ROBUST ID CHECK: Try profileId, fallback to id
    const driverId = user?.profileId || user?.id;

    const [activeTrip, setActiveTrip] = useState<BookingDTO | null>(null);
    const [history, setHistory] = useState<BookingDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTrips = () => {
        setLoading(true);
        getAllBookings()
            .then((allBookings) => {
                // --- DEBUG LOGS ---
                console.group("🚑 Driver Booking Logic");
                console.log("Full User Object:", user); // Inspect what keys exist
                console.log("Resolved Driver ID:", driverId);
                     console.log("Resolved Main Driver ID:", user?.id);
                
                if (!driverId) {
                    console.error("❌ Driver ID is missing! Cannot filter bookings.");
                    setLoading(false);
                    return;
                }

                // Robust Filter: Check both driverId (Table ID) and driverUserId (User ID)
                const myBookings = allBookings.filter((b) => {
                    const matchesUserId = b.driverUserId && String(b.driverUserId) === String(user?.id);
                    const matchesTableId = String(b.driverId) === String(driverId);
                    return matchesUserId || matchesTableId;
                });

                console.log("Filtered Bookings for Driver:", myBookings);
                console.groupEnd();

                // 1. Find Active Trip
                const active = myBookings.find(b => 
                    b.status === "ACCEPTED" || b.status === "ON_THE_WAY"
                );

                // 2. Find History
                const past = myBookings.filter(b => 
                    b.status === "COMPLETED" || b.status === "CANCELLED"
                ).sort((a, b) => b.id - a.id);

                setActiveTrip(active || null);
                setHistory(past);
            })
            .catch((err) => {
                console.error(err);
                errorNotification("Failed to load bookings");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        // ✅ Use the resolved driverId
        if (driverId) {
            fetchTrips();
        } else {
            console.warn("⚠️ Waiting for user data...");
            // Don't set loading to false yet if user data might still be coming
        }
    }, [driverId]); // Dependency on driverId, not just user

    // --- ACTIONS ---

    const handleStartTrip = () => {
        if (!activeTrip) return;
        
        updateBookingStatus(activeTrip.id, "ON_THE_WAY")
            .then(() => {
                successNotification("Trip Started! GPS Tracking Active.");
                fetchTrips();
            })
            .catch(() => errorNotification("Failed to start trip"));
    };

    const handleCompleteTrip = () => {
        if (!activeTrip) return;
        if (window.confirm("Confirm arrival at destination? This will generate the patient bill.")) {
            updateBookingStatus(activeTrip.id, "COMPLETED")
                .then(() => {
                    successNotification("Trip Completed Successfully");
                    fetchTrips();
                })
                .catch(() => errorNotification("Failed to complete trip"));
        }
    };

    if (loading) return <Center h={300}><Loader size="lg" /></Center>;

    if (!driverId) {
        return (
            <Center h={300}>
                <Alert color="red" title="Authentication Error">
                    Could not identify driver account. Please relogin.
                </Alert>
            </Center>
        );
    }

    return (
        <div className="p-5">
            <Group justify="space-between" mb="lg">
                <Title order={2} className="text-slate-700">My Duty Console</Title>
                <Badge size="lg" variant="dot" color={activeTrip ? "green" : "gray"}>
                    Status: {activeTrip ? "BUSY" : "AVAILABLE"}
                </Badge>
            </Group>

            <Grid>
                {/* LEFT COL: ACTIVE TRIP */}
                <Grid.Col span={{ base: 12, md: 7 }}>
                    {activeTrip ? (
                        <Card padding="xl" radius="md" withBorder className="bg-slate-50 border-blue-200 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-bl-[100px] -z-0 opacity-50"></div>
                            
                            <div className="relative z-10">
                                <Group justify="space-between" mb="xl">
                                    <div>
                                        <Badge 
                                            size="xl" 
                                            color={activeTrip.status === "ACCEPTED" ? "orange" : "green"} 
                                            variant="filled" 
                                            mb={5}
                                        >
                                            {activeTrip.status.replace(/_/g, " ")}
                                        </Badge>
                                        <Text size="xs" c="dimmed">Trip ID: #{activeTrip.id}</Text>
                                        <Badge variant="outline" color={activeTrip.bookingType === "EMERGENCY" ? "red" : "blue"} size="sm" mt={4}>
                                            {activeTrip.bookingType}
                                        </Badge>
                                    </div>
                                    <ThemeIcon size={56} radius="xl" color="blue" variant="white">
                                        <IconSteeringWheel size={32} />
                                    </ThemeIcon>
                                </Group>

                                <Timeline active={activeTrip.status === "ON_THE_WAY" ? 1 : 0} bulletSize={24} lineWidth={2}>
                                    <Timeline.Item bullet={<IconMapPin size={12} />} title="Pickup Location">
                                        <Text size="md" fw={600} className="text-slate-800">{activeTrip.pickupLocation}</Text>
                                    </Timeline.Item>
                                    <Timeline.Item bullet={<IconNavigation size={12} />} title="Destination">
                                        <Text size="md" fw={600} className="text-slate-800">{activeTrip.destinationLocation}</Text>
                                        {activeTrip.totalDistanceKm && (
                                            <Text size="sm" mt={4} c="blue" fw={500}>Est. Distance: {activeTrip.totalDistanceKm} km</Text>
                                        )}
                                    </Timeline.Item>
                                </Timeline>

                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    {activeTrip.status === "ACCEPTED" && (
                                        <div>
                                            <Alert icon={<IconAlertCircle size={16}/>} title="New Task Assigned" color="orange" mb="md">
                                                Please proceed to the pickup location immediately.
                                            </Alert>
                                            <Button 
                                                fullWidth 
                                                size="lg" 
                                                color="blue" 
                                                onClick={handleStartTrip}
                                                leftSection={<IconNavigation />}
                                                className="animate-pulse"
                                            >
                                                ACCEPT & START TRIP
                                            </Button>
                                        </div>
                                    )}

                                    {activeTrip.status === "ON_THE_WAY" && (
                                        <div className="space-y-4">
                                            <Alert icon={<IconAlertCircle size={16}/>} title="Live Tracking Active" color="green" variant="light">
                                                GPS signal is being broadcasted to Admin & Patient.
                                            </Alert>
                                            {/* Pass driverId for simulator updates */}
                                             <LiveTrackingSimulator driverId={activeTrip.driverId || user.profileId} />
                                            <Button 
                                                fullWidth 
                                                size="lg" 
                                                color="green" 
                                                onClick={handleCompleteTrip}
                                                leftSection={<IconCheck />}
                                                className="mt-4"
                                            >
                                                ARRIVED AT DESTINATION
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card padding="xl" radius="md" withBorder className="flex flex-col items-center justify-center h-80 text-center bg-gray-50">
                            <ThemeIcon size={80} radius="xl" color="gray" variant="light" mb="md">
                                <IconClock size={40} />
                            </ThemeIcon>
                            <Text size="xl" fw={700} c="dimmed">Waiting for Assignment...</Text>
                            <Text size="md" c="dimmed" mt="sm">
                                Please stay online. Admin will assign rides based on availability.
                            </Text>
                        </Card>
                    )}
                </Grid.Col>

                {/* RIGHT COL: HISTORY */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Card padding="lg" radius="md" withBorder>
                        <Text fw={700} size="lg" mb="md">Trip History</Text>
                        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
                            {history.length > 0 ? (
                                history.map((trip) => (
                                    <div key={trip.id} className="p-4 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                                        <Group justify="space-between" mb={4}>
                                            <Text fw={700} size="sm">Trip #{trip.id}</Text>
                                            <Badge size="sm" color={trip.status === "COMPLETED" ? "green" : "red"} variant="light">
                                                {trip.status}
                                            </Badge>
                                        </Group>
                                        <Group align="center" gap="xs" mb={4}>
                                            <IconMapPin size={14} className="text-gray-400" />
                                            <Text size="xs" className="flex-1 font-medium">{trip.destinationLocation}</Text>
                                        </Group>
                                        <Group justify="space-between" mt="xs">
                                            <Text size="xs" c="dimmed">
                                                {trip.startTime ? formatDateAppShort(trip.startTime) : "N/A"}
                                            </Text>
                                            {trip.totalCharge !== undefined && (
                                                <Text size="sm" fw={700} c="dark">₹{trip.totalCharge}</Text>
                                            )}
                                        </Group>
                                    </div>
                                ))
                            ) : (
                                <Text size="sm" c="dimmed" ta="center" py="xl">No completed trips yet.</Text>
                            )}
                        </div>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
};

export default BookingPage;