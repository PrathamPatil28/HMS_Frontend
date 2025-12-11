import { useState, useEffect } from "react";
import { Table, Select, Badge, Card, Text, Center, Loader } from "@mantine/core";
import { useSelector } from "react-redux";
import { getBookingsByPatient } from "../../../Service/AmbulanceService";
import { getPatientsByDoctor } from "../../../Service/AppointmentService";
import { formatDateAppShort } from "../../../util/DateFormat";

const MyBookings = () => {
    const user = useSelector((state: any) => state.user);
    const [patients, setPatients] = useState<{ value: string; label: string }[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Load Doctor's Patients
    useEffect(() => {
        if (user?.profileId) {
            getPatientsByDoctor(user.profileId)
                .then((data: any[]) => {
                    console.log("Raw Patient Data:", data); // Check console to see actual fields

                    if (Array.isArray(data)) {
                        const formatted = data.map(p => {
                            // ✅ FIX: Check for 'patientId' OR 'id' to prevent crash
                            const id = p.patientId || p.id;
                            
                            // Safety check
                            if (!id) {
                                console.warn("Skipping patient with missing ID:", p);
                                return null; 
                            }

                            return {
                                value: id.toString(),
                                label: `${p.name} (ID: ${id})`
                            };
                        })
                        // Filter out any nulls from invalid data
                        .filter(item => item !== null) as { value: string; label: string }[];

                        setPatients(formatted);
                    }
                })
                .catch((err) => console.error("Error fetching patients:", err));
        }
    }, [user?.profileId]);

    // 2. Load Bookings when patient is selected
    useEffect(() => {
        if (selectedPatient) {
            setLoading(true);
            getBookingsByPatient(selectedPatient)
                .then(setBookings)
                .catch(() => setBookings([]))
                .finally(() => setLoading(false));
        }
    }, [selectedPatient]);

    const rows = bookings.map((b) => (
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
                        b.status === "COMPLETED" ? "green" : "red"
                    }
                >
                    {b.status}
                </Badge>
            </Table.Td>
            <Table.Td>{b.ambulanceId ? `Vehicle #${b.ambulanceId}` : "Pending"}</Table.Td>
            <Table.Td>{b.totalCharge ? `₹${b.totalCharge}` : "-"}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Card padding="lg" radius="md" withBorder>
            <Select
                label="Select Patient to view History"
                placeholder="Choose a patient"
                data={patients}
                value={selectedPatient}
                onChange={setSelectedPatient}
                searchable
                nothingFoundMessage="No patients found"
                mb="lg"
            />

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
                            <Table.Th>Assigned To</Table.Th>
                            <Table.Th>Bill</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            ) : (
                <Text c="dimmed" ta="center" py="xl">
                    {selectedPatient ? "No bookings found for this patient" : "Select a patient to view bookings"}
                </Text>
            )}
        </Card>
    );
};

export default MyBookings;