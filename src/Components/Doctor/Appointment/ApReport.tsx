import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconEye, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Toolbar } from "primereact/toolbar";
import {
  createAppointmentReport,
  getReportByPatientId,
  isReportExists,
} from "../../../Service/AppointmentService";
import { getAllMedicines } from "../../../Service/MedicineService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { formatDateAppShort } from "../../../util/DateFormat";
import { dosageFrequencies, symptoms } from "../../../Data/DoctorData"; // Removed 'tests' from here
import { medicineTypes } from "../../../Data/MedicineData";

// ✅ IMPORT LAB SERVICE
import { getAllTestTypes } from "../../../Service/LabService";

// --- Types ---
type Medicine = {
  name: string;
  medicineId: number | null | "OTHER";
  dosage: string;
  frequency: string;
  duration: number;
  route: string;
  instructions: string;
  type: string;
  prescriptionId: number;
};

type Prescription = {
  notes: string;
  medicines: Medicine[];
};

type FormValues = {
  symptoms: string[];
  tests: string[];
  diagnosis: string;
  referral: string;
  notes: string;
  prescription: Prescription[];
};

const ApReport = ({ appointment }: any) => {
  // --- State ---
  const [data, setData] = useState<any[]>([]);
  const [medicine, setMedicine] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);
  const [allowAdd, setAllowAdd] = useState(false);
  
  // ✅ NEW STATE FOR DYNAMIC LAB TESTS
  const [labTests, setLabTests] = useState<string[]>([]);

  // Filter State
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Modal State
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // --- Form ---
  const form = useForm<FormValues>({
    initialValues: {
      symptoms: [],
      tests: [],
      diagnosis: "",
      referral: "",
      notes: "",
      prescription: [
        {
          notes: "",
          medicines: [],
        },
      ],
    },
    validate: {
      symptoms: (value) => (value.length === 0 ? "Select at least one symptom" : null),
      diagnosis: (value) => (value.trim().length < 3 ? "Diagnosis is required" : null),
    },
  });

  // --- Effects ---
  useEffect(() => {
    if (appointment?.patientId && appointment?.id) {
      fetchData();
    }
  }, [appointment?.patientId, appointment?.id]);

  useEffect(() => {
    // 1. Fetch Medicines
    getAllMedicines()
      .then((res: any) => {
        setMedicine(res);
        const map: Record<number, any> = {};
        res.forEach((med: any) => (map[med.id] = med));
        setMedicineMap(map);
      })
      .catch((err) => console.error("Error fetching medicines:", err));

    // 2. ✅ FETCH LAB TESTS DYNAMICALLY FROM LAB MS
    getAllTestTypes()
      .then((res: any[]) => {
        // Backend returns objects like { id, testName, price }
        // We only need names for the dropdown
        const testNames = res.map((t) => t.testName);
        setLabTests(testNames);
      })
      .catch((err) => {
        console.error("Error fetching lab tests:", err);
        // Optional: errorNotification("Failed to load lab tests");
      });

  }, []);

  // --- API Calls ---
  const fetchData = () => {
    setLoading(true);
    getReportByPatientId(appointment.patientId)
      .then((res: any) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    isReportExists(appointment.id)
      .then((exists) => setAllowAdd(!exists))
      .catch(() => setAllowAdd(true));
  };

  const handleSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      prescription: {
        medicines: values.prescription[0].medicines.map((med) => ({
          ...med,
          medicineId: med.medicineId === "OTHER" ? null : med.medicineId,
        })),
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        appointmentId: appointment.id,
      },
    };

    setLoading(true);
    createAppointmentReport(payload)
      .then(() => {
        successNotification("Report Created Successfully!");
        form.reset();
        close(); // Close Modal
        setAllowAdd(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(err?.response?.data?.errorMessage || "Error creating report");
      })
      .finally(() => setLoading(false));
  };

  // --- Helpers ---
  const insertMedicine = () => {
    form.insertListItem("prescription.0.medicines", {
      name: "",
      medicineId: "",
      dosage: "",
      frequency: "",
      duration: 1,
      route: "",
      type: "",
      instructions: "",
      prescriptionId: 0,
    });
  };

  const removeMedicine = (index: number) => {
    form.removeListItem("prescription.0.medicines", index);
  };

  const handleChangeMed = (medId: any, index: number) => {
    if (medId === "OTHER") {
      form.setFieldValue(`prescription.0.medicines.${index}`, {
        ...form.values.prescription[0].medicines[index],
        medicineId: "OTHER",
        name: "",
        dosage: "",
        type: "",
      });
      return;
    }

    const medObj = medicineMap[Number(medId)];
    if (!medObj) return;

    form.setFieldValue(`prescription.0.medicines.${index}`, {
      ...form.values.prescription[0].medicines[index],
      medicineId: medId,
      name: medObj.name || "",
      dosage: medObj.dosage || "",
      type: medicineTypes.some((t) => t.value === (medObj.medicineType || medObj.type)?.toUpperCase())
        ? (medObj.medicineType || medObj.type)?.toUpperCase()
        : "",
    });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // --- Templates ---
  const notesBodyTemplate = (rowData: any) => (
    <span className="text-sm text-gray-600 line-clamp-2">
      {rowData.notes || "No notes"}
    </span>
  );

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex justify-center">
      <ActionIcon 
        variant="subtle" 
        color="blue" 
        onClick={() => {
            setSelectedReport(rowData);
            openViewModal();
        }}
      >
        <IconEye size={20} stroke={1.5} />
      </ActionIcon>
    </div>
  );

  const leftToolbarTemplate = () => (
    <>
      {allowAdd && (
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={open}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add New Report
        </Button>
      )}
    </>
  );

  const rightToolbarTemplate = () => (
    <TextInput
      leftSection={<IconSearch size={16} />}
      value={globalFilterValue}
      onChange={onGlobalFilterChange}
      placeholder="Search reports..."
    />
  );

  // Helper to display tests in the View Modal
  const renderTests = (testsString: string | string[]) => {
      if(!testsString) return "None";
      if(Array.isArray(testsString)) return testsString.join(", ");
      // Assuming it might be stored as JSON string in DB: "[\"CBC\", \"X-Ray\"]"
      try {
          const parsed = JSON.parse(testsString);
          if(Array.isArray(parsed)) return parsed.join(", ");
          return testsString;
      } catch(e) {
          return testsString;
      }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* TOOLBAR */}
      <Toolbar
        className="mb-4 border-0 bg-transparent p-0"
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />

      {/* DATATABLE */}
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
        globalFilterFields={["doctorName", "diagnosis", "notes"]}
        emptyMessage="No reports found."
        className="text-sm"
      >
        <Column field="doctorName" header="Doctor" sortable style={{ minWidth: "12rem" }} />
        <Column field="diagnosis" header="Diagnosis" sortable style={{ minWidth: "14rem" }} />
        <Column 
            field="createdAt" 
            header="Date" 
            sortable 
            body={(row) => formatDateAppShort(row.createdAt)} 
            style={{ minWidth: "10rem" }} 
        />
        <Column 
            field="notes" 
            header="Notes" 
            body={notesBodyTemplate} 
            style={{ minWidth: "16rem" }} 
        />
        <Column 
            header="View" 
            body={actionBodyTemplate} 
            style={{ width: "4rem", textAlign: "center" }} 
        />
      </DataTable>

      {/* CREATE REPORT MODAL */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={<Text size="lg" fw={700} c="blue">Create Medical Report</Text>} 
        size="xl" 
        centered
        overlayProps={{ blur: 3 }}
      >
        <LoadingOverlay visible={loading} />
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-6">
          
          {/* Personal Info Section */}
          <Fieldset legend="Diagnosis Details" radius="md" className="bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MultiSelect 
                    {...form.getInputProps("symptoms")} 
                    label="Symptoms" 
                    placeholder="Select symptoms" 
                    data={symptoms} 
                    withAsterisk 
                    searchable 
                />
                
                {/* ✅ UPDATED: Dynamic Tests from LabMS */}
                <MultiSelect 
                    {...form.getInputProps("tests")} 
                    label="Recommended Tests" 
                    placeholder="Select tests" 
                    data={labTests} // Using state fetched from backend
                    searchable 
                    nothingFoundMessage="No tests found. Ask Admin to add test types."
                />

                <TextInput {...form.getInputProps("diagnosis")} label="Diagnosis" placeholder="e.g. Viral Fever" withAsterisk />
                <TextInput {...form.getInputProps("referral")} label="Referral" placeholder="Refer to specialist (optional)" />
                <Textarea {...form.getInputProps("notes")} label="Doctor Notes" placeholder="Additional observations..." minRows={3} className="md:col-span-2" />
            </div>
          </Fieldset>

          {/* Prescription Section */}
          <Fieldset legend="Prescription" radius="md" className="bg-gray-50">
            <Stack gap="md">
                {form.values.prescription[0].medicines.map((med, index) => {
                    const isOther = med.medicineId === "OTHER";
                    return (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white relative">
                            <div className="absolute top-2 right-2">
                                <ActionIcon color="red" variant="subtle" onClick={() => removeMedicine(index)}>
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </div>
                            <Text fw={600} size="sm" mb="xs" c="dimmed">Medicine #{index + 1}</Text>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    {...form.getInputProps(`prescription.0.medicines.${index}.medicineId`)}
                                    label="Medicine"
                                    placeholder="Search medicine"
                                    data={[
                                        ...medicine.map((m) => ({ label: m.name, value: String(m.id) })),
                                        { label: "Other (Custom)", value: "OTHER" }
                                    ]}
                                    searchable
                                    withAsterisk
                                    onChange={(val) => handleChangeMed(val, index)}
                                />
                                {isOther && (
                                    <TextInput {...form.getInputProps(`prescription.0.medicines.${index}.name`)} label="Custom Name" withAsterisk />
                                )}
                                <TextInput {...form.getInputProps(`prescription.0.medicines.${index}.dosage`)} label="Dosage" placeholder="e.g. 500mg" withAsterisk />
                                <Select {...form.getInputProps(`prescription.0.medicines.${index}.frequency`)} label="Frequency" data={dosageFrequencies} withAsterisk />
                                <NumberInput {...form.getInputProps(`prescription.0.medicines.${index}.duration`)} label="Duration (Days)" min={1} withAsterisk />
                                <TextInput {...form.getInputProps(`prescription.0.medicines.${index}.instructions`)} label="Instructions" placeholder="e.g. After food" className="md:col-span-2" />
                            </div>
                        </div>
                    );
                })}

                {form.values.prescription[0].medicines.length === 0 && (
                    <Text c="dimmed" size="sm" ta="center">No medicines added.</Text>
                )}

                <Button variant="outline" color="blue" leftSection={<IconPlus size={16}/>} onClick={insertMedicine} className="self-center">
                    Add Medicine
                </Button>
            </Stack>
          </Fieldset>

          <Group justify="end" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button type="submit" color="green">Submit Report</Button>
          </Group>
        </form>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal opened={viewModalOpened} onClose={closeViewModal} title="Report Details" centered>
         {selectedReport && (
             <Stack>
                 <Text><b>Diagnosis:</b> {selectedReport.diagnosis}</Text>
                 
                 {/* ✅ Display Prescribed Tests */}
                 <Text><b>Tests Prescribed:</b> {renderTests(selectedReport.tests)}</Text>
                 
                 <Text><b>Notes:</b> {selectedReport.notes}</Text>
                 <Text><b>Date:</b> {formatDateAppShort(selectedReport.createdAt)}</Text>
             </Stack>
         )}
      </Modal>
    </div>
  );
};

export default ApReport;