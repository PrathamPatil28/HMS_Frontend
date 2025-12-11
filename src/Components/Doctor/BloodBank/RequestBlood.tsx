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
import { getPatientsByDoctor } from "../../../Service/AppointmentService"; 
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { formatDateAppShort } from "../../../util/DateFormat";

const RequestBlood = () => {
    const user = useSelector((state: any) => state.user);
    
    const [patients, setPatients] = useState<{ value: string; label: string }[]>([]);
    const [patientNames, setPatientNames] = useState<Record<string, string>>({});
    const [history, setHistory] = useState<BloodRequestDTO[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    // Load Doctors Patients
    useEffect(() => {
        if (user?.profileId) {
            getPatientsByDoctor(user.profileId).then((data: any[]) => {
                console.log("Fetched Patients:", data); // Debugging log

                const lookup: Record<string, string> = {};
                
                const formattedOptions = data.map(p => {
                    // ✅ FIX: Check for 'patientId' OR 'id' to prevent crash
                    const id = p.patientId || p.id;

                    if (!id) return null; // Skip invalid entries

                    // Populate lookup map
                    lookup[String(id)] = p.name;

                    return {
                        value: String(id), // Safer than .toString()
                        label: `${p.name} (ID: ${id})`
                    };
                }).filter(item => item !== null) as { value: string; label: string }[];

                setPatients(formattedOptions);
                setPatientNames(lookup);
            }).catch(err => console.error(err));
        }
    }, [user]);

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

    // Fetch history when patient is selected
    useEffect(() => {
        if (selectedPatientId) {
            getBloodRequestsByPatient(parseInt(selectedPatientId))
                .then(setHistory)
                .catch(() => setHistory([]));
        } else {
            setHistory([]);
        }
    }, [selectedPatientId]);

    const handleSubmit = (values: typeof form.values) => {
        if (!selectedPatientId) {
            errorNotification("Please select a patient");
            return;
        }

        const payload: BloodRequestDTO = {
            patientId: parseInt(selectedPatientId),
            requestedGroup: values.requestedGroup as any,
            unitsRequired: values.unitsRequired,
            status: "PENDING"
        };

        createBloodRequest(payload).then(() => {
            successNotification("Blood Request Sent");
            form.reset();
            getBloodRequestsByPatient(parseInt(selectedPatientId)).then(setHistory);
        }).catch(() => errorNotification("Request Failed"));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Request Form */}
            <Card shadow="sm" padding="lg" radius="md" withBorder className="lg:col-span-1 h-fit">
                <Title order={4} mb="md">New Request</Title>
                <Select 
                    label="Select Patient" 
                    placeholder="Choose Patient"
                    data={patients} 
                    value={selectedPatientId}
                    onChange={setSelectedPatientId}
                    searchable
                    mb="md"
                />

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select 
                        label="Blood Group Required" 
                        data={BloodGroupsList} 
                        {...form.getInputProps("requestedGroup")}
                        disabled={!selectedPatientId}
                        mb="md"
                    />
                    <NumberInput 
                        label="Units Required" 
                        min={1} 
                        max={10} 
                        {...form.getInputProps("unitsRequired")}
                        disabled={!selectedPatientId}
                        mb="lg"
                    />
                    <Button type="submit" fullWidth color="red" disabled={!selectedPatientId}>
                        Submit Request
                    </Button>
                </form>
            </Card>

            {/* RIGHT: History Table */}
            <Card shadow="sm" padding="lg" radius="md" withBorder className="lg:col-span-2">
                <Title order={4} mb="md">
                    Request Status: {selectedPatientId && patientNames[selectedPatientId] ? patientNames[selectedPatientId] : "(Select Patient)"}
                </Title>
                
                {history.length > 0 ? (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Req ID</Table.Th>
                                <Table.Th>Patient Name</Table.Th>
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
                                    
                                    {/* Display Name from Lookup Map */}
                                    <Table.Td className="font-medium">
                                        {patientNames[String(req.patientId)] || req.patientId}
                                    </Table.Td>
                                    
                                    <Table.Td className="font-bold text-red-600">{req.requestedGroup.replace("_", " ")}</Table.Td>
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
                    <Text c="dimmed" ta="center" py="xl">No request history found for selected patient.</Text>
                )}
            </Card>
        </div>
    );
};

export default RequestBlood;