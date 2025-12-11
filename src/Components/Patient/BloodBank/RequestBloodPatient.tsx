import { useState, useEffect } from "react";
import { Button, Select, NumberInput, Card, Table, Badge, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { 
    createBloodRequest, 
    getBloodRequestsByPatient, 
    BloodGroupsList, 
    BloodRequestDTO 
} from "../../../Service/BloodBankService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { formatDateAppShort } from "../../../util/DateFormat";

const RequestBloodPatient = () => {
    const user = useSelector((state: any) => state.user);
    const [history, setHistory] = useState<BloodRequestDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            requestedGroup: "",
            unitsRequired: 1
        },
        validate: {
            requestedGroup: (val) => (val ? null : "Blood group is required"),
            unitsRequired: (val) => (val > 0 ? null : "Min 1 unit"),
        },
    });

    const fetchHistory = () => {
        if (user?.profileId) {
            getBloodRequestsByPatient(user.profileId)
                .then(setHistory)
                .catch(() => setHistory([]));
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user?.profileId]);

    const handleSubmit = (values: typeof form.values) => {
        if (!user?.profileId) {
            errorNotification("User profile not found.");
            return;
        }

        setLoading(true);

        const payload: BloodRequestDTO = {
            patientId: user.profileId, // Automatically assign to self
            requestedGroup: values.requestedGroup as any,
            unitsRequired: values.unitsRequired,
            status: "PENDING"
        };

        createBloodRequest(payload).then(() => {
            successNotification("Blood Request Sent Successfully");
            form.reset();
            fetchHistory();
        }).catch((err) => {
            errorNotification(err.response?.data?.message || "Request Failed");
        }).finally(() => setLoading(false));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Request Form */}
            <Card shadow="sm" padding="lg" radius="md" withBorder className="lg:col-span-1 h-fit">
                <Title order={4} mb="xs">Request Blood</Title>
                <Text c="dimmed" size="sm" mb="lg">
                    Requesting for: <span className="font-semibold text-primary-500">{user.name}</span>
                </Text>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select 
                        label="Blood Group Required" 
                        placeholder="Select Blood Group"
                        data={BloodGroupsList} 
                        {...form.getInputProps("requestedGroup")}
                        mb="md"
                        searchable
                    />
                    <NumberInput 
                        label="Units Required" 
                        placeholder="Enter quantity"
                        min={1} 
                        max={5} 
                        {...form.getInputProps("unitsRequired")}
                        mb="lg"
                    />
                    <Button type="submit" fullWidth color="red" loading={loading}>
                        Submit Request
                    </Button>
                </form>
            </Card>

            {/* RIGHT: History Table */}
            <Card shadow="sm" padding="lg" radius="md" withBorder className="lg:col-span-2">
                <Title order={4} mb="md">My Request History</Title>
                
                {history.length > 0 ? (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Req ID</Table.Th>
                                <Table.Th>Group</Table.Th>
                                <Table.Th>Units</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Date</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {history.map(req => (
                                <Table.Tr key={req.id}>
                                    <Table.Td>#{req.id}</Table.Td>
                                    <Table.Td>
                                        <Badge color="red" variant="light">{req.requestedGroup.replace("_", " ")}</Badge>
                                    </Table.Td>
                                    <Table.Td>{req.unitsRequired}</Table.Td>
                                    <Table.Td>
                                        <Badge color={req.status === "APPROVED" ? "green" : req.status === "REJECTED" ? "red" : "orange"}>
                                            {req.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>{req.requestDate ? formatDateAppShort(req.requestDate) : "-"}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Text c="dimmed" ta="center" py="xl">You haven't made any blood requests yet.</Text>
                )}
            </Card>
        </div>
    );
};

export default RequestBloodPatient;