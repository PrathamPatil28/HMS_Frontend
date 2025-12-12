import { useEffect, useState } from "react";
import { Table, Badge, Select, Text, Tooltip,  Paper, Avatar, Group } from "@mantine/core";
import { getAllDrivers, updateDriverStatus, DriverDTO, DriverStatus } from "../../../Service/AmbulanceService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import {  IconPhone, IconId } from "@tabler/icons-react";

const DriverManager = () => {
  const [drivers, setDrivers] = useState<DriverDTO[]>([]);

  const fetchData = () => { getAllDrivers().then(setDrivers).catch(console.error); };
  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = (id: number, newStatus: string | null) => {
    if (!newStatus) return;
    updateDriverStatus(id, newStatus as DriverStatus)
      .then(() => { successNotification("Status Updated"); fetchData(); })
      .catch(() => errorNotification("Failed to update"));
  };

  const rows = drivers.map((driver) => (
    <Table.Tr key={driver.id}>
      <Table.Td>
        <Group gap="sm">
            <Avatar size={40} radius="xl" color="indigo" variant="light">{driver.name[0]}</Avatar>
            <div>
                <Text size="sm" fw={600}>{driver.name}</Text>
                <Group gap={4}>
                     <IconPhone size={12} className="text-gray-500" />
                     <Text size="xs" c="dimmed">{driver.phone}</Text>
                </Group>
            </div>
        </Group>
      </Table.Td>
      <Table.Td>
         <Group gap={5}>
            <IconId size={14} className="text-gray-400" />
            <Text size="sm">{driver.licenseNumber}</Text>
         </Group>
      </Table.Td>
      <Table.Td>
         {driver.currentLat ? (
            <Tooltip label="GPS Active">
                 <Badge variant="dot" color="green" size="sm">Online</Badge>
            </Tooltip>
         ) : <Badge variant="dot" color="gray" size="sm">Offline</Badge>}
      </Table.Td>
      <Table.Td>
        <Select
          size="xs"
          variant="filled"
          radius="md"
          w={140}
          value={driver.status}
          data={[
              { value: "AVAILABLE", label: "🟢 Available" },
              { value: "OFF_DUTY", label: "⚪ Off Duty" },
              { value: "ON_TRIP", label: "🔴 On Trip" }
          ]}
          onChange={(val) => handleStatusChange(driver.id, val)}
          disabled={driver.status === "ON_TRIP"}
          classNames={{ input: 'font-semibold' }}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="xs" radius="lg" p="lg" withBorder className="bg-white dark:bg-gray-800 dark:border-gray-700">
      <Group justify="space-between" mb="lg">
         <div>
            <Text size="xl" fw={700}>Driver Roster</Text>
            <Text size="xs" c="dimmed">Manage driver availability and status</Text>
        </div>
      </Group>
      
      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="md" highlightOnHover>
          <Table.Thead><Table.Tr><Table.Th>Driver Details</Table.Th><Table.Th>License</Table.Th><Table.Th>GPS</Table.Th><Table.Th>Status</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
};

export default DriverManager;