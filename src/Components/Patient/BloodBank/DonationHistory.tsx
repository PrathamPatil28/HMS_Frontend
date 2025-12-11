        import { useEffect, useState } from "react";
        import { Table, Badge, Card, Text, Center, Loader, Button } from "@mantine/core";
        import { getDonationHistory, BloodUnitDTO } from "../../../Service/BloodBankService";
        import { IconHistory } from "@tabler/icons-react";

        const DonationHistory = ({ donorId }: { donorId: number | null }) => {
            const [history, setHistory] = useState<BloodUnitDTO[]>([]);
            const [loading, setLoading] = useState(false);

            useEffect(() => {
                if (donorId) {
                    setLoading(true);
                    getDonationHistory(donorId)
                        .then(setHistory)
                        .catch(console.error)
                        .finally(() => setLoading(false));
                }
            }, [donorId]);

            if (!donorId) {
                return (
                    <Card withBorder padding="xl" radius="md" className="text-center">
                        <Text c="dimmed">Please register as a donor to view history.</Text>
                    </Card>
                );
            }

            if (loading) return <Center h={100}><Loader color="red"/></Center>;

            return (
                <Card padding="lg" radius="md" withBorder>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <IconHistory className="text-red-500" />
                            <Text fw={700} size="lg">My Donation Log</Text>
                        </div>
                        {/* This button simulates a request - in real app, it would create a booking */}
                        <Button variant="light" color="red" disabled>Request to Donate</Button>
                    </div>
                    
                    {history.length > 0 ? (
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Date Collected</Table.Th>
                                    <Table.Th>Expiry Date</Table.Th>
                                    <Table.Th>Unit ID</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {history.map((unit) => (
                                    <Table.Tr key={unit.id}>
                                        <Table.Td>{unit.collectedDate}</Table.Td>
                                        <Table.Td>{unit.expiryDate}</Table.Td>
                                        <Table.Td>#{unit.id}</Table.Td>
                                        <Table.Td>
                                            <Badge color={unit.status === "USED" ? "blue" : unit.status === "AVAILABLE" ? "green" : "gray"}>
                                                {unit.status}
                                            </Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">You haven't made any donations yet. Visit us to save a life!</Text>
                    )}
                </Card>
            );
        };

        export default DonationHistory;