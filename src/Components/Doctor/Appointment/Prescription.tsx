import { ActionIcon, Badge, Box, Button, Card, Divider, Group, Modal, Stack, Text, TextInput, ThemeIcon } from "@mantine/core";
import { IconActivity, IconClock, IconEye, IconInfoCircle, IconMedicineSyrup, IconPill, IconRoute, IconSearch } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { getPrescriptionByPatientId } from "../../../Service/AppointmentService";
import { formatDateAppShort } from "../../../util/DateFormat";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Toolbar } from "primereact/toolbar";

const Prescription = ({ appointment }: any) => {
    const [data, setData] = useState<any[]>([]);
    const navigate = useNavigate();

    const [opened, { open, close }] = useDisclosure(false);
    const [medicineData, setMedicineData] = useState<any[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        if (!appointment?.patientId) return;

        getPrescriptionByPatientId(appointment.patientId)
            .then((res: any) => {
                setData(res);
                // console.log("Prescription Data", res);
            })
            .catch((err: any) => {
                console.error("Error fetching prescription data: ", err);
            });
    }, [appointment?.patientId]);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters: any = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const rightToolbarTemplate = () => (
        <TextInput
            leftSection={<IconSearch size={16} />}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search prescriptions..."
        />
    );

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div className='flex gap-2 justify-center'>
                <ActionIcon 
                    variant="subtle" 
                    color="blue" 
                    onClick={() => navigate("/doctor/appointment/" + rowData.appointmentId)}
                    title="View Appointment"
                >
                    <IconEye size={20} stroke={1.5} />
                </ActionIcon>

                <ActionIcon 
                    variant="subtle" 
                    color="teal"  
                    onClick={() => handleMedicine(rowData.medicines)}
                    title="View Medicines"
                >
                    <IconMedicineSyrup size={20} stroke={1.5} />
                </ActionIcon>
            </div>
        );
    };

    const handleMedicine = (medicines: any[]) => {
        setMedicineData(medicines);
        open();
    }

    const getReadableFrequency = (freq: string) => {
        if (!freq) return "N/A";
        const parts = freq.split("-");
        const times = ["Morn", "Noon", "Night"]; // Shortened for cleaner UI
        return (
            <Group gap="xs">
                {parts.map((val, i) => (
                    <Badge 
                        key={i} 
                        size="sm" 
                        variant={val === "1" ? "filled" : "outline"} 
                        color={val === "1" ? "teal" : "gray"}
                    >
                        {times[i]}
                    </Badge>
                ))}
            </Group>
        );
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Toolbar */}
            <Toolbar
                className="mb-4 border-0 bg-transparent p-0"
                end={rightToolbarTemplate}
            />

            {/* DataTable */}
            <DataTable 
                stripedRows 
                value={data} 
                size="small" 
                paginator 
                rows={5}
                rowsPerPageOptions={[5, 10, 25]} 
                dataKey="id"
                filters={filters} 
                filterDisplay="menu" 
                globalFilterFields={['doctorName', 'notes']}
                emptyMessage="No prescriptions found."
                className="text-sm"
            >
                <Column field="doctorName" header="Doctor" sortable style={{ minWidth: '12rem' }} />
                
                <Column 
                    field='prescriptionDate' 
                    header="Date" 
                    sortable 
                    body={(rowData) => formatDateAppShort(rowData.prescriptionDate)} 
                    style={{ minWidth: '10rem' }}
                />

                <Column 
                    field="medicine" 
                    header="Medicines" 
                    sortable 
                    body={(rowData) => (
                        <Badge color="blue" variant="light">
                            {rowData.medicines?.length ?? 0} Items
                        </Badge>
                    )} 
                    style={{ minWidth: '8rem' }} 
                />

                <Column field="notes" header="Notes" sortable style={{ minWidth: '14rem' }} />

                <Column 
                    header="Actions" 
                    body={actionBodyTemplate} 
                    style={{ width: '6rem', textAlign: 'center' }} 
                />
            </DataTable>

            {/* Medicines Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap="xs">
                        <ThemeIcon color="teal" variant="light" size="lg">
                            <IconPill size={20} />
                        </ThemeIcon>
                        <Text fw={700} size="lg" c="teal">Prescribed Medicines</Text>
                    </Group>
                }
                size="lg"
                centered
                overlayProps={{ blur: 3 }}
            >
                {medicineData.length > 0 ? (
                    <Stack gap="md">
                        {medicineData.map((medicine: any, index: number) => (
                            <Card
                                key={index}
                                padding="md"
                                radius="md"
                                withBorder
                                className="bg-gray-50 hover:bg-white transition-all duration-200 hover:shadow-md border-gray-200"
                            >
                                {/* Header: Name & Type */}
                                <Group justify="space-between" mb="xs">
                                    <Group gap="xs">
                                        <Text fw={700} size="md" c="dark">{medicine.name}</Text>
                                        <Badge size="sm" variant="outline" color="gray">{medicine.dosage}</Badge>
                                    </Group>
                                    <Badge color="blue" variant="filled" size="sm">
                                        {medicine.type}
                                    </Badge>
                                </Group>

                                <Divider my="xs" color="gray.2" />

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                    
                                    <div className="flex items-center gap-2">
                                        <IconClock size={16} className="text-indigo-500" />
                                        <span className="text-gray-500 font-medium">Duration:</span>
                                        <span className="font-semibold">{medicine.duration} Days</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <IconRoute size={16} className="text-violet-500" />
                                        <span className="text-gray-500 font-medium">Route:</span>
                                        <span className="font-semibold">{medicine.route}</span>
                                    </div>

                                    <div className="col-span-2 flex items-start gap-2">
                                        <IconActivity size={16} className="text-teal-500 mt-1" />
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 font-medium mb-1">Frequency:</span>
                                            {getReadableFrequency(medicine.frequency)}
                                        </div>
                                    </div>

                                    {medicine.instructions && (
                                        <div className="col-span-2 flex items-start gap-2 bg-blue-50 p-2 rounded-md mt-1">
                                            <IconInfoCircle size={16} className="text-blue-600 mt-0.5" />
                                            <Text size="sm" c="blue.8">
                                                <span className="font-bold">Instruction:</span> {medicine.instructions}
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Box ta="center" py="xl">
                        <Text c="dimmed">No medicines found in this prescription.</Text>
                    </Box>
                )}
                
                <Group justify="end" mt="lg">
                    <Button onClick={close} variant="default">Close</Button>
                </Group>
            </Modal>
        </div>
    )
}

export default Prescription;