import { useEffect, useState } from "react";
import { Table, Button, Badge, Card, Tabs, Group, Text, Checkbox, Modal, Select, Loader, Center, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconReceipt, IconHistory, IconAmbulance, IconPill, IconStethoscope, IconDroplet, IconBed, IconFlask } from "@tabler/icons-react";
import {
    getAllBills,
    getCompletedAmbulanceTrips,
    getUnbilledPharmacySales,
    getUnbilledAppointments, 
    getUnbilledBloodRequests,
    generateBill,
    PatientBillDTO
} from "../../../Service/BillingService";
import { getAllPatient } from "../../../Service/PatientProfileService";
import { successNotification, errorNotification } from "../../../util/NotificationUtil";
import { formatDateAppShort } from "../../../util/DateFormat";
import axiosInstance from "../../../Interceptor/AxiosInterceptor";

const BillingManager = () => {
    const [activeTab, setActiveTab] = useState<string | null>("create");
    const [loading, setLoading] = useState(true);

    // Data
    const [bills, setBills] = useState<PatientBillDTO[]>([]);
    const [patients, setPatients] = useState<{ value: string, label: string }[]>([]);
    
    // Unbilled Items State
    const [unbilledAmbulance, setUnbilledAmbulance] = useState<any[]>([]);
    const [unbilledPharmacy, setUnbilledPharmacy] = useState<any[]>([]);
    const [unbilledAppointments, setUnbilledAppointments] = useState<any[]>([]); 
    const [unbilledBlood, setUnbilledBlood] = useState<any[]>([]);
    const [unbilledRooms, setUnbilledRooms] = useState<any[]>([]); 
    const [unbilledLabs, setUnbilledLabs] = useState<any[]>([]); 
    
    // Selection State
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedAmbIds, setSelectedAmbIds] = useState<number[]>([]);
    const [selectedPharmaIds, setSelectedPharmaIds] = useState<number[]>([]);
    const [selectedApptIds, setSelectedApptIds] = useState<number[]>([]); 
    const [selectedBloodIds, setSelectedBloodIds] = useState<number[]>([]);
    const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]); 
    const [selectedLabIds, setSelectedLabIds] = useState<number[]>([]);

    // Modal State
    const [opened, { open, close }] = useDisclosure(false);

    // 1. Initial Load (History & Patients)
    useEffect(() => {
        const init = async () => {
            try {
                const [billsData, patientsData] = await Promise.all([
                    getAllBills(),
                    getAllPatient()
                ]);
                setBills(billsData);
                setPatients(patientsData.map((p: any) => ({ value: String(p.id), label: `${p.name} (ID: ${p.id})` })));
            } catch (e) {
                console.error(e);
                errorNotification("Failed to load initial data");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // 2. Fetch Unbilled Items & FILTER DUPLICATES
    useEffect(() => {
        if (!selectedPatient) {
            // Reset states if no patient selected
            setUnbilledAmbulance([]);
            setUnbilledPharmacy([]);
            setUnbilledAppointments([]);
            setUnbilledBlood([]);
            setUnbilledRooms([]);
            setUnbilledLabs([]);
            return;
        }
        
        const fetchUnbilled = async () => {
            setLoading(true);
            try {
                const pid = parseInt(selectedPatient);
                
                // Fetch data from all services
                const fetchRooms = axiosInstance.get(`/rooms/discharged/unbilled/patient/${pid}`).then(res => res.data);
                const fetchLabs = axiosInstance.get(`/lab/request/unbilled/patient/${pid}`).then(res => res.data);

                const [allTrips, mySales, myAppts, myBlood, myRooms, myLabs] = await Promise.all([
                    getCompletedAmbulanceTrips(),
                    getUnbilledPharmacySales(pid),
                    getUnbilledAppointments(pid),
                    getUnbilledBloodRequests(pid),
                    fetchRooms,
                    fetchLabs
                ]);

                // --- 🛡️ DUPLICATE CHECK LOGIC ---
                // We check the 'bills' history. If an item ID exists in a previous bill for this service, we skip it.
                
                const isNotBilled = (itemId: number, serviceName: string) => {
                    // 1. Look through all existing bills
                    const alreadyBilled = bills.some(bill => 
                        // 2. Check items inside the bill
                        bill.items.some(billItem => 
                            billItem.sourceItemId === itemId && 
                            billItem.sourceService === serviceName
                        )
                    );
                    // Return TRUE if it is NOT billed yet (keep it in the list)
                    return !alreadyBilled;
                };

                // --- APPLY FILTERS ---

                // 1. Ambulance (Matches 'id' -> 'AMBULANCE_MS')
                const validTrips = allTrips.filter((t: any) => 
                    t.patientId === pid && isNotBilled(t.id, "AMBULANCE_MS")
                );

                // 2. Pharmacy (Matches 'id' -> 'PHARMACY_MS')
                const validSales = mySales.filter((s: any) => 
                    isNotBilled(s.id, "PHARMACY_MS")
                );

                // 3. Appointments (Matches 'appointmentId' -> 'APPOINTMENT_MS')
                const validAppts = myAppts.filter((a: any) => 
                    isNotBilled(a.appointmentId, "APPOINTMENT_MS")
                );

                // 4. Blood Bank (Matches 'requestId' -> 'BLOODBANK_MS')
                // Note: Ensure your backend DTO returns 'requestId'.
                const validBlood = myBlood.filter((b: any) => 
                    isNotBilled(b.requestId, "BLOODBANK_MS")
                );

                // 5. Room (Matches 'allotmentId' -> 'ROOM_MS')
                const validRooms = myRooms.filter((r: any) => 
                    isNotBilled(r.allotmentId, "ROOM_MS")
                );

                // 6. Labs (Matches 'requestId' -> 'LAB_MS')
                const validLabs = myLabs.filter((l: any) => 
                    isNotBilled(l.requestId, "LAB_MS")
                );

                setUnbilledAmbulance(validTrips);
                setUnbilledPharmacy(validSales);
                setUnbilledAppointments(validAppts); 
                setUnbilledBlood(validBlood);
                setUnbilledRooms(validRooms);
                setUnbilledLabs(validLabs);

            } catch (e) {
                console.error(e);
                errorNotification("Failed to fetch unbilled items");
            } finally {
                setLoading(false);
            }
        };
        fetchUnbilled();
    }, [selectedPatient, bills]); // 👈 Re-runs when 'bills' history updates (after generation)

    const handleGenerate = () => {
        if (!selectedPatient) return;
        
        const payload = {
            patientId: parseInt(selectedPatient),
            ambulanceBookingIds: selectedAmbIds,
            pharmacySaleIds: selectedPharmaIds,
            appointmentIds: selectedApptIds,
            bloodRequestIds: selectedBloodIds,
            roomAllotmentIds: selectedRoomIds,
            labRequestIds: selectedLabIds
        };

        generateBill(payload).then(() => {
            successNotification("Bill Generated Successfully!");
            // Clear selections
            setSelectedAmbIds([]);
            setSelectedPharmaIds([]);
            setSelectedApptIds([]);
            setSelectedBloodIds([]);
            setSelectedRoomIds([]);
            setSelectedLabIds([]);
            
            close(); // Close modal
            
            // 🔄 REFRESH BILL HISTORY
            // This will update 'bills' state -> triggers useEffect -> removes generated items from list
            setLoading(true);
            getAllBills().then((data) => {
                setBills(data);
                setLoading(false);
            });
            
        }).catch(() => errorNotification("Generation Failed"));
    };

    const toggleId = (id: number, list: number[], setList: Function) => {
        setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
    };

    if (loading) return <Center h={300}><Loader size="lg" /></Center>;

    return (
        <div className="p-5">
            <Group justify="space-between" mb="lg">
                <h1 className="text-2xl font-bold text-primary-500">Billing Manager</h1>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab} color="teal" radius="md">
                <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
                    <Tabs.Tab value="create" leftSection={<IconReceipt size={18}/>}>Create Bill</Tabs.Tab>
                    <Tabs.Tab value="history" leftSection={<IconHistory size={18}/>}>History</Tabs.Tab>
                </Tabs.List>

                {/* --- CREATE BILL TAB --- */}
                <Tabs.Panel value="create">
                    <Card withBorder radius="md" p="lg">
                        <Select 
                            label="Select Patient" 
                            placeholder="Search patient to bill..." 
                            data={patients} 
                            searchable
                            value={selectedPatient}
                            onChange={setSelectedPatient}
                            mb="xl"
                        />

                        {selectedPatient && (
                            <div className="space-y-8">
                                
                                {/* 1. DOCTOR APPOINTMENTS */}
                                <div>
                                    <Group mb="sm"><IconStethoscope className="text-purple-600"/><Text fw={700}>Doctor Consultations</Text></Group>
                                    {unbilledAppointments.length > 0 ? (
                                        <Table withTableBorder>
                                            <Table.Thead><Table.Tr><Table.Th>Select</Table.Th><Table.Th>Date</Table.Th><Table.Th>Description</Table.Th><Table.Th>Fee</Table.Th></Table.Tr></Table.Thead>
                                            <Table.Tbody>
                                                {unbilledAppointments.map(a => (
                                                    <Table.Tr key={a.appointmentId}>
                                                        <Table.Td><Checkbox checked={selectedApptIds.includes(a.appointmentId)} onChange={() => toggleId(a.appointmentId, selectedApptIds, setSelectedApptIds)} /></Table.Td>
                                                        <Table.Td>{formatDateAppShort(a.appointmentDate)}</Table.Td>
                                                        <Table.Td>{a.doctorName} ({a.description})</Table.Td>
                                                        <Table.Td>₹{a.consultationFee}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : <Text c="dimmed" fs="italic">No unbilled appointments.</Text>}
                                </div>
                                <Divider />

                                {/* 2. ROOM CHARGES */}
                                <div>
                                    <Group mb="sm"><IconBed className="text-orange-600"/><Text fw={700}>Room Charges</Text></Group>
                                    {unbilledRooms.length > 0 ? (
                                        <Table withTableBorder>
                                            <Table.Thead><Table.Tr><Table.Th>Select</Table.Th><Table.Th>Discharge Date</Table.Th><Table.Th>Description</Table.Th><Table.Th>Total</Table.Th></Table.Tr></Table.Thead>
                                            <Table.Tbody>
                                                {unbilledRooms.map(r => (
                                                    <Table.Tr key={r.allotmentId}>
                                                        <Table.Td><Checkbox checked={selectedRoomIds.includes(r.allotmentId)} onChange={() => toggleId(r.allotmentId, selectedRoomIds, setSelectedRoomIds)} /></Table.Td>
                                                        <Table.Td>{formatDateAppShort(r.dischargeDate)}</Table.Td>
                                                        <Table.Td>{r.description}</Table.Td>
                                                        <Table.Td>₹{r.totalCharge}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : <Text c="dimmed" fs="italic">No unbilled room charges.</Text>}
                                </div>
                                <Divider />

                                {/* 3. BLOOD BANK */}
                                <div>
                                    <Group mb="sm"><IconDroplet className="text-red-600"/><Text fw={700}>Blood Bank Requests</Text></Group>
                                    {unbilledBlood.length > 0 ? (
                                        <Table withTableBorder>
                                            <Table.Thead><Table.Tr><Table.Th>Select</Table.Th><Table.Th>Date</Table.Th><Table.Th>Group</Table.Th><Table.Th>Units</Table.Th><Table.Th>Cost</Table.Th></Table.Tr></Table.Thead>
                                            <Table.Tbody>
                                                {unbilledBlood.map(b => (
                                                    <Table.Tr key={b.requestId}>
                                                        <Table.Td><Checkbox checked={selectedBloodIds.includes(b.requestId)} onChange={() => toggleId(b.requestId, selectedBloodIds, setSelectedBloodIds)} /></Table.Td>
                                                        <Table.Td>{formatDateAppShort(b.requestDate)}</Table.Td>
                                                        <Table.Td><Badge color="red" variant="light">{b.bloodGroup}</Badge></Table.Td>
                                                        <Table.Td>{b.units} Units</Table.Td>
                                                        <Table.Td>₹{b.totalAmount}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : <Text c="dimmed" fs="italic">No unbilled blood requests.</Text>}
                                </div>
                                <Divider />

                                {/* 4. LAB TESTS */}
                                <div>
                                    <Group mb="sm"><IconFlask className="text-indigo-600"/><Text fw={700}>Lab Tests</Text></Group>
                                    {unbilledLabs.length > 0 ? (
                                        <Table withTableBorder>
                                            <Table.Thead><Table.Tr><Table.Th>Select</Table.Th><Table.Th>Date</Table.Th><Table.Th>Test Name</Table.Th><Table.Th>Cost</Table.Th></Table.Tr></Table.Thead>
                                            <Table.Tbody>
                                                {unbilledLabs.map(l => (
                                                    <Table.Tr key={l.requestId}>
                                                        <Table.Td><Checkbox checked={selectedLabIds.includes(l.requestId)} onChange={() => toggleId(l.requestId, selectedLabIds, setSelectedLabIds)} /></Table.Td>
                                                        <Table.Td>{formatDateAppShort(l.requestDate)}</Table.Td>
                                                        <Table.Td>{l.testName}</Table.Td>
                                                        <Table.Td>₹{l.amount}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : <Text c="dimmed" fs="italic">No unbilled lab tests.</Text>}
                                </div>
                                <Divider />

                                {/* 5. AMBULANCE */}
                                <div>
                                    <Group mb="sm"><IconAmbulance className="text-blue-600"/><Text fw={700}>Ambulance Trips</Text></Group>
                                    {unbilledAmbulance.length > 0 ? (
                                        <Table withTableBorder>
                                            <Table.Thead><Table.Tr><Table.Th>Select</Table.Th><Table.Th>Date</Table.Th><Table.Th>Route</Table.Th><Table.Th>Cost</Table.Th></Table.Tr></Table.Thead>
                                            <Table.Tbody>
                                                {unbilledAmbulance.map(t => (
                                                    <Table.Tr key={t.id}>
                                                        <Table.Td><Checkbox checked={selectedAmbIds.includes(t.id)} onChange={() => toggleId(t.id, selectedAmbIds, setSelectedAmbIds)} /></Table.Td>
                                                        <Table.Td>{formatDateAppShort(t.endTime)}</Table.Td>
                                                        <Table.Td>{t.pickupLocation} → {t.destinationLocation}</Table.Td>
                                                        <Table.Td>₹{t.totalCharge}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : <Text c="dimmed" fs="italic">No unbilled ambulance trips.</Text>}
                                </div>
                                <Divider />

                                {/* 6. PHARMACY */}
                                <div>
                                    <Group mb="sm"><IconPill className="text-teal-600"/><Text fw={700}>Pharmacy Sales</Text></Group>
                                    {unbilledPharmacy.length > 0 ? (
                                        <Table withTableBorder>
                                            <Table.Thead><Table.Tr><Table.Th>Select</Table.Th><Table.Th>Date</Table.Th><Table.Th>Items</Table.Th><Table.Th>Amount</Table.Th></Table.Tr></Table.Thead>
                                            <Table.Tbody>
                                                {unbilledPharmacy.map(s => (
                                                    <Table.Tr key={s.id}>
                                                        <Table.Td><Checkbox checked={selectedPharmaIds.includes(s.id)} onChange={() => toggleId(s.id, selectedPharmaIds, setSelectedPharmaIds)} /></Table.Td>
                                                        <Table.Td>{formatDateAppShort(s.saleDate)}</Table.Td>
                                                        <Table.Td>Pharmacy Purchase (ID: {s.id})</Table.Td>
                                                        <Table.Td>₹{s.totalAmount}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : <Text c="dimmed" fs="italic">No unbilled pharmacy sales.</Text>}
                                </div>

                                <Button 
                                    fullWidth 
                                    size="lg" 
                                    mt="xl" 
                                    onClick={open} 
                                    disabled={
                                        selectedAmbIds.length === 0 && 
                                        selectedPharmaIds.length === 0 && 
                                        selectedApptIds.length === 0 && 
                                        selectedBloodIds.length === 0 &&
                                        selectedRoomIds.length === 0 &&
                                        selectedLabIds.length === 0
                                    }
                                >
                                    Generate Consolidated Invoice
                                </Button>
                            </div>
                        )}
                    </Card>
                </Tabs.Panel>

                {/* --- HISTORY TAB --- */}
                <Tabs.Panel value="history">
                    <Card withBorder radius="md">
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Bill #</Table.Th>
                                    <Table.Th>Patient</Table.Th>
                                    <Table.Th>Date</Table.Th>
                                    <Table.Th style={{width:'30%'}}>Breakdown</Table.Th>
                                    <Table.Th>Total</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {bills.map(b => (
                                    <Table.Tr key={b.id}>
                                        <Table.Td>{b.id}</Table.Td>
                                        <Table.Td>
                                            <Text fw={500}>{patients.find(p => p.value === String(b.patientId))?.label || `ID: ${b.patientId}`}</Text>
                                        </Table.Td>
                                        <Table.Td>{formatDateAppShort(b.billDate)}</Table.Td>
                                        
                                        <Table.Td>
                                            <div className="flex flex-col gap-2">
                                                {b.items.map(item => (
                                                    <div key={item.id} className="flex justify-between items-center text-xs border-b border-gray-100 last:border-0 pb-1">
                                                        <Badge size="xs" variant="outline" color="blue" className="mr-2">
                                                            {item.sourceService.replace("_MS", "")}
                                                        </Badge>
                                                        <span className="text-gray-700 truncate flex-1">{item.description}</span>
                                                        <span className="font-semibold ml-2">₹{item.amount}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Table.Td>
                                    
                                        <Table.Td fw={700}>₹{b.totalAmount}</Table.Td>
                                        <Table.Td>
                                            <Badge color={b.status === "PAID" ? "green" : "orange"}>{b.status}</Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Card>
                </Tabs.Panel>
            </Tabs>

            {/* --- CONFIRMATION MODAL --- */}
            <Modal opened={opened} onClose={close} title="Confirm Bill Generation" centered>
                <Text size="sm" mb="lg">
                    You are about to generate a bill for <b>{patients.find(p => p.value === selectedPatient)?.label}</b> including:
                    <ul className="list-disc pl-5 mt-2">
                        {selectedApptIds.length > 0 && <li>{selectedApptIds.length} Appointments</li>}
                        {selectedAmbIds.length > 0 && <li>{selectedAmbIds.length} Ambulance Trips</li>}
                        {selectedPharmaIds.length > 0 && <li>{selectedPharmaIds.length} Pharmacy Sales</li>}
                        {selectedBloodIds.length > 0 && <li>{selectedBloodIds.length} Blood Requests</li>}
                        {selectedRoomIds.length > 0 && <li>{selectedRoomIds.length} Room Charges</li>}
                        {selectedLabIds.length > 0 && <li>{selectedLabIds.length} Lab Tests</li>}
                    </ul>
                </Text>
                <Button fullWidth onClick={handleGenerate}>Confirm & Create</Button>
            </Modal>
        </div>
    );
};

export default BillingManager;