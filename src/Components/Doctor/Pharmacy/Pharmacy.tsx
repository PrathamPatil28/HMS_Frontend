import { useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { 
  Badge, 
  Card, 
  Group, 
  Text, 
  TextInput, 
  Title, 
  LoadingOverlay, 
  ThemeIcon, 
  Stack 
} from "@mantine/core";
import { 
  IconSearch, 
  IconPackage, 
  IconAlertCircle, 
  IconCalendar, 
  IconTag 
} from "@tabler/icons-react";
import { getAllStocks } from "../../../Service/InventoryService";
import { getAllMedicines } from "../../../Service/MedicineService";
import { capitalizeFirstLetter } from "../../../util/OtherUtility";
import { formatDateDDMMYYYY } from "../../../util/DateFormat"; // Assuming this exists, or use standard JS

const Pharmacy = () => {
    const [stocks, setStocks] = useState<any[]>([]);
    const [medicineMap, setMedicineMap] = useState<Record<number, any>>({});
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [meds, stockData] = await Promise.all([
                    getAllMedicines(),
                    getAllStocks()
                ]);

                // Create Medicine Map for O(1) lookup
                const map: Record<number, any> = {};
                meds.forEach((med: any) => (map[med.id] = med));
                setMedicineMap(map);
                
                setStocks(stockData);
            } catch (error) {
                console.error("Error loading pharmacy data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters: any = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // --- Column Templates ---

    const medicineBodyTemplate = (rowData: any) => {
        const med = medicineMap[rowData.medicineId];
        return (
            <Group gap="sm">
                <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                    <IconPackage size={20} />
                </ThemeIcon>
                <div className="flex items-center gap-2">
                    <Text fw={600} size="sm" c="dark">{med?.name || "Unknown"}</Text>
                    <Text size="xs" c="dimmed">({med?.manufacturer || "N/A"} • {med?.dosage || ""})</Text>
                </div>
            </Group>
        );
    };

    const quantityBodyTemplate = (rowData: any) => {
        const isLowStock = rowData.quantity < 10;
        return (
            <div className="flex items-center gap-2">
                <Text fw={700} size="sm" c={isLowStock ? "red" : "dark"}>
                    {rowData.quantity}
                </Text>
                {isLowStock && (
                    <ThemeIcon color="red" variant="transparent" size="xs">
                        <IconAlertCircle />
                    </ThemeIcon>
                )}
            </div>
        );
    };

    const batchBodyTemplate = (rowData: any) => (
        <Badge variant="outline" color="blue" size="sm" leftSection={<IconTag size={10} />}>
            {rowData.batchNo}
        </Badge>
    );

    const expiryDateTemplate = (rowData: any) => (
        <Group gap={6}>
            <IconCalendar size={14} className="text-gray-500" />
            <Text size="sm">{formatDateDDMMYYYY(rowData.expiryDate)}</Text>
        </Group>
    );

    const statusBody = (rowData: any) => {
        const expiry = rowData?.expiryDate ? new Date(rowData.expiryDate) : null;
        const isExpired = expiry ? expiry < new Date() : false;
        const isActive = rowData?.status === "ACTIVE";
        
        return (
            <Badge 
                color={isExpired ? "red" : isActive ? "teal" : "gray"} 
                variant="light"
            >
                {isExpired ? "Expired" : capitalizeFirstLetter(rowData?.status || "Unknown")}
            </Badge>
        );
    };

    return (
        <div className="p-5">
            {/* Header Section */}
            <Group justify="space-between" mb="lg">
                <div>
                    <Title order={2} className="text-slate-700">Pharmacy Inventory</Title>
                    <Text c="dimmed" size="sm">Manage medicine stock and expiry details</Text>
                </div>
            </Group>

            <Card padding="lg" radius="md" shadow="sm" withBorder>
                <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

                {/* Toolbar / Search */}
                <Group justify="space-between" mb="md">
                    <Text fw={600} size="lg" c="dimmed">Stock List</Text>
                    <TextInput
                        leftSection={<IconSearch size={16} />}
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Search medicine, batch..."
                        radius="md"
                        style={{ width: 300 }}
                    />
                </Group>

                {/* Data Table */}
                <DataTable
                    value={stocks}
                    stripedRows
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    dataKey="id"
                    filters={filters}
                    globalFilterFields={["batchNo", "quantity"]}
                    emptyMessage={
                        <Stack align="center" py="xl">
                            <IconPackage size={40} className="text-gray-300"/>
                            <Text c="dimmed">No stock records found.</Text>
                        </Stack>
                    }
                    className="text-sm"
                    pt={{
                        thead: { className: 'bg-gray-50' },
                        headerRow: { className: 'text-slate-600' }
                    }}
                >
                    <Column 
                        header="Medicine Details" 
                        body={medicineBodyTemplate} 
                        sortable 
                        field="medicineId" 
                        style={{ minWidth: '16rem' }}
                    />
                    <Column 
                        field="batchNo" 
                        header="Batch No" 
                        body={batchBodyTemplate} 
                        style={{ minWidth: '8rem' }}
                    />
                    <Column 
                        field="quantity" 
                        header="Qty" 
                        sortable 
                        body={quantityBodyTemplate} 
                        style={{ minWidth: '8rem' }}
                    />
                    <Column 
                        field="expiryDate" 
                        header="Expiry Date" 
                        sortable 
                        body={expiryDateTemplate} 
                        style={{ minWidth: '10rem' }}
                    />
                    <Column 
                        field="status" 
                        header="Status" 
                        body={statusBody} 
                        sortable 
                        style={{ minWidth: '8rem' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
};

export default Pharmacy;