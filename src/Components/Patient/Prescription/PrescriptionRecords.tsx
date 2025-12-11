import {
    Table,
    Title,
    Text,
    Loader,
    Center,
    Badge,
    ScrollArea,
    Group,
    Button,
    Modal,
    Stack,
    Divider,
    Card,
    ThemeIcon
} from "@mantine/core";
import {
    IconUser,
    IconCalendar,

    IconEye,
    IconDownload,
    IconPill,

} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getPrescriptionByPatientId,
    getMedicineByPrescriptionId,
} from "../../../Service/AppointmentService.ts";
import { formatDateAppShort } from "../../../util/DateFormat.tsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PrescriptionRecords = () => {
    const user = useSelector((state: any) => state.user);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedicines, setSelectedMedicines] = useState<Record<number, any[]>>({});
    const [opened, setOpened] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

    // ✅ Helper: Convert "1-0-1" to "Morning - Night"
    const formatFrequency = (freq: string) => {
        if (!freq || !freq.includes("-")) return freq || "N/A";
        
        const parts = freq.split("-");
        const times = [];
        if (parts[0] === "1") times.push("Morning");
        if (parts[1] === "1") times.push("Afternoon");
        if (parts[2] === "1") times.push("Night");
        
        return times.length > 0 ? times.join(" - ") : "N/A";
    };

    useEffect(() => {
        if (!user?.profileId) return;
        getPrescriptionByPatientId(user.profileId)
            .then((data) => {
                setPrescriptions(data);
            })
            .catch((err) => console.error("Error fetching prescriptions:", err))
            .finally(() => setLoading(false));
    }, [user]);

    const loadMedicines = async (prescriptionId: number) => {
        if (selectedMedicines[prescriptionId]) return selectedMedicines[prescriptionId];
        const meds = await getMedicineByPrescriptionId(prescriptionId);
        setSelectedMedicines((prev) => ({ ...prev, [prescriptionId]: meds }));
        return meds;
    };

    const handleView = async (prescription: any) => {
        await loadMedicines(prescription.id);
        setSelectedPrescription(prescription);
        setOpened(true);
    };

    // ✅ PDF GENERATION
    const handleDownload = async (prescription: any) => {
        try {
            const meds = await loadMedicines(prescription.id);
            const doc = new jsPDF();

            // --- HEADER ---
            doc.setFillColor(41, 128, 185); // Professional Blue
            doc.rect(0, 0, 210, 40, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("PULSE HOSPITAL", 105, 20, { align: "center" });

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
           doc.text("Electronic Prescription Record", 105, 30, { align: "center" });

            // --- PATIENT INFO ---
            doc.setTextColor(0, 0, 0);
            let yPos = 55;

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Prescription Details", 14, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            
            // Left Column
            doc.text(`Patient Name: ${user.name}`, 14, yPos);
            doc.text(`Patient ID: ${user.id}`, 14, yPos + 6);
            
            // Right Column
            doc.text(`Doctor: Dr. ${prescription.doctorName}`, 120, yPos);
            doc.text(`Date: ${formatDateAppShort(prescription.prescriptionDate)}`, 120, yPos + 6);

            yPos += 15;

            // --- DIAGNOSIS / NOTES ---
            if (prescription.notes) {
                doc.setDrawColor(200, 200, 200);
                doc.setFillColor(245, 245, 245);
                doc.roundedRect(14, yPos, 182, 20, 2, 2, "FD");
                
                doc.text("Diagnosis / Notes:", 18, yPos + 6);
                doc.setFont("helvetica", "italic");
                doc.text(prescription.notes, 18, yPos + 14);
                yPos += 28;
            }

            // --- MEDICINE TABLE ---
            const tableBody = meds.map((m: any) => [
                m.name,
                m.dosage || "-",
                formatFrequency(m.frequency), // ✅ Formatted here
                `${m.duration} Days`,
                m.instructions || "-"
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 4 },
                columnStyles: {
                    0: { fontStyle: "bold" }, // Medicine Name bold
                    2: { cellWidth: 40 } // Frequency column wider
                }
            });

            // --- FOOTER ---
            const pageHeight = doc.internal.pageSize.height;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("This prescription is computer-generated.", 105, pageHeight - 10, { align: "center" });

            doc.save(`Prescription_${formatDateAppShort(prescription.prescriptionDate)}.pdf`);

        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    if (loading)
        return (
            <Center h={"70vh"}>
                <Loader color="blue" />
            </Center>
        );

    return (
        <ScrollArea>
            <Title order={2} mb="lg" c="blue.7">
                Prescription Records
            </Title>

            {prescriptions.length === 0 ? (
                <Center>
                    <Text c="dimmed">No prescription history available.</Text>
                </Center>
            ) : (
                <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="sm">
                    <Table.Thead className="bg-blue-50">
                        <Table.Tr>
                            <Table.Th>Doctor</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Notes</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {prescriptions.map((p) => (
                            <Table.Tr key={p.id}>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ThemeIcon color="blue" variant="light" size="sm" radius="xl">
                                            <IconUser size={12} />
                                        </ThemeIcon>
                                        <Text fw={500} size="sm">Dr. {p.doctorName}</Text>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <IconCalendar size={16} className="text-gray-500" />
                                        <Text size="sm">{formatDateAppShort(p.prescriptionDate)}</Text>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="dimmed" lineClamp={1}>{p.notes || "—"}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group justify="center" gap={8}>
                                        <Button
                                            size="xs"
                                            variant="subtle"
                                            color="blue"
                                            leftSection={<IconEye size={14} />}
                                            onClick={() => handleView(p)}
                                        >
                                            View
                                        </Button>

                                        <Button
                                            size="xs"
                                            variant="light"
                                            color="green"
                                            leftSection={<IconDownload size={14} />}
                                            onClick={() => handleDownload(p)}
                                        >
                                            PDF
                                        </Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            {/* ===== VIEW MODAL ===== */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={<Text fw={700} size="lg" c="blue">Prescription Details</Text>}
                size="lg"
                centered
                overlayProps={{ blur: 3 }}
            >
                {selectedPrescription && (
                    <Stack gap="md">
                        <Group justify="space-between" className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <div>
                                <Text size="xs" c="dimmed">DOCTOR</Text>
                                <Text fw={600}>Dr. {selectedPrescription.doctorName}</Text>
                            </div>
                            <div className="text-right">
                                <Text size="xs" c="dimmed">DATE</Text>
                                <Text fw={600}>{formatDateAppShort(selectedPrescription.prescriptionDate)}</Text>
                            </div>
                        </Group>

                        <Divider label="Prescribed Medicines" labelPosition="center" />

                        {selectedMedicines[selectedPrescription.id]?.length ? (
                            <Stack gap="sm">
                                {selectedMedicines[selectedPrescription.id].map((m, index) => (
                                    <Card key={m.id || index} withBorder padding="sm" radius="md" className="hover:shadow-sm transition">
                                        <Group justify="space-between" mb={4}>
                                            <Group gap={6}>
                                                <ThemeIcon color="teal" variant="light" size="sm">
                                                    <IconPill size={14} />
                                                </ThemeIcon>
                                                <Text fw={600} size="sm">{m.name}</Text>
                                            </Group>
                                            <Badge color="blue" variant="light" size="sm">{m.dosage}</Badge>
                                        </Group>
                                        
                                        <Group gap="xl" mt="xs">
                                            <div>
                                                <Text size="xs" c="dimmed">Frequency</Text>
                                                <Text size="xs" fw={500} c="dark">
                                                    {/* ✅ Show readable frequency in UI */}
                                                    {formatFrequency(m.frequency)}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text size="xs" c="dimmed">Duration</Text>
                                                <Text size="xs" fw={500}>{m.duration} Days</Text>
                                            </div>
                                        </Group>
                                        
                                        {m.instructions && (
                                            <Text size="xs" c="dimmed" mt={4} fs="italic">
                                                Note: {m.instructions}
                                            </Text>
                                        )}
                                    </Card>
                                ))}
                            </Stack>
                        ) : (
                            <Text size="sm" c="dimmed" ta="center">No medicines found.</Text>
                        )}
                        
                        <Button fullWidth variant="outline" mt="md" onClick={() => setOpened(false)}>Close</Button>
                    </Stack>
                )}
            </Modal>
        </ScrollArea>
    );
};

export default PrescriptionRecords;