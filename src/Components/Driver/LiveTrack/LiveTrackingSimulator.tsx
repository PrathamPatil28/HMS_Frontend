import { useState, useEffect } from "react";
import { Button, Card, Text, Badge, Group, TextInput, ActionIcon, Loader } from "@mantine/core";
import { updateDriverLocation, geocodeAddress } from "../../../Service/AmbulanceService";
import { IconLocation, IconPlayerPause, IconPlayerPlay, IconCurrentLocation, IconSearch } from "@tabler/icons-react";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

interface LiveTrackingProps {
    driverId: number;
}

const LiveTrackingSimulator = ({ driverId }: LiveTrackingProps) => {
    const [isTracking, setIsTracking] = useState(false);
    const [loadingLoc, setLoadingLoc] = useState(false);
    
    // Default start location (can remain Mumbai or be empty)
    const [location, setLocation] = useState({ lat: 19.0760, lng: 72.8777 });
    const [addressInput, setAddressInput] = useState("");

    // 1. Get Browser GPS
    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            errorNotification("Geolocation not supported");
            return;
        }
        setLoadingLoc(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                setAddressInput("Current GPS Location");
                successNotification("Location set to current GPS");
                setLoadingLoc(false);
            },
            (err) => {
                console.error(err);
                errorNotification("Failed to get location");
                setLoadingLoc(false);
            }
        );
    };

    // 2. Search Address (Geocoding)
    const handleSearchLocation = async () => {
        if (!addressInput || addressInput.length < 3) return;
        
        setLoadingLoc(true);
        try {
            // Call the backend proxy we created earlier
            const data = await geocodeAddress(addressInput);
            if (data && data.lat && data.lng) {
                setLocation({ lat: data.lat, lng: data.lng });
                successNotification(`Location set to: ${addressInput}`);
            } else {
                errorNotification("Location not found");
            }
        } catch (error) {
            console.error(error);
            errorNotification("Geocoding failed");
        } finally {
            setLoadingLoc(false);
        }
    };

    // 3. Simulation Loop
    useEffect(() => {
        let interval: any;

        if (isTracking && driverId) {
            console.log(`🚀 Simulator Started for Driver ID: ${driverId}`);
            
            interval = setInterval(() => {
                // Simulate movement: Move slightly (Random walk)
                // 0.001 deg is approx 100 meters
                const newLat = location.lat + (Math.random() - 0.5) * 0.001;
                const newLng = location.lng + (Math.random() - 0.5) * 0.001;
                
                // Update local state to keep moving from the new point
                setLocation({ lat: newLat, lng: newLng });
                
                // Send to Backend
                updateDriverLocation(driverId, newLat, newLng)
                    .then(() => console.log(`📍 GPS Update: ${newLat.toFixed(5)}, ${newLng.toFixed(5)}`))
                    .catch(err => console.error("Loc Update Failed", err));

            }, 5000); 
        }

        return () => clearInterval(interval);
    }, [isTracking, driverId]); // Removed 'location' from dependency to avoid loop reset issues, utilizing functional state update pattern if needed, but here simple state works because we update 'location' inside

    return (
        <Card withBorder radius="md" p="lg" className="bg-gray-50">
            <Group justify="space-between" mb="md">
                <div className="flex items-center gap-2">
                    <IconLocation className="text-blue-600" />
                    <Text fw={700} size="sm">GPS Simulator</Text>
                </div>
                {isTracking ? (
                    <Badge color="green" variant="filled" className="animate-pulse">LIVE</Badge>
                ) : (
                    <Badge color="gray">IDLE</Badge>
                )}
            </Group>

            {/* Location Input Section */}
            <div className="mb-4">
                <Text size="xs" fw={500} mb={4}>Set Starting Point</Text>
                <TextInput 
                    placeholder="Enter City/Area or use GPS"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    disabled={isTracking} // Lock input while driving
                    rightSection={
                        loadingLoc ? <Loader size="xs"/> : (
                            <Group gap={4}>
                                {/* Button: Use My Location */}
                                <ActionIcon variant="light" color="blue" size="sm" onClick={handleCurrentLocation} title="Use My Location">
                                    <IconCurrentLocation size={14}/>
                                </ActionIcon>
                                {/* Button: Search Address */}
                                <ActionIcon variant="filled" color="teal" size="sm" onClick={handleSearchLocation} title="Search Address">
                                    <IconSearch size={14}/>
                                </ActionIcon>
                            </Group>
                        )
                    }
                    rightSectionWidth={70}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleSearchLocation() }}
                />
            </div>
            
            <Text size="xs" c="dimmed" mb="xs" ta="center">
                Simulated Coords: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </Text>

            <Button 
                fullWidth 
                size="xs"
                color={isTracking ? "red" : "green"} 
                onClick={() => setIsTracking(!isTracking)}
                leftSection={isTracking ? <IconPlayerPause size={16}/> : <IconPlayerPlay size={16}/>}
            >
                {isTracking ? "Stop Simulation" : "Start Driving Here"}
            </Button>
        </Card>
    );
};

export default LiveTrackingSimulator;