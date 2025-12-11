import { useEffect, useState } from "react";
import { Table, Button, Badge, Modal, Select, Group, Text, Loader, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPlus, IconDroplet } from "@tabler/icons-react";
import { 
    getAllBloodUnits, 
    addBloodUnit, 
    getAllDonors, // ✅ Import this
    BloodUnitDTO, 
    DonorDTO,     // ✅ Import this
    BloodGroupsList 
} from "../../../Service/BloodBankService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const BloodInventory = () => {
    const [units, setUnits] = useState<BloodUnitDTO[]>([]);
    const [donors, setDonors] = useState<DonorDTO[]>([]); // ✅ Store donors
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    // Helper to Map Donor ID to Name
    const [donorMap, setDonorMap] = useState<Record<number, string>>({});

    const form = useForm<BloodUnitDTO>({
        initialValues: {
            donorId: 0,
            bloodGroup: "O_POSITIVE", 
            status: "AVAILABLE"
        },
        validate: {
            donorId: (val) => (val > 0 ? null : "Please select a donor"),
        },
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            // ✅ Fetch both Units and Donors
            const [unitsData, donorsData] = await Promise.all([
                getAllBloodUnits(),
                getAllDonors()
            ]);

            setUnits(unitsData);
            setDonors(donorsData);

            // Create Lookup Map for Table Display
            const map: Record<number, string> = {};
            donorsData.forEach((d: DonorDTO) => {
                if(d.id) map[d.id] = d.name;
            });
            setDonorMap(map);

        } catch (error) {
            console.error(error);
            errorNotification("Failed to load inventory data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Auto-select Blood Group when Donor is picked
    const handleDonorChange = (value: string | null) => {
        if(value) {
            const id = parseInt(value);
            form.setFieldValue('donorId', id);
            
            // Find donor and set their blood group
            const selectedDonor = donors.find(d => d.id === id);
            if(selectedDonor) {
                form.setFieldValue('bloodGroup', selectedDonor.bloodGroup);
            }
        }
    };

    const handleAdd = (values: BloodUnitDTO) => {
        addBloodUnit(values).then(() => {
            successNotification("Blood Unit Added to Stock");
            close();
            form.reset();
            fetchData();
        }).catch(() => errorNotification("Failed to add unit."));
    };

    const rows = units.map((unit) => (
        <Table.Tr key={unit.id}>
            <Table.Td>#{unit.id}</Table.Td>
            <Table.Td>
                {/* Display Blood Group with Color */}
                <Badge 
                    color={unit.bloodGroup.includes("POSITIVE") ? "red" : "orange"} 
                    variant="light" 
                    size="md"
                >
                    {unit.bloodGroup.replace("_", " ")}
                </Badge>
            </Table.Td>
            <Table.Td>{unit.collectedDate}</Table.Td>
            <Table.Td>{unit.expiryDate}</Table.Td>
            
            {/* ✅ Show Donor Name instead of ID */}
            <Table.Td>
                <Text size="sm" fw={500}>
                    {donorMap[unit.donorId] || `Unknown (ID: ${unit.donorId})`}
                </Text>
            </Table.Td>
            
            <Table.Td>
                <Badge color={unit.status === "AVAILABLE" ? "green" : "gray"}>
                    {unit.status}
                </Badge>
            </Table.Td>
        </Table.Tr>
    ));

    if(loading) return <Center h={200}><Loader size="lg"/></Center>

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <Group justify="space-between" mb="md">
                <h2 className="text-xl font-bold text-neutral-700">Blood Inventory</h2>
                <Button leftSection={<IconPlus size={16} />} onClick={open} color="red" variant="filled">
                    Collect Blood
                </Button>
            </Group>

            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Unit ID</Table.Th>
                        <Table.Th>Group</Table.Th>
                        <Table.Th>Collected Date</Table.Th>
                        <Table.Th>Expiry Date</Table.Th>
                        <Table.Th>Donor Name</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {units.length > 0 ? rows : (
                        <Table.Tr><Table.Td colSpan={6} align="center">No stock available</Table.Td></Table.Tr>
                    )}
                </Table.Tbody>
            </Table>

            <Modal opened={opened} onClose={close} title="Collect Blood Unit" centered>
                <form onSubmit={form.onSubmit(handleAdd)}>
                    
                    {/* ✅ Donor Select Dropdown */}
                    <Select 
                        label="Select Donor"
                        placeholder="Search by name..."
                        data={donors.map(d => ({ 
                            value: String(d.id), 
                            label: `${d.name} (${d.bloodGroup.replace("_", " ")})` 
                        }))}
                        searchable
                        onChange={handleDonorChange}
                        mb="md"
                        withAsterisk
                    />

                    {/* ✅ Read-Only Blood Group (Auto-filled) */}
                    <Select 
                        label="Blood Group" 
                        data={BloodGroupsList} 
                        {...form.getInputProps("bloodGroup")}
                        mb="lg" 
                        disabled // Prevent changing blood group manually to ensure data integrity
                        rightSection={<IconDroplet size={16} />}
                    />
                    
                    <Button type="submit" fullWidth color="red">Add to Inventory</Button>
                </form>
            </Modal>
        </div>
    );
};

export default BloodInventory;