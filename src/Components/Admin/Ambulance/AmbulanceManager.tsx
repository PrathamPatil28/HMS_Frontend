import { useEffect, useState } from "react";
import { 
  Table, Button, Badge, Modal, TextInput, Select, Group, Text, 
  Paper, ActionIcon, Menu, Input, ThemeIcon, ScrollArea 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { 
  IconPlus, IconAmbulance, IconDotsVertical, 
  IconSettings, IconSearch, IconTruck 
} from "@tabler/icons-react";
import { getAllAmbulances, addAmbulance, updateAmbulanceStatus, AmbulanceDTO } from "../../../Service/AmbulanceService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const AmbulanceManager = () => {
  const [ambulances, setAmbulances] = useState<AmbulanceDTO[]>([]);
  const [search, setSearch] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: { vehicleNumber: "", vehicleType: "BASIC" },
    validate: { vehicleNumber: (value) => (value.length < 2 ? "Required" : null) },
  });

  const fetchData = () => { getAllAmbulances().then(setAmbulances).catch(console.error); };
  useEffect(() => { fetchData(); }, []);

  const handleAdd = (values: typeof form.values) => {
    addAmbulance({ ...values, status: "AVAILABLE" })
      .then(() => { successNotification("Ambulance Added"); close(); form.reset(); fetchData(); })
      .catch(() => errorNotification("Failed to add"));
  };

  const handleStatusChange = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "OUT_OF_SERVICE" : "AVAILABLE";
    updateAmbulanceStatus(id, newStatus as any).then(() => { successNotification("Status Updated"); fetchData(); });
  };

  // Filter Logic
  const filteredAmbs = ambulances.filter(a => 
    a.vehicleNumber.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredAmbs.map((amb) => (
    <Table.Tr key={amb.id}>
      <Table.Td>
        <Group gap="sm">
            <ThemeIcon variant="light" color="blue" size="md" radius="md">
                <IconAmbulance size={18}/>
            </ThemeIcon>
            <div>
                <Text fw={600} size="sm" className="dark:text-gray-200">{amb.vehicleNumber}</Text>
                <Text size="10px" c="dimmed">ID: {amb.id}</Text>
            </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="outline" color={amb.vehicleType === "ICU" ? "red" : "blue"}>
            {amb.vehicleType}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="dot"
          size="md"
          color={ (amb.status as any) === "AVAILABLE" ? "teal" : (amb.status as any) === "OUT_OF_SERVICE" ? "gray" : "orange" }
        >
          {amb.status === "OUT_OF_SERVICE" ? "MAINTENANCE" : amb.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={16} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item 
                    disabled={(amb.status as any) === "BOOKED"}
                    leftSection={<IconSettings size={14} />}
                    onClick={() => handleStatusChange(amb.id!, amb.status)}
                    color={(amb.status as any) === "AVAILABLE" ? "red" : "teal"}
                >
                    {(amb.status as any) === "AVAILABLE" ? "Set Maintenance" : "Set Available"}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="xs" radius="lg" p="lg" withBorder className="bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
            <Text size="xl" fw={700} className="dark:text-white">Fleet Management</Text>
            <Text size="xs" c="dimmed">Manage ambulance availability and status</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={open} color="blue" variant="light">
            Add Vehicle
        </Button>
      </Group>

      {/* Search Bar */}
      <div className="mb-4 max-w-md">
        <Input 
            placeholder="Search vehicle number..." 
            leftSection={<IconSearch size={16}/>} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="dark:text-gray-200"
        />
      </div>

      {/* Table */}
      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
                <Table.Th>Vehicle Info</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
                <Table.Tr>
                    <Table.Td colSpan={4} align="center" py="xl">
                        <Text c="dimmed">No vehicles found</Text>
                    </Table.Td>
                </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Add Modal */}
      <Modal opened={opened} onClose={close} title="Register New Ambulance" centered>
        <form onSubmit={form.onSubmit(handleAdd)}>
          <TextInput 
            label="Vehicle Number" 
            placeholder="MH-04-AB-1234" 
            leftSection={<IconTruck size={16}/>}
            {...form.getInputProps("vehicleNumber")} 
            mb="md" 
          />
          <Select 
            label="Type" 
            data={["BASIC", "ADVANCED", "ICU", "MORTUARY"]} 
            {...form.getInputProps("vehicleType")} 
            mb="lg" 
          />
          <Button type="submit" fullWidth>Save to Fleet</Button>
        </form>
      </Modal>
    </Paper>
  );
};

export default AmbulanceManager;