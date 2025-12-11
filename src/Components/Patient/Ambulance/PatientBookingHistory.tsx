import { useState, useEffect } from "react";
import { Table, Badge, Card, Text, Center, Loader,  Button } from "@mantine/core";
import { useSelector } from "react-redux";
import { getBookingsByPatient } from "../../../Service/AmbulanceService";
import { formatDateAppShort } from "../../../util/DateFormat";
import { IconMapPin } from "@tabler/icons-react";
import PatientLiveTracking from "./PatientLiveTracking"; // Import the new component

const PatientBookingHistory = () => {
    const user = useSelector((state: any) => state.user);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // State to toggle tracking view
    const [trackingId, setTrackingId] = useState<number | null>(null);

    useEffect(() => {
        if (user?.profileId) {
            setLoading(true);
            getBookingsByPatient(user.profileId)
                .then(setBookings)
                .catch(() => setBookings([]))
                .finally(() => setLoading(false));
        }
    }, [user?.profileId]);

    const rows = bookings.map((b) => (
        <>
            <Table.Tr key={b.id}>
                <Table.Td>{b.id}</Table.Td>
                <Table.Td>{formatDateAppShort(b.createdAt)}</Table.Td>
                <Table.Td>
                    <Text size="xs" fw={500}>From: {b.pickupLocation}</Text>
                    <Text size="xs" c="dimmed">To: {b.destinationLocation}</Text>
                </Table.Td>
                <Table.Td>
                    <Badge
                        color={
                            b.status === "REQUESTED" ? "orange" :
                            b.status === "ACCEPTED" ? "blue" :
                            b.status === "ON_THE_WAY" ? "indigo" : // Use indigo for active trip
                            b.status === "COMPLETED" ? "green" : "red"
                        }
                    >
                        {b.status.replace(/_/g, " ")}
                    </Badge>
                </Table.Td>
                <Table.Td>{b.ambulanceId ? `Vehicle #${b.ambulanceId}` : "Pending"}</Table.Td>
                <Table.Td>
                    {b.status === "ON_THE_WAY" && b.driverId ? (
                        <Button 
                            size="xs" 
                            variant="light" 
                            color="indigo" 
                            onClick={() => setTrackingId(trackingId === b.id ? null : b.id)}
                            leftSection={<IconMapPin size={14}/>}
                        >
                            {trackingId === b.id ? "Hide Map" : "Track Live"}
                        </Button>
                    ) : (
                        b.totalCharge ? `₹${b.totalCharge}` : "-"
                    )}
                </Table.Td>
            </Table.Tr>
            
            {/* Expandable Map Row */}
            {trackingId === b.id && (
                <Table.Tr>
                    <Table.Td colSpan={6} className="p-0 bg-gray-50">
                        <div className="p-4">
                            <PatientLiveTracking driverId={b.driverId} ambulanceId={b.ambulanceId} />
                        </div>
                    </Table.Td>
                </Table.Tr>
            )}
        </>
    ));

    return (
        <Card padding="lg" radius="md" withBorder>
            {loading ? (
                <Center h={100}><Loader /></Center>
            ) : bookings.length > 0 ? (
                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Route</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Vehicle</Table.Th>
                            <Table.Th>Action / Bill</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            ) : (
                <Text c="dimmed" ta="center" py="xl">
                    You haven't booked any ambulances yet.
                </Text>
            )}
        </Card>
    );
};

export default PatientBookingHistory;