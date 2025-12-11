import { useEffect, useState } from "react";
import { Table, Badge, Select, Text, Tooltip, ActionIcon } from "@mantine/core";
import { getAllDrivers, updateDriverStatus, DriverDTO, DriverStatus } from "../../../Service/AmbulanceService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { IconMapPin } from "@tabler/icons-react";

const DriverManager = () => {
  const [drivers, setDrivers] = useState<DriverDTO[]>([]);

  const fetchData = () => {
    getAllDrivers().then(setDrivers).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (id: number, newStatus: string | null) => {
    if (!newStatus) return;
    
    // Type assertion to ensure string is a valid DriverStatus
    updateDriverStatus(id, newStatus as DriverStatus)
      .then(() => {
        successNotification("Driver Status Updated");
        fetchData();
      })
      .catch(() => errorNotification("Failed to update status"));
  };

  const rows = drivers.map((driver) => (
    <Table.Tr key={driver.id}>
      <Table.Td>{driver.id}</Table.Td>
      <Table.Td>
          <Text size="sm" fw={500}>{driver.name}</Text>
          {/* Show GPS Icon if coordinates exist */}
          {driver.currentLat && driver.currentLng && (
              <Tooltip label={`Last known: ${driver.currentLat.toFixed(4)}, ${driver.currentLng.toFixed(4)}`}>
                  <ActionIcon size="xs" variant="transparent" color="blue">
                      <IconMapPin size={12} />
                  </ActionIcon>
              </Tooltip>
          )}
      </Table.Td>
      <Table.Td>{driver.phone}</Table.Td>
      <Table.Td>{driver.licenseNumber}</Table.Td>
      <Table.Td>
        <Badge
          color={
            driver.status === "AVAILABLE"
              ? "green"
              : driver.status === "ON_TRIP"
              ? "red"
              : "gray"
          }
        >
          {driver.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Select
          size="xs"
          value={driver.status}
          data={["AVAILABLE", "OFF_DUTY", "ON_TRIP"]}
          onChange={(val) => handleStatusChange(driver.id, val)}
          disabled={driver.status === "ON_TRIP"} // Prevent changing status manually if on trip (system handles it)
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-neutral-700 mb-4">Driver Roster</h2>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>License</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Update Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};

export default DriverManager;