import React, { useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  SelectProps,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Badge,
  SimpleGrid,
  Paper,
  Title,
  ScrollArea
} from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from '@mantine/spotlight';
import { 
  IconCheck, 
  IconEye, 
  IconPill, 
  IconPlus, 
  IconReceipt2, 
  IconSearch, 
  IconTag, 
  IconTrash, 
  IconUpload, 
  IconUser, 
  IconPhone,
  IconArrowLeft,
  IconShoppingCart,
  IconCalculator
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Toolbar } from "primereact/toolbar";
import { getAllMedicines } from "../../../Service/MedicineService";
import { createSale, getAllSales, getSaleItems } from "../../../Service/SaleService";
import { getAllPrescription, getMedicineByPrescriptionId } from "../../../Service/AppointmentService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { formatDateDDMMYYYY, formatDateManually } from "../../../util/DateFormat";
import { frequenciesMap } from "../../../Data/DoctorData";

interface SaleItem {
  medicineId: any;
  quantity: number
}

const Sales = () => {
  // --- State ---
  const [view, setView] = useState<'list' | 'form'>('list');
  const [data, setData] = useState<any[]>([]);
  const [medicine, setMedicine] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);
  
  // Details Modal
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [sellItem, setSellItem] = useState<any[]>([]);
  
  // Spotlight & Filters
  const [actions, setActions] = useState<SpotlightActionData[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // --- Form Setup ---
  const form = useForm({
    initialValues: {
      buyerName: '',
      contactNumber: '',
      patientId: null, // ✅ Stores patient ID
      saleItem: [
        { medicineId: "", quantity: 1 }
      ] as SaleItem[],
    },
    validate: {
      buyerName: (value) => (value.length < 2 ? "Buyer name is required" : null),
      contactNumber: (value) => (value.length < 10 ? "Valid contact number required" : null),
      saleItem: {
        medicineId: (value) => (!value ? "Medicine is required" : null),
        quantity: (value) => (!value || value <= 0 ? "Quantity must be positive" : null),
      }
    },
  });

  // --- Effects ---
  useEffect(() => {
    fetchData();
    fetchMedicines();
    fetchPrescriptions();
  }, []);

  // --- API Calls ---
  const fetchData = () => {
    setLoading(true);
    getAllSales()
      .then((res: any) => setData(res))
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchMedicines = () => {
    getAllMedicines().then((res: any) => {
        setMedicine(res);
        const map: Record<number, any> = {};
        res.forEach((med: any) => { map[med.id] = med; });
        setMedicineMap(map);
    });
  };

  const fetchPrescriptions = () => {
    getAllPrescription().then((res: any) => {
        setActions(res.map((item: any) => ({
          id: String(item.id),
          label: item.patientName,
          description: `Dr. ${item.doctorName} • ${formatDateDDMMYYYY(item.prescriptionDate)}`,
          onClick: () => handleImport(item)
        })));
    });
  };

  // --- Handlers ---

  const handleImport = (item: any) => {
    setLoading(true);
    getMedicineByPrescriptionId(item.id)
      .then((res: any) => {
        setView('form'); // Switch to form view
        form.setValues({
          buyerName: item.patientName,
          contactNumber: item.patientPhone || '',
          patientId: item.patientId, // ✅ Capture Patient ID
          saleItem: res.filter((x: any) => x.medicineId != null).map((x: any) => ({
            medicineId: String(x.medicineId),
            quantity: calculateQuantity(x.frequency, x.duration)
          }))
        });
        successNotification("Prescription Imported");
      })
      .catch(() => errorNotification("Failed to import prescription"))
      .finally(() => setLoading(false));
  }

  const calculateQuantity = (frq: string, duration: number) => { 
      const freqValues = frequenciesMap[frq] || 1;
      return Math.ceil(freqValues * duration);
  }

  const handleSubmit = (values: any) => {
    let flag = false;
     values.saleItem.forEach((item: any, index: number) => {
        if(item.quantity > (medicineMap[item.medicineId]?.stock || 0)){
           flag =true;
           form.setFieldError(`saleItem.${index}.quantity`, 'Exceeds available stock');
        }
     });
     
     if(flag) return;

    const saleItems = values.saleItem.map((x: any) => ({
      ...x,
      unitPrice: medicineMap[x.medicineId]?.unitPrice,
    }));

    const totalAmout = saleItems.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0);
    
    setLoading(true);
    createSale({
      buyerName: values.buyerName,
      contactNumber: values.contactNumber,
      patientId: values.patientId, // ✅ Send to Backend
      totalAmount: totalAmout,
      saleItems: saleItems,
    })
      .then(() => {
        successNotification(`Sale completed successfully!`);
        form.reset();
        setView('list');
        fetchData();
      })
      .catch((err: any) => {
        errorNotification(err?.response?.data?.errorMessage || `Sale Failed`);
      })
      .finally(() => setLoading(false));
  };

  const handleDetails = (rowData: any) => {
    setLoading(true);
    getSaleItems(rowData.id)
      .then((res) => {
        setSellItem(res);
        openDetails();
      })
      .finally(() => setLoading(false));
  }

  // --- Templates ---

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }: any) => (
    <Group flex="1" gap="xs">
      <div className="flex justify-between w-full">
        <Text size="sm">{option.label}</Text>
        <Text size="xs" c="dimmed">Stock: {option.stock}</Text>
      </div>
      {checked && <IconCheck size={16} />}
    </Group>
  );

  const leftToolbarTemplate = () => (
    <Group>
        <Button leftSection={<IconPlus size={18}/>} onClick={() => { form.reset(); setView('form'); }} color="green">
            New Sale
        </Button>
        <Button variant="default" leftSection={<IconUpload size={18}/>} onClick={spotlight.open}>
            Import Prescription
        </Button>
    </Group>
  );

  const rightToolbarTemplate = () => (
    <TextInput
      leftSection={<IconSearch size={16} />}
      value={globalFilterValue}
      onChange={onGlobalFilterChange}
      placeholder="Search sales..."
      radius="md"
    />
  );

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex justify-center">
      <ActionIcon variant="subtle" color="blue" onClick={() => handleDetails(rowData)}>
        <IconEye size={20} stroke={1.5} />
      </ActionIcon>
    </div>
  );

  const totalAmount = form.values.saleItem.reduce((acc, item) => 
    acc + (item.quantity * (medicineMap[item.medicineId]?.unitPrice || 0)), 0
  );
  const totalSaleAmount = sellItem.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  return (
    <div className="p-4">
      
      {/* === LIST VIEW === */}
      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <Toolbar className="mb-4 border-0 bg-transparent p-0" start={leftToolbarTemplate} end={rightToolbarTemplate} />

          <DataTable
            stripedRows
            value={data}
            size="small"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            filters={filters}
            globalFilterFields={["buyerName", "contactNumber"]}
            emptyMessage="No sales found."
            className="text-sm"
          >
            <Column field="buyerName" header="Buyer Name" sortable style={{ minWidth: '12rem' }} />
            <Column field="contactNumber" header="Contact" style={{ minWidth: '10rem' }} />
            <Column 
                field="totalAmount" 
                header="Total (₹)" 
                sortable 
                body={(r) => <Text fw={700} size="sm">₹{r.totalAmount}</Text>} 
                style={{ minWidth: '8rem' }}
            />
            <Column 
                field="saleDate" 
                header="Date" 
                sortable 
                body={(r) => formatDateManually(r.saleDate)} 
                style={{ minWidth: '10rem' }}
            />
            <Column header="View" body={actionBodyTemplate} style={{ width: '5rem', textAlign: 'center' }} />
          </DataTable>
        </div>
      )}

      {/* === FORM VIEW === */}
      {view === 'form' && (
        <div className="max-w-5xl mx-auto">
            <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={18}/>} onClick={() => setView('list')} className="mb-4">
                Back to Sales
            </Button>

            <Paper withBorder shadow="sm" radius="md" className="overflow-hidden bg-white">
                <LoadingOverlay visible={loading} />
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                    <Title order={3} c="slate">New Medicine Sale</Title>
                    <Text c="dimmed" size="sm">Fill in buyer details and add medicines to cart</Text>
                </div>

                <form onSubmit={form.onSubmit(handleSubmit)} className="p-6 flex flex-col gap-8">
                    
                    {/* Buyer Info */}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                        <TextInput 
                            label="Buyer Name" 
                            placeholder="Enter Name" 
                            withAsterisk 
                            leftSection={<IconUser size={16}/>}
                            {...form.getInputProps("buyerName")} 
                        />
                        <NumberInput 
                            label="Contact Number" 
                            placeholder="Enter Mobile" 
                            withAsterisk 
                            hideControls 
                            maxLength={10}
                            leftSection={<IconPhone size={16}/>}
                            {...form.getInputProps("contactNumber")} 
                        />
                    </SimpleGrid>

                    <Divider label={<Group gap={5}><IconShoppingCart size={16}/><Text size="sm" fw={500}>Cart Items</Text></Group>} labelPosition="left" />

                    {/* Medicine Items */}
                    <div className="space-y-4">
                        {form.values.saleItem.map((item, index) => (
                            <Paper key={index} withBorder p="md" radius="md" className="bg-gray-50/50">
                                <Group align="start">
                                    <div style={{ flex: 2 }}>
                                        <Select
                                            label="Medicine"
                                            placeholder="Select medicine"
                                            searchable
                                            data={medicine
                                                .filter(x => !form.values.saleItem.some((i, idx) => i.medicineId == x.id && idx !== index))
                                                .map((m) => ({ value: String(m.id), label: m.name, stock: m.stock }))
                                            }
                                            renderOption={renderSelectOption}
                                            {...form.getInputProps(`saleItem.${index}.medicineId`)}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <NumberInput
                                            label="Quantity"
                                            min={1}
                                            max={medicineMap[item.medicineId]?.stock || 100}
                                            {...form.getInputProps(`saleItem.${index}.quantity`)}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }} className="flex flex-col justify-center">
                                        <Text size="xs" c="dimmed" mb={4}>Subtotal</Text>
                                        <Text fw={700} size="lg">₹{(item.quantity * (medicineMap[item.medicineId]?.unitPrice || 0)).toFixed(2)}</Text>
                                    </div>
                                    <ActionIcon color="red" variant="subtle" className="mt-6" onClick={() => form.removeListItem("saleItem", index)}>
                                        <IconTrash size={18} />
                                    </ActionIcon>
                                </Group>
                            </Paper>
                        ))}
                    </div>

                    <Group justify="center">
                        <Button variant="light" leftSection={<IconPlus size={16}/>} onClick={() => form.insertListItem("saleItem", { medicineId: "", quantity: 1 })}>
                            Add Another Item
                        </Button>
                    </Group>

                    <Divider />

                    {/* Footer */}
                    <Group justify="space-between" align="center" className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <div>
                            <Text size="lg" fw={700} c="slate">Total Payable Amount</Text>
                            <Text size="sm" c="dimmed">{form.values.saleItem.length} items in cart</Text>
                        </div>
                        <Group>
                            <Text size="xl" fw={800} c="blue" className="mr-4">₹{totalAmount.toFixed(2)}</Text>
                            <Button size="lg" color="green" type="submit" loading={loading}>
                                Complete Sale
                            </Button>
                        </Group>
                    </Group>
                </form>
            </Paper>
        </div>
      )}

      {/* --- VIEW DETAILS MODAL --- */}
      <Modal 
        opened={detailsOpened} 
        onClose={closeDetails} 
        title={
          <Group gap="xs">
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconReceipt2 size={20} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="lg" c="slate">Sale Receipt</Text>
              <Text size="xs" c="dimmed">Itemized breakdown of medicines</Text>
            </div>
          </Group>
        } 
        centered
        size="lg"
        radius="md"
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <Divider mb="md" />

        {/* List of Items */}
        <ScrollArea.Autosize mah={400} type="auto" offsetScrollbars>
          <Stack gap="sm">
              {sellItem.map((item, idx) => (
                  <Paper 
                    key={idx} 
                    withBorder 
                    p="md" 
                    radius="md" 
                    className="bg-white hover:shadow-sm transition-all border-gray-200"
                  >
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                          
                          {/* Left: Icon & Name */}
                          <Group gap="md" wrap="nowrap">
                              <ThemeIcon size={40} radius="md" color="teal" variant="light">
                                  <IconPill size={22} />
                              </ThemeIcon>
                              <div>
                                  <Text fw={600} size="sm" className="text-gray-800">
                                    {medicineMap[item.medicineId]?.name || "Unknown Item"}
                                  </Text>
                                  <Group gap={6} mt={4}>
                                    <Badge 
                                      size="xs" 
                                      variant="outline" 
                                      color="gray" 
                                      leftSection={<IconTag size={10} style={{ marginTop: 2 }}/>}
                                    >
                                      Batch: {item.batchNo}
                                    </Badge>
                                  </Group>
                              </div>
                          </Group>

                          {/* Right: Pricing & Qty */}
                          <div className="text-right">
                              <Text fw={700} size="md" c="blue.7">
                                ₹{(item.quantity * item.unitPrice).toFixed(2)}
                              </Text>
                              <Text size="xs" c="dimmed" mt={2}>
                                  {item.quantity} qty × ₹{item.unitPrice}
                              </Text>
                          </div>
                      </Group>
                  </Paper>
              ))}
          </Stack>
        </ScrollArea.Autosize>

        {/* Footer: Grand Total */}
        <Paper mt="lg" p="md" radius="md" bg="gray.0">
            <Group justify="space-between">
              <Group gap="xs">
                <IconCalculator size={20} className="text-gray-500" />
                <Text fw={600} size="sm" c="dimmed">Grand Total</Text>
              </Group>
              <Text fw={800} size="xl" c="green.7">
                  ₹{totalSaleAmount.toFixed(2)}
              </Text>
            </Group>
        </Paper>
      </Modal>

      {/* --- SPOTLIGHT --- */}
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: 'Search patient prescription...',
        }}
      />
    </div>
  );
};

export default Sales;