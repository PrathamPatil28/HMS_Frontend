import { useState } from "react";
import { Button, Select, Textarea, Card, Title, Group, Text, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { IconCurrentLocation, IconMapPin } from "@tabler/icons-react";
import { createBooking, BookingRequestDTO, geocodeAddress } from "../../../Service/AmbulanceService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const RequestAmbulancePatient = () => {
    const user = useSelector((state: any) => state.user);
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);

    // Store coordinates for BOTH pickup and drop
    const [coords, setCoords] = useState<{
        pickupLat?: number;
        pickupLng?: number;
        dropLat?: number;
        dropLng?: number;
    }>({});

    const form = useForm({
        initialValues: {
            pickupLocation: "",
            dropLocation: "",
            bookingType: "EMERGENCY"
        },
        validate: {
            pickupLocation: (value) => (value.length > 3 ? null : "Pickup location is required"),
            dropLocation: (value) => (value.length > 3 ? null : "Drop location is required"),
        },
    });

    const handleManualGeocode = async (address: string, type: 'pickup' | 'drop') => {
        if (!address || address.length < 3) return;

        try {
         
            const data = await geocodeAddress(address);

            if (data) {
                const lat = data.lat;
                const lng = data.lng;

                console.log(`📍 ${type.toUpperCase()} Location Found:`, address);
                console.log(`   Lat: ${lat}, Lng: ${lng}`);

                setCoords((prev) => ({
                    ...prev,
                    [type === 'pickup' ? 'pickupLat' : 'dropLat']: lat,
                    [type === 'pickup' ? 'pickupLng' : 'dropLng']: lng
                }));
            } else {
                console.warn(`Could not find coordinates for ${type}: ${address}`);
            }
        } catch (error) {
            console.error(`Geocoding error for ${type}:`, error);
        }
    };


    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            errorNotification("Geolocation is not supported by your browser.");
            return;
        }

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                console.log("📍 GPS Current Location:");
                console.log(`   Lat: ${lat}, Lng: ${lng}`);

                setCoords((prev) => ({ ...prev, pickupLat: lat, pickupLng: lng }));

                try {
                    
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await response.json();
                    
                    form.setFieldValue("pickupLocation", data.display_name || `${lat}, ${lng}`);
                    successNotification("Location Detected Successfully");
                } catch (error) {
                    console.error(error);
                   
                    form.setFieldValue("pickupLocation", `${lat}, ${lng}`);
                } finally {
                    setLocating(false);
                }
            },
            (error) => {
                console.error(error);
                errorNotification("Unable to retrieve location.");
                setLocating(false);
            }
        );
    };

    const handleSubmit = (values: typeof form.values) => {
        if (!user?.profileId) {
            errorNotification("User profile not found. Please log in again.");
            return;
        }

        console.log("🚀 Submitting Booking with Coords:", coords);

        setLoading(true);

        const payload: BookingRequestDTO = {
            patientId: user.profileId,
            requestedBy: "PATIENT",
            bookingType: values.bookingType === "EMERGENCY" ? "EMERGENCY" : "NORMAL",
            pickupLocation: values.pickupLocation,
            destinationLocation: values.dropLocation,
            
            // Send captured coordinates
            pickupLat: coords.pickupLat,
            pickupLng: coords.pickupLng,
            dropLat: coords.dropLat,
            dropLng: coords.dropLng
        };

        createBooking(payload)
            .then(() => {
                successNotification("Ambulance Requested Successfully");
                form.reset();
                setCoords({});
            })
            .catch((err) => {
                console.error(err);
                errorNotification(err.response?.data?.message || "Request Failed");
            })
            .finally(() => setLoading(false));
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="max-w-2xl mx-auto mt-5">
            <Title order={3} mb="xs" className="text-neutral-700">Book an Ambulance</Title>
            <Text c="dimmed" size="sm" mb="lg">
                Requesting for: <span className="font-semibold text-primary-500">{user.name}</span>
            </Text>
            
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select
                    label="Booking Type"
                    data={[
                        { value: "EMERGENCY", label: "Emergency (ICU)" },
                        { value: "NON_EMERGENCY", label: "Normal Transport" }
                    ]}
                    {...form.getInputProps("bookingType")}
                    mb="md"
                />

                <div className="mb-4">
                    <Textarea
                        label={
                            <Group justify="space-between" mb={5}>
                                <span>Pickup Location</span>
                                <Button 
                                    size="xs" 
                                    variant="light" 
                                    color="blue" 
                                    onClick={handleGetLocation}
                                    loading={locating}
                                    leftSection={<IconCurrentLocation size={14}/>}
                                >
                                    Use Current Location
                                </Button>
                            </Group>
                        }
                        placeholder="Your current location / Home address"
                        {...form.getInputProps("pickupLocation")}
                        onBlur={(e) => handleManualGeocode(e.target.value, 'pickup')}
                        rows={3}
                        rightSection={
                            locating ? <Loader size="xs" /> : <IconMapPin size={18} className="text-gray-400"/>
                        }
                    />
                    {/* Coordinates hidden from UI, shown in console */}
                    {coords.pickupLat && (
                        <Text size="xs" c="green" mt={4}>
                            ✓ Location coordinates captured
                        </Text>
                    )}
                </div>

                <div className="mb-4">
                    <Textarea
                        label="Destination"
                        placeholder="Hospital Name / Address (e.g. City Hospital, Mumbai)"
                        {...form.getInputProps("dropLocation")}
                        onBlur={(e) => handleManualGeocode(e.target.value, 'drop')}
                        rows={3}
                    />
                    {coords.dropLat && (
                        <Text size="xs" c="green" mt={4}>
                            ✓ Destination coordinates captured
                        </Text>
                    )}
                </div>

                <Button type="submit" fullWidth loading={loading} color="red" size="md">
                    Confirm Booking Request
                </Button>
            </form>
        </Card>
    );
};

export default RequestAmbulancePatient;