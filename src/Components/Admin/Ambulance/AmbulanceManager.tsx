import { useEffect, useState } from "react";
import { Table, Button, Badge, Modal, TextInput, Select, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { getAllAmbulances, addAmbulance, updateAmbulanceStatus, AmbulanceDTO } from "../../../Service/AmbulanceService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const AmbulanceManager = () => {
  const [ambulances, setAmbulances] = useState<AmbulanceDTO[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      vehicleNumber: "",
      vehicleType: "BASIC",
    },
    validate: {
      vehicleNumber: (value) => (value.length < 2 ? "Vehicle Number is required" : null),
    },
  });

  const fetchData = () => {
    getAllAmbulances().then(setAmbulances).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = (values: typeof form.values) => {
    // Initial status is AVAILABLE
    addAmbulance({ ...values, status: "AVAILABLE" })
      .then(() => {
        successNotification("Ambulance Added Successfully");
        close();
        form.reset();
        fetchData();
      })
      .catch(() => errorNotification("Failed to add ambulance"));
  };

  const handleStatusChange = (id: number, currentStatus: string) => {
    // ✅ FIXED: Use 'OUT_OF_SERVICE' instead of 'UNDER_MAINTENANCE'
    const newStatus = currentStatus === "AVAILABLE" ? "OUT_OF_SERVICE" : "AVAILABLE";
    
    updateAmbulanceStatus(id, newStatus as any)
      .then(() => {
        successNotification("Ambulance Status Updated");
        fetchData();
      })
      .catch(() => errorNotification("Failed to update status"));
  };

  const rows = ambulances.map((amb) => (
    <Table.Tr key={amb.id}>
      <Table.Td>{amb.id}</Table.Td>
      <Table.Td className="font-bold">{amb.vehicleNumber}</Table.Td>
      <Table.Td>
        <Badge color={amb.vehicleType === "ICU" ? "red" : "blue"}>{amb.vehicleType}</Badge>
      </Table.Td>
      <Table.Td>
        <Badge
          color={
            (amb.status as any) === "AVAILABLE"
              ? "green"
              : (amb.status as any) === "OUT_OF_SERVICE" // ✅ FIXED CHECK
              ? "gray" // Changed to gray for maintenance/out of service
              : "orange" // BOOKED
          }
        >
          {/* Display a friendlier name if needed, but keep raw value for now */}
          {amb.status === "OUT_OF_SERVICE" ? "MAINTENANCE" : amb.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        {/* Hide button if the ambulance is busy (BOOKED) */}
        {(amb.status as any) !== "BOOKED" && (
            <Button
            size="xs"
            variant="light"
            // ✅ Toggle Color based on Current Status
            color={(amb.status as any) === "AVAILABLE" ? "red" : "green"}
            onClick={() => handleStatusChange(amb.id!, amb.status)}
            >
            {(amb.status as any) === "AVAILABLE" ? "Set Maintenance" : "Set Available"}
            </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <Group justify="space-between" mb="md">
        <h2 className="text-xl font-bold text-neutral-700">Fleet Management</h2>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Ambulance
        </Button>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Vehicle No</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title="Add New Ambulance" centered>
        <form onSubmit={form.onSubmit(handleAdd)}>
          <TextInput label="Vehicle Number" placeholder="MH-04-AB-1234" {...form.getInputProps("vehicleNumber")} mb="md" />
          <Select
            label="Vehicle Type"
            data={["BASIC", "ADVANCED", "ICU", "MORTUARY"]}
            {...form.getInputProps("vehicleType")}
            mb="lg"
          />
          <Button type="submit" fullWidth>
            Save Ambulance
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AmbulanceManager;