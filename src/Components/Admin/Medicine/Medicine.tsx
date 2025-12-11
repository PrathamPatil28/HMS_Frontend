import {
  ActionIcon,
  Badge,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconPill, IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  errorNotification,
  successNotification,
} from "../../../util/NotificationUtil";
import { useEffect, useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable"; // Import PageEvent
import { Column } from "primereact/column";
import { formatDateDDMMYYYY } from "../../../util/DateFormat";
import {
  addMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} from "../../../Service/MedicineService";
import { medicineCategories, medicineTypes } from "../../../Data/MedicineData";
import { capitalizeFirstLetter } from "../../../util/OtherUtility";
import { useDisclosure } from "@mantine/hooks";
import { Toolbar } from "primereact/toolbar";

type MedicineFormValues = {
  id?: number;
  name: string;
  dosage: string;
  medicineType: string;
  medicineCategory: string;
  manufacturer: string;
  unitPrice: number | "";
};

const Medicine = () => {
  // Data State
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ Pagination State
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 0
  });

  // Modal State
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<MedicineFormValues>({
    initialValues: {
      name: "",
      dosage: "",
      medicineType: "",
      medicineCategory: "",
      manufacturer: "",
      unitPrice: "",
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? "Min 2 characters" : null),
      dosage: (value) => (value.trim().length === 0 ? "Required" : null),
      medicineType: (value) => (!value ? "Select Type" : null),
      unitPrice: (value) => (!value || value <= 0 ? "Invalid Price" : null),
    },
  });

  useEffect(() => {
    fetchData();
  }, [lazyParams]); // Refetch when pagination changes

  const fetchData = () => {
    setLoading(true);
    // Call API with current page and size
    getAllMedicines(lazyParams.page, lazyParams.rows)
      .then((res: any) => {
        setData(res.content);          // Set the list for current page
        setTotalRecords(res.totalElements); // Set total count for paginator
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // ✅ Handle Page Change Event from DataTable
  const onPage = (event: DataTablePageEvent) => {
    setLazyParams({
        first: event.first,
        rows: event.rows,
        page: event.page || 0
    });
  };

  // --- Actions ---

  const handleAdd = () => {
    setIsEditMode(false);
    form.reset();
    open();
  };

  const handleEdit = (rowData: any) => {
    setIsEditMode(true);
    form.setValues({
      id: rowData.id,
      name: rowData.name,
      dosage: rowData.dosage,
      medicineType: rowData.medicineType,
      medicineCategory: rowData.medicineCategory,
      manufacturer: rowData.manufacturer,
      unitPrice: rowData.unitPrice,
    });
    open();
  };

  const handleDeleteClick = (rowData: any) => {
    setSelectedMedicine(rowData);
    openDelete();
  };

  const confirmDelete = () => {
    if (!selectedMedicine?.id) return;
    setLoading(true);
    deleteMedicine(selectedMedicine.id)
      .then(() => {
        successNotification("Medicine Deleted");
        fetchData();
        closeDelete();
      })
      .catch(() => errorNotification("Delete Failed"))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: MedicineFormValues) => {
    setLoading(true);
    const apiCall = isEditMode ? updateMedicine : addMedicine;

    apiCall(values)
      .then(() => {
        successNotification(isEditMode ? "Medicine Updated" : "Medicine Added");
        close();
        fetchData(); // Reload current page
      })
      .catch((err: any) => {
        errorNotification(err?.response?.data?.errorMessage || "Operation Failed");
      })
      .finally(() => setLoading(false));
  };

  // --- Templates ---

  const leftToolbarTemplate = () => (
    <Button
      leftSection={<IconPill size={18} />}
      onClick={handleAdd}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Add Medicine
    </Button>
  );

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex gap-2 justify-center">
      <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(rowData)}>
        <IconEdit size={18} stroke={1.5} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(rowData)}>
        <IconTrash size={18} stroke={1.5} />
      </ActionIcon>
    </div>
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TABLET": return "blue";
      case "CAPSULE": return "cyan";
      case "SYRUP": return "pink";
      case "INJECTION": return "red";
      case "OINTMENT": return "orange";
      case "CREAM": return "yellow";
      case "DROPS": return "indigo";
      case "SPRAY": return "violet";
      case "POWDER": return "gray";
      case "LIQUID": return "teal";
      default: return "gray";
    }
  };

  const typeBodyTemplate = (rowData: any) => (
      <Badge 
          variant="light" 
          color={getTypeColor(rowData.medicineType)} 
          size="sm"
          radius="sm"
      >
          {capitalizeFirstLetter(rowData.medicineType)}
      </Badge>
  );

  const priceBodyTemplate = (rowData: any) => (
      <span className="font-semibold text-slate-700">₹{rowData.unitPrice}</span>
  );

  const stockBodyTemplate = (rowData: any) => (
      <span className={`font-bold ${rowData.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
          {rowData.stock}
      </span>
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <Toolbar
        className="mb-4 border-0 bg-transparent p-0"
        start={leftToolbarTemplate}
      />

      <DataTable
        value={data}
        lazy={true} // ✅ Enables Server-Side Pagination
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        paginator
        rowsPerPageOptions={[10, 25, 50]}
        stripedRows
        size="small"
        dataKey="id"
        emptyMessage="No medicines found."
        className="text-sm"
      >
        <Column field="name" header="Name" style={{ minWidth: "12rem", fontWeight: "600" }} />
        <Column field="dosage" header="Dosage" style={{ minWidth: "8rem" }} />
        <Column field="medicineType" header="Type" body={typeBodyTemplate} style={{ minWidth: "10rem" }} />
        <Column field="category" header="Category" body={(r) => capitalizeFirstLetter(r.medicineCategory)} style={{ minWidth: "10rem" }} />
        <Column field="manufacturer" header="Manufacturer" style={{ minWidth: "12rem" }} />
        <Column field="stock" header="Stock" body={stockBodyTemplate} style={{ minWidth: "6rem", textAlign: "center" }} />
        <Column field="unitPrice" header="Price" body={priceBodyTemplate} style={{ minWidth: "8rem" }} />
        <Column
          field="createdAt"
          header="Added On"
          body={(r) => formatDateDDMMYYYY(r.createdAt)}
          style={{ minWidth: "10rem" }}
        />
        <Column header="Actions" body={actionBodyTemplate} style={{ width: "6rem", textAlign: "center" }} />
      </DataTable>

      {/* Add/Edit Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={<Text size="lg" fw={700} c="blue">{isEditMode ? "Edit Medicine" : "Add Medicine"}</Text>} 
        centered
        overlayProps={{ blur: 3 }}
      >
        <LoadingOverlay visible={loading} />
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
          <TextInput label="Medicine Name" placeholder="e.g. Paracetamol" withAsterisk {...form.getInputProps("name")} />
          
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Dosage" placeholder="e.g. 500mg" withAsterisk {...form.getInputProps("dosage")} />
            <NumberInput label="Price (₹)" placeholder="0.00" min={0} withAsterisk {...form.getInputProps("unitPrice")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" data={medicineTypes} placeholder="Select type" withAsterisk {...form.getInputProps("medicineType")} />
            <Select label="Category" data={medicineCategories} placeholder="Select category" {...form.getInputProps("medicineCategory")} />
          </div>

          <TextInput label="Manufacturer" placeholder="Company Name" {...form.getInputProps("manufacturer")} />

          <Button type="submit" fullWidth color="green" mt="md">
            {isEditMode ? "Save Changes" : "Add Medicine"}
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteModalOpened} onClose={closeDelete} title="Confirm Delete" centered size="sm">
        <Text size="sm">
          Are you sure you want to delete <b>{selectedMedicine?.name}</b>? This action cannot be undone.
        </Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={confirmDelete} loading={loading}>Delete</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default Medicine;