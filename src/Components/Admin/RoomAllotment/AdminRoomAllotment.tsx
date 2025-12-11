import { useEffect, useState } from "react";
import {
    Button, Badge, Group, Text, TextInput, Modal,
    Select, LoadingOverlay, Title, Avatar, SimpleGrid,
    NumberInput, Table, Center, Loader, Tabs, 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
    IconSearch, IconDoorEnter, IconLogout, IconPlus,
    IconHomePlus, IconBed, IconUserCheck, IconHistory, IconAlertCircle
} from "@tabler/icons-react";

import { getAllRoomData, admitPatient, dischargePatient, addRoomInventory } from "../../../Service/RoomService";
import { getAllPatient } from "../../../Service/PatientProfileService";
import { successNotification, errorNotification } from "../../../util/NotificationUtil";
import { formatDateDDMMYYYY } from "../../../util/DateFormat";

const AdminRoomAllotment = () => {
    const [data, setData] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal States
    const [admitOpened, { open: openAdmit, close: closeAdmit }] = useDisclosure(false);
    const [addRoomOpened, { open: openAddRoom, close: closeAddRoom }] = useDisclosure(false);
    const [selectedBed, setSelectedBed] = useState<any>(null);

    // --- FORMS ---
    const admitForm = useForm({
        initialValues: { patientId: "" },
        validate: { patientId: (v) => (!v ? "Patient is required" : null) }
    });

    const addRoomForm = useForm({
        initialValues: { roomNumber: "", roomType: "", pricePerDay: 0, numberOfBeds: 1 },
        validate: {
            roomNumber: (v) => (!v ? "Room Number is required" : null),
            roomType: (v) => (!v ? "Room Type is required" : null),
            pricePerDay: (v) => (v <= 0 ? "Price must be positive" : null),
            numberOfBeds: (v) => (v < 1 ? "Minimum 1 bed required" : null),
        }
    });

    // --- FETCH DATA ---
    const fetchData = () => {
        setLoading(true);
        getAllRoomData()
            .then(res => {
                console.log("Room Data Fetched:", res); // Debugging Log
                setData(res);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
        getAllPatient().then(res => {
            setPatients(res.map((p: any) => ({ value: String(p.id), label: `${p.name} (ID: ${p.id})` })));
        });
    }, []);

    // --- ACTIONS ---
    const handleAdmitClick = (row: any) => {
        setSelectedBed(row);
        openAdmit();
    };

    const handleAdmitSubmit = (values: any) => {
        setLoading(true);
        const payload = {
            patientId: Number(values.patientId),
            bedId: selectedBed.bedId
        };

        admitPatient(payload)
            .then(() => {
                successNotification("Patient Admitted Successfully");
                closeAdmit();
                admitForm.reset();
                fetchData();
            })
            .catch(err => errorNotification(err.response?.data?.message || "Admission Failed"))
            .finally(() => setLoading(false));
    };

    const handleDischarge = (row: any) => {
        if (!window.confirm(`Discharge ${row.patientName}? This will generate the bill.`)) return;
        setLoading(true);
        dischargePatient(row.allotmentId)
            .then((msg) => {
                successNotification(msg);
                fetchData();
            })
            .catch(() => errorNotification("Discharge Failed"))
            .finally(() => setLoading(false));
    };

    const handleAddRoomSubmit = (values: any) => {
        setLoading(true);
        addRoomInventory(values)
            .then(() => {
                successNotification("Room Added Successfully!");
                closeAddRoom();
                addRoomForm.reset();
                fetchData();
            })
            .catch(err => errorNotification(err.response?.data?.message || "Failed to Add Room"))
            .finally(() => setLoading(false));
    };

    // --- FILTER & TABS LOGIC ---
    // 1. Search Filter
    const searchFiltered = data.filter(item =>
        (item.roomNo?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.patientName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // 2. Category Filters (Case Insensitive to fix your issue)
    const availableBeds = searchFiltered.filter(r =>
        r.status.toUpperCase() === "AVAILABLE" || r.status.toUpperCase() === "MAINTENANCE"
    );

    const occupiedBeds = searchFiltered.filter(r =>
        r.status.toUpperCase() === "RESERVED" || r.status.toUpperCase() === "OCCUPIED"
    );

    // ✅ FIX: Ensure we catch "Discharged" regardless of case
    const historyData = searchFiltered.filter(r =>
        r.status.toUpperCase() === "DISCHARGED"
    );

    // --- REUSABLE TABLE RENDERER ---
    const renderTable = (tableData: any[], type: 'AVAILABLE' | 'OCCUPIED' | 'HISTORY') => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table striped highlightOnHover verticalSpacing="sm">
                <Table.Thead className="bg-gray-50">
                    <Table.Tr>
                        <Table.Th>Room No</Table.Th>
                        {/* Show Patient Name for Occupied & History */}
                        {type !== 'AVAILABLE' && <Table.Th>Patient Name</Table.Th>}
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Bed</Table.Th>

                        {/* Show Admission Date for Occupied & History */}
                        {type !== 'AVAILABLE' && <Table.Th>Admission Date</Table.Th>}

                        {/* Show Doctor for Occupied & History */}
                        {type !== 'AVAILABLE' && <Table.Th>Doctor</Table.Th>}

                        <Table.Th>Status</Table.Th>
                        <Table.Th>Charges / Rate</Table.Th>

                        {/* Action only for Available & Occupied */}
                        {type !== 'HISTORY' && <Table.Th>Action</Table.Th>}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {tableData.length > 0 ? tableData.map((row) => (
                        <Table.Tr key={`${row.roomNo}-${row.bedNo}-${row.allotmentId || Math.random()}`}>
                            <Table.Td fw={700} className="text-gray-700">{row.roomNo}</Table.Td>

                            {type !== 'AVAILABLE' && (
                                <Table.Td>
                                    <Group gap="sm">
                                        <Avatar src={null} alt={row.patientName} radius="xl" size="sm" color="blue">
                                            {row.patientName?.charAt(0)}
                                        </Avatar>
                                        <Text size="sm" fw={500}>{row.patientName}</Text>
                                    </Group>
                                </Table.Td>
                            )}

                            <Table.Td><Badge variant="dot" color="blue">{row.roomType}</Badge></Table.Td>
                            <Table.Td>{row.bedNo}</Table.Td>

                            {type !== 'AVAILABLE' && (
                                <Table.Td>{row.admissionDate ? formatDateDDMMYYYY(row.admissionDate) : "-"}</Table.Td>
                            )}

                            {type !== 'AVAILABLE' && (
                                <Table.Td><Text size="sm" c="dimmed">{row.doctorAssigned}</Text></Table.Td>
                            )}

                            <Table.Td>
                                <Badge
                                    color={
                                        row.status.toUpperCase() === "RESERVED" ? "red" :
                                            row.status.toUpperCase() === "AVAILABLE" ? "green" :
                                                row.status.toUpperCase() === "DISCHARGED" ? "gray" : "yellow"
                                    }
                                    variant="light"
                                >
                                    {row.status}
                                </Badge>
                            </Table.Td>

                            <Table.Td fw={600}>₹{row.amountCharged}</Table.Td>

                            {type !== 'HISTORY' && (
                                <Table.Td>
                                    {row.status.toUpperCase() === "AVAILABLE" ? (
                                        <Button size="compact-xs" color="green" leftSection={<IconDoorEnter size={14} />} onClick={() => handleAdmitClick(row)}>
                                            Admit
                                        </Button>
                                    ) : (
                                        <Button size="compact-xs" color="red" variant="light" leftSection={<IconLogout size={14} />} onClick={() => handleDischarge(row)}>
                                            Discharge
                                        </Button>
                                    )}
                                </Table.Td>
                            )}
                        </Table.Tr>
                    )) : (
                        <Table.Tr>
                            <Table.Td colSpan={9} align="center" py="xl" c="dimmed">
                                <IconAlertCircle size={40} className="mb-2 opacity-50" />
                                <Text>No records found in this category.</Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </div>
    );

    if (loading && data.length === 0) return <Center h={300}><Loader size="lg" /></Center>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <Group justify="space-between" mb="lg">
                <div>
                    <Title order={2} className="text-slate-700">Room Management</Title>
                    <Text c="dimmed" size="sm">Manage beds, admissions and discharges</Text>
                </div>
                <Button leftSection={<IconPlus size={16} />} onClick={openAddRoom} color="blue">
                    Add Room Inventory
                </Button>
            </Group>

            {/* Search Bar */}
            <TextInput
                placeholder="Search by Room, Patient Name..."
                leftSection={<IconSearch size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 w-1/3"
                size="md"
            />

            {/* TABS SECTION */}
            <Tabs
                defaultValue="available"
                variant="default"
                classNames={{
                    list: "border-b border-gray-200 mb-6 bg-white px-4 pt-2 rounded-t-lg",
                    tab: "pb-4 pt-3 text-md data-[active]:font-bold data-[active]:border-b-2 hover:bg-gray-50 transition-colors",
                }}
            >
                <Tabs.List>
                    <Tabs.Tab
                        value="available"
                        color="green" // Controls underline color
                        className="data-[active]:text-green-600"
                    >
                        <Group gap="xs">
                            <IconBed size={20} />
                            <span>Available Beds</span>
                            <Badge variant="filled" color="green" size="lg" radius="sm">{availableBeds.length}</Badge>
                        </Group>
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="occupied"
                        color="red"
                        className="data-[active]:text-red-600"
                    >
                        <Group gap="xs">
                            <IconUserCheck size={20} />
                            <span>Admitted Patients</span>
                            <Badge variant="filled" color="red" size="lg" radius="sm">{occupiedBeds.length}</Badge>
                        </Group>
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="history"
                        color="gray"
                        className="data-[active]:text-gray-700"
                    >
                        <Group gap="xs">
                            <IconHistory size={20} />
                            <span>History</span>
                            <Badge variant="light" color="gray" size="lg" radius="sm">{historyData.length}</Badge>
                        </Group>
                    </Tabs.Tab>
                </Tabs.List>

                {/* Panels remain the same */}
                <Tabs.Panel value="available">{renderTable(availableBeds, 'AVAILABLE')}</Tabs.Panel>
                <Tabs.Panel value="occupied">{renderTable(occupiedBeds, 'OCCUPIED')}</Tabs.Panel>
                <Tabs.Panel value="history">{renderTable(historyData, 'HISTORY')}</Tabs.Panel>
            </Tabs>
            {/* ADMIT MODAL */}
            <Modal opened={admitOpened} onClose={closeAdmit} title={`Admit Patient to Room ${selectedBed?.roomNo} - Bed ${selectedBed?.bedNo}`} centered>
                <LoadingOverlay visible={loading} />
                <form onSubmit={admitForm.onSubmit(handleAdmitSubmit)}>
                    <Select
                        label="Select Patient"
                        placeholder="Search by name or ID"
                        data={patients}
                        searchable
                        nothingFoundMessage="No patients found"
                        {...admitForm.getInputProps("patientId")}
                        mb="lg"
                        withAsterisk
                    />
                    <Group justify="end">
                        <Button variant="default" onClick={closeAdmit}>Cancel</Button>
                        <Button type="submit" color="green">Confirm Admission</Button>
                    </Group>
                </form>
            </Modal>

            {/* ADD ROOM MODAL */}
            <Modal opened={addRoomOpened} onClose={closeAddRoom} title={<Group><IconHomePlus size={20} /> Add New Room Inventory</Group>} centered size="lg">
                <LoadingOverlay visible={loading} />
                <form onSubmit={addRoomForm.onSubmit(handleAddRoomSubmit)}>
                    <SimpleGrid cols={2} spacing="lg">
                        <TextInput label="Room Number" placeholder="e.g. 101" withAsterisk {...addRoomForm.getInputProps("roomNumber")} />
                        <Select label="Room Type" placeholder="Select Type" data={['General', 'Standard', 'Delux', 'ICU', 'Private']} withAsterisk {...addRoomForm.getInputProps("roomType")} />
                        <NumberInput label="Price Per Day (₹)" placeholder="0.00" min={0} withAsterisk {...addRoomForm.getInputProps("pricePerDay")} />
                        <NumberInput label="Number of Beds" min={1} max={20} withAsterisk {...addRoomForm.getInputProps("numberOfBeds")} />
                    </SimpleGrid>
                    <Group justify="end" mt="xl">
                        <Button variant="default" onClick={closeAddRoom}>Cancel</Button>
                        <Button type="submit" color="blue">Save Room</Button>
                    </Group>
                </form>
            </Modal>
        </div>
    );
};

export default AdminRoomAllotment;