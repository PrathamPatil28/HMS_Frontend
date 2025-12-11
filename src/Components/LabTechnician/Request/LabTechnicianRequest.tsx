import { useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { 
    Badge, Button, Card, Group, Modal, Tabs, 
    Text, TextInput, LoadingOverlay, Textarea 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFlask, IconSearch, IconUpload, IconCheck, IconTestPipe } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { addLabResult, getAllLabRequests, updateLabRequestStatus } from "../../../Service/LabService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { formatDateAppShort } from "../../../util/DateFormat";


const LabTechnicianRequest = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>("PENDING");
    
    // Result Modal
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    // Filter
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState("");

    const form = useForm({
        initialValues: {
            resultValue: "",
            reportUrl: ""
        },
        validate: {
            resultValue: (val) => (val.length < 2 ? "Result is required" : null),
        }
    });

    // Fetch Data
// Fetch Data
    const fetchData = () => {
        setLoading(true);
        getAllLabRequests()
            .then((data: any) => {
                console.log("API RESPONSE:", data);
                
                // ✅ FIX: Check if data has 'content' (Pagination) or is a direct array
                if (data.content && Array.isArray(data.content)) {
                    setRequests(data.content); // Extract array from Page object
                } else if (Array.isArray(data)) {
                    setRequests(data); // Handle fallback if it's a direct list
                } else {
                    setRequests([]); // Safety fallback
                }
            })
            .catch((err) => {
                console.error(err);
                errorNotification("Failed to fetch lab requests");
                setRequests([]); // Ensure it remains an array on error
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Actions
    const handleStatusUpdate = (id: number, status: string) => {
        setLoading(true);
        updateLabRequestStatus(id, status)
            .then(() => {
                successNotification(`Status updated to ${status}`);
                fetchData();
            })
            .catch(() => errorNotification("Update failed"))
            .finally(() => setLoading(false));
    };

    const openResultModal = (req: any) => {
        setSelectedRequest(req);
        form.reset();
        open();
    };

    const submitResult = (values: any) => {
        if (!selectedRequest) return;
        setLoading(true);
        const payload = {
            requestId: selectedRequest.id,
            resultValue: values.resultValue,
            reportUrl: values.reportUrl || "Generated-Internal-URL"
        };
        
        addLabResult(payload)
            .then(() => {
                successNotification("Result Uploaded & Patient Notified");
                close();
                fetchData();
            })
            .catch(() => errorNotification("Failed to upload result"))
            .finally(() => setLoading(false));
    };

    // Filter data based on Tab
 // Filter data based on Tab
    // ✅ Safety check: Ensure requests is an array before filtering
    const filteredData = Array.isArray(requests) ? requests.filter(r => {
        if (activeTab === "PENDING") return r.status === "PENDING";
        if (activeTab === "IN_PROGRESS") return r.status === "SAMPLE_COLLECTED" || r.status === "IN_PROGRESS";
        if (activeTab === "COMPLETED") return r.status === "COMPLETED";
        return true;
    }) : [];

    // Table Templates
    const statusBody = (rowData: any) => {
        const colors: any = { PENDING: 'orange', SAMPLE_COLLECTED: 'blue', COMPLETED: 'green' };
        return <Badge color={colors[rowData.status] || 'gray'}>{rowData.status}</Badge>;
    };

    const actionBody = (rowData: any) => {
        if (rowData.status === "PENDING") {
            return (
                <Button 
                    size="xs" color="blue" variant="light" 
                    leftSection={<IconTestPipe size={14}/>}
                    onClick={() => handleStatusUpdate(rowData.id, "SAMPLE_COLLECTED")}
                >
                    Collect Sample
                </Button>
            );
        }
        if (rowData.status === "SAMPLE_COLLECTED" || rowData.status === "IN_PROGRESS") {
            return (
                <Button 
                    size="xs" color="teal" 
                    leftSection={<IconUpload size={14}/>}
                    onClick={() => openResultModal(rowData)}
                >
                    Upload Result
                </Button>
            );
        }
        return <IconCheck color="green" />;
    };

    return (
        <div className="p-6">
            <Group mb="lg">
                <IconFlask size={32} className="text-teal-600"/>
                <Text size="xl" fw={700}>Lab Management</Text>
            </Group>

            <Card withBorder radius="md" p="md">
                <Group justify="space-between" mb="md">
                    <Tabs value={activeTab} onChange={setActiveTab} color="teal">
                        <Tabs.List>
                            <Tabs.Tab value="PENDING">Pending Requests</Tabs.Tab>
                            <Tabs.Tab value="IN_PROGRESS">Processing</Tabs.Tab>
                            <Tabs.Tab value="COMPLETED">Completed</Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                    <TextInput 
                        placeholder="Search..." 
                        leftSection={<IconSearch size={14}/>}
                        value={globalFilterValue}
                        onChange={(e) => {
                            setGlobalFilterValue(e.target.value);
                            setFilters({ global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS } });
                        }}
                    />
                </Group>

                <DataTable value={filteredData} filters={filters} paginator rows={10} stripedRows loading={loading}>
                    <Column field="id" header="ID" sortable style={{width:'80px'}}/>
                    <Column field="testName" header={<span style={{fontWeight:700}}>Test Name</span>} sortable />
                    <Column field="patientId" header="Patient ID" sortable />
                    {/* Note: You might want to fetch Patient Name via ID if not in DTO */}
                    <Column field="requestDate" header="Date" body={(r)=>formatDateAppShort(r.requestDate)} sortable />
                    <Column header="Status" body={statusBody} />
                    <Column header="Result" field="resultValue" style={{maxWidth:'200px'}} />
                    <Column header="Action" body={actionBody} />
                </DataTable>
            </Card>

            {/* Upload Result Modal */}
            <Modal opened={opened} onClose={close} title="Upload Lab Result" centered>
                <form onSubmit={form.onSubmit(submitResult)}>
                    <LoadingOverlay visible={loading}/>
                    <Text size="sm" c="dimmed" mb="md">
                        Test: <b>{selectedRequest?.testName}</b> (ID: {selectedRequest?.id})
                    </Text>
                    
                    <Textarea 
                        label="Result / Observation"
                        placeholder="e.g. Hemoglobin 14.5 g/dL - Normal"
                        minRows={4}
                        withAsterisk
                        {...form.getInputProps("resultValue")}
                        mb="md"
                    />

                    <TextInput 
                        label="Report URL (Optional)"
                        placeholder="http://..."
                        {...form.getInputProps("reportUrl")}
                        mb="lg"
                    />

                    <Button fullWidth type="submit" color="teal">Submit Report</Button>
                </form>
            </Modal>
        </div>
    );
};

export default LabTechnicianRequest;