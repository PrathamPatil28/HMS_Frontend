import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  LoadingOverlay,
  NumberInput,
  Select,
  SelectProps,
  Text,
  TextInput,
  Group,
  Badge,
  Card,
  Title,
  Stack,
  SimpleGrid,
  ThemeIcon
} from "@mantine/core";
import { 
  IconEdit, 
  IconSearch, 
  IconPackage, 
  IconCheck, 
  IconArrowLeft, 
  IconCalendar,
  IconHash,
  IconClipboardList
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  errorNotification,
  successNotification,
} from "../../../util/NotificationUtil";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { formatDateDDMMYYYY } from "../../../util/DateFormat";
import { convertArrayToDate } from "../../../util/OtherUtility";
import { addStock, getAllStocks, updateStock } from "../../../Service/InventoryService";
import { DatePickerInput } from "@mantine/dates";
import { stockStatusOptions } from "../../../Data/InventoryData";
import { getAllMedicines } from "../../../Service/MedicineService";
import { Toolbar } from "primereact/toolbar";

type StockFormValues = {
  id?: number;
  medicineId: string;
  batchNo: string;
  quantity: number | "";
  expiryDate: Date | null;
  initialQuantity: number | "";
  status: string;
};

const Stock = () => {
  // Data State
  const [data, setData] = useState<any[]>([]);
  const [medicine, setMedicine] = useState<any[]>([]);
  const [_medicineMap, setMedicineMap] = useState<Record<number, any>>({});
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Filter State
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const form = useForm<StockFormValues>({
    initialValues: {
      medicineId: "",
      batchNo: "",
      quantity: "",
      expiryDate: null,
      initialQuantity: "",
      status: "ACTIVE",
    },
    validate: {
      medicineId: (value) => (!value ? "Medicine is required" : null),
      batchNo: (value) => (value.trim().length < 2 ? "Batch No must be valid" : null),
      quantity: (value) => (!value || value <= 0 ? "Invalid Quantity" : null),
      expiryDate: (value) => (!value ? "Expiry Date Required" : null),
    },
  });

  // --- API Calls ---

  const fetchData = () => {
    setLoading(true);
    getAllStocks()
      .then((res: any) =>{
        console.log("stock data",res);
        setData(res);
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };
useEffect(() => {
    // 👇 CHANGE THIS LINE: Pass page 0 and a large size (e.g., 1000)
    getAllMedicines(0, 1000) 
      .then((res: any) => {
        console.log("Medicine API Response:", res);
        
        // Handle paginated response structure
        const medicineList = res.content ? res.content : res;

        if (Array.isArray(medicineList)) {
            setMedicine(medicineList);
            
            // Map logic (optional if you implemented the backend DTO fix, 
            // but required for the dropdown to work correctly)
            const map: Record<number, any> = {};
            medicineList.forEach((med: any) => (map[med.id] = med));
            setMedicineMap(map);
        } else {
            console.error("Expected array but got:", res);
            setMedicine([]); 
        }
      })
      .catch((err: any) => {
          console.error(err);
          setMedicine([]);
      });

    fetchData();
  }, []);

  // --- Actions ---

  const handleAdd = () => {
    setIsEditMode(false);
    form.reset();
    form.setValues({ status: "ACTIVE" });
    setIsFormOpen(true);
  };

  const handleEdit = (rowData: any) => {
    setIsEditMode(true);
    form.setValues({
      id: rowData.id,
      medicineId: rowData.medicineId.toString(),
      batchNo: rowData.batchNo,
      quantity: rowData.quantity,
      initialQuantity: rowData.initialQuantity || "",
      expiryDate: convertArrayToDate(rowData.expiryDate),
      status: rowData.status,
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    form.reset();
  };

  const handleSubmit = (values: StockFormValues) => {
    const payload = {
      ...values,
      medicineId: Number(values.medicineId),
    };
    const method = isEditMode ? updateStock : addStock;

    setLoading(true);
    method(payload)
      .then(() => {
        successNotification(`Stock ${isEditMode ? "Updated" : "Added"} Successfully!`);
        setIsFormOpen(false);
        fetchData();
      })
      .catch((err: any) => {
        errorNotification(err?.response?.data?.errorMessage || "Operation Failed");
      })
      .finally(() => setLoading(false));
  };

  // --- Templates & Renderers ---

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const leftToolbarTemplate = () => (
    <Button
      leftSection={<IconPackage size={18} />}
      onClick={handleAdd}
      className="bg-blue-600 hover:bg-blue-700 text-white"
      radius="md"
    >
      Add Stock
    </Button>
  );

  const rightToolbarTemplate = () => (
    <TextInput
      leftSection={<IconSearch size={16} />}
      value={globalFilterValue}
      onChange={onGlobalFilterChange}
      placeholder="Search stock..."
      radius="md"
    />
  );

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex justify-center">
      <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(rowData)}>
        <IconEdit size={18} stroke={1.5} />
      </ActionIcon>
    </div>
  );

const medicineBodyTemplate = (rowData: any) => (
  <div className="flex gap-2 items-center">
      {/* Read directly from the new DTO fields */}
      <Text fw={600} size="sm">{rowData.medicineName}</Text>
      <Text c="dimmed" size="xs">({rowData.manufacturer})</Text>
  </div>
);

  const statusBodyTemplate = (rowData: any) => {
    const expiry = rowData?.expiryDate ? new Date(rowData.expiryDate) : null;
    const isExpired = expiry ? expiry < new Date() : false;
    return (
        <Badge 
            color={isExpired ? "red" : rowData?.status === "ACTIVE" ? "green" : "gray"} 
            variant="light"
        >
            {isExpired ? "Expired" : rowData?.status}
        </Badge>
    );
  };

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }: any) => (
    <Group flex="1" gap="xs">
        <div className="flex gap-2">
            <Text size="sm">{option.label}</Text>
            {option.manufacturer && (
                <Text size="xs" c="dimmed" fs="italic">({option.manufacturer})</Text>
            )}
        </div>
        {checked && <IconCheck style={{ marginInlineStart: "auto" }} size={16} />}
    </Group>
  );

  // ================= RENDER =================

  return (
    <div className="p-4">
      {!isFormOpen ? (
        // --- LIST VIEW ---
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <Toolbar
            className="mb-4 border-0 bg-transparent p-0"
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          />

          <DataTable
            stripedRows
            value={data}
            size="small"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={["batchNo", "status"]}
            emptyMessage="No stock records found."
            className="text-sm"
          >
            <Column field="medicineId" header="Medicine" body={medicineBodyTemplate} sortable style={{ minWidth: "14rem" }} />
            <Column field="batchNo" header="Batch No" sortable style={{ minWidth: "10rem" }} />
            <Column field="quantity" header="Qty" sortable style={{ minWidth: "8rem" }} />
            <Column field="initialQuantity" header="Initial Qty" style={{ minWidth: "8rem" }} />
            <Column 
                field="expiryDate" 
                header="Expiry Date" 
                sortable 
                body={(row) => formatDateDDMMYYYY(row.expiryDate)} 
                style={{ minWidth: "10rem" }} 
            />
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: "10rem" }} />
            <Column header="Actions" body={actionBodyTemplate} style={{ width: "6rem", textAlign: "center" }} />
          </DataTable>
        </div>
      ) : (
        // --- FORM VIEW (NO MODAL) ---
        <div className="max-w-4xl mx-auto">
            <Button 
                variant="subtle" 
                color="gray" 
                leftSection={<IconArrowLeft size={18}/>} 
                onClick={handleCancel}
                className="mb-4"
            >
                Back to Stock List
            </Button>

            <Card withBorder shadow="sm" radius="md" padding="xl" className="bg-white">
                <LoadingOverlay visible={loading} />
                
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <Group>
                        <ThemeIcon variant="light" size="xl" radius="md" color="blue">
                            <IconPackage size={24} />
                        </ThemeIcon>
                        <div>
                            <Title order={3} className="text-slate-700">{isEditMode ? "Update Stock Details" : "Add New Stock"}</Title>
                            <Text c="dimmed" size="sm">Fill in the details below to update inventory.</Text>
                        </div>
                    </Group>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        
                        {/* Medicine Selection */}
                        <Select
                            label="Select Medicine"
                            placeholder="Search medicine by name"
                            data={medicine.map((med) => ({
                                value: med.id.toString(),
                                label: med.name,
                                manufacturer: med.manufacturer
                            }))}
                            searchable
                            renderOption={renderSelectOption}
                            withAsterisk
                            size="md"
                            {...form.getInputProps("medicineId")}
                        />

                        {/* Batch & Dates */}
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput 
                                label="Batch Number" 
                                placeholder="e.g. B102X" 
                                withAsterisk 
                                leftSection={<IconHash size={16} />}
                                size="md"
                                {...form.getInputProps("batchNo")} 
                            />
                            <DatePickerInput 
                                label="Expiry Date" 
                                placeholder="Pick date" 
                                minDate={new Date()} 
                                withAsterisk 
                                leftSection={<IconCalendar size={16} />}
                                size="md"
                                {...form.getInputProps("expiryDate")} 
                            />
                        </SimpleGrid>

                        {/* Quantities & Status */}
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <NumberInput 
                                label="Available Quantity" 
                                placeholder="0" 
                                min={1} 
                                clampBehavior="strict" 
                                withAsterisk 
                                leftSection={<IconClipboardList size={16} />}
                                size="md"
                                {...form.getInputProps("quantity")} 
                            />
                            <Select 
                                label="Status" 
                                data={stockStatusOptions} 
                                withAsterisk 
                                size="md"
                                {...form.getInputProps("status")} 
                            />
                        </SimpleGrid>
                        
                        {/* Action Buttons */}
                        <Group justify="flex-end" mt="xl">
                            <Button variant="default" size="md" onClick={handleCancel}>Cancel</Button>
                            <Button type="submit" color="green" size="md" px={30}>
                                {isEditMode ? "Save Changes" : "Add Stock"}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default Stock;