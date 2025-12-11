import { useEffect, useState } from "react";
import { Card, Text, Badge, Group, Loader, Center } from "@mantine/core";
import { getDriver } from "../../../Service/DriverService"; // Assuming this fetches DriverDTO
import { DriverDTO } from "../../../Service/AmbulanceService";
import TrackingMap from "../../Maps/TrackingMap";
import { IconSteeringWheel } from "@tabler/icons-react";

interface Props {
    driverId: number;
    ambulanceId: number; // Optional: for display
}

const PatientLiveTracking = ({ driverId }: Props) => {
    const [driver, setDriver] = useState<DriverDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLocation = () => {
        getDriver(driverId)
            .then((data) => {
                setDriver(data);
                setLoading(false);
            })
            .catch((err) => console.error("Error fetching driver location", err));
    };

    useEffect(() => {
        fetchLocation(); // Initial fetch
        const interval = setInterval(fetchLocation, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [driverId]);

    if (loading) return <Center p="xl"><Loader size="sm" /></Center>;

    return (
        <Card padding="lg" radius="md" withBorder className="bg-blue-50/50 border-blue-100">
            <Group justify="space-between" mb="md">
                <div className="flex items-center gap-2">
                    <IconSteeringWheel className="text-blue-600" size={20}/>
                    <Text fw={700} c="blue">Live Tracking</Text>
                </div>
                {driver?.lastLocationUpdate ? (
                    <Badge color="green" variant="dot">Online</Badge>
                ) : (
                    <Badge color="orange" variant="dot">Connecting...</Badge>
                )}
            </Group>

            {driver && driver.currentLat && driver.currentLng ? (
                <TrackingMap 
                    lat={driver.currentLat} 
                    lng={driver.currentLng} 
                    popupText={`Driver: ${driver.name}`} 
                />
            ) : (
                <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-sm">
                    Driver has not shared location yet.
                </div>
            )}
            
            <Text size="xs" c="dimmed" mt="sm" ta="center">
                Map updates automatically every 5 seconds.
            </Text>
        </Card>
    );
};

export default PatientLiveTracking;