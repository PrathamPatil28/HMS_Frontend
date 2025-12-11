import { useEffect, useState } from "react";
import { Table, Badge, Card, Text } from "@mantine/core";
import { getAvailableAmbulances, AmbulanceDTO } from "../../../Service/AmbulanceService";

const PatientAvailableList = () => {
    const [ambulances, setAmbulances] = useState<AmbulanceDTO[]>([]);

    useEffect(() => {
        getAvailableAmbulances()
            .then(setAmbulances)
            .catch(console.error);
    }, []);

    const rows = ambulances.map((amb) => (
        <Table.Tr key={amb.id}>
            <Table.Td fw={600}>{amb.vehicleNumber}</Table.Td>
            <Table.Td>
                <Badge variant="outline" color={amb.vehicleType === "ICU" ? "red" : "blue"}>
                    {amb.vehicleType.replace(/_/g, " ")}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Badge color="green">AVAILABLE</Badge>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Card padding="lg" radius="md" withBorder>
            {ambulances.length > 0 ? (
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Vehicle Number</Table.Th>
                            <Table.Th>Facilities</Table.Th>
                            <Table.Th>Current Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            ) : (
                <Text c="dimmed" ta="center">No ambulances available nearby at the moment.</Text>
            )}
        </Card>
    );
};

export default PatientAvailableList;