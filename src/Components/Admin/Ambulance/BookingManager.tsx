import { useEffect, useState } from "react";
import { 
  Table, Badge, Button, Modal, Select, Text, Group, Loader, Center, 
  Paper, Stack, Avatar, ActionIcon, Tooltip 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { 
  IconMapPin, IconArrowRight, IconSteeringWheel, IconAmbulance 
} from "@tabler/icons-react";
import { 
  getAllBookings, getAvailableAmbulances, getAvailableDrivers, 
  getAllAmbulances, getAllDrivers, assignBooking, updateBookingStatus, 
  BookingDTO, AmbulanceDTO, DriverDTO 
} from "../../../Service/AmbulanceService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { formatDateApp } from "../../../util/DateFormat";

const BookingManager = () => {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lookup Maps
  const [ambulanceMap, setAmbulanceMap] = useState<Record<number, string>>({});
  const [driverMap, setDriverMap] = useState<Record<number, string>>({});
  
  // Modal State
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  
  // Assignment Selection
  const [availAmbulances, setAvailAmbulances] = useState<AmbulanceDTO[]>([]);
  const [availDrivers, setAvailDrivers] = useState<DriverDTO[]>([]);
  const [selectedAmb, setSelectedAmb] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsData, allAmbulances, allDrivers] = await Promise.all([
        getAllBookings(),
        getAllAmbulances(),
        getAllDrivers()
      ]);

      setBookings(bookingsData);

      // Build Maps for fast lookup
      const ambMap: Record<number, string> = {};
      allAmbulances.forEach((a) => {
        if (a.id) ambMap[a.id] = `${a.vehicleNumber} (${a.vehicleType})`;
      });
      setAmbulanceMap(ambMap);

      const drvMap: Record<number, string> = {};
      allDrivers.forEach((d) => {
        if (d.id) drvMap[d.id] = d.name;
      });
      setDriverMap(drvMap);

    } catch (error) {
      console.error(error);
      errorNotification("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAssignModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setSelectedAmb(null);
    setSelectedDriver(null);

    // Fetch available resources only when opening modal
    Promise.all([getAvailableAmbulances(), getAvailableDrivers()])
      .then(([ambs, drvs]) => {
        setAvailAmbulances(ambs);
        setAvailDrivers(drvs);
        open();
      })
      .catch(() => errorNotification("Error fetching available resources"));
  };

  const handleAssign = () => {
    if (!selectedBookingId || !selectedAmb || !selectedDriver) return;

    assignBooking(selectedBookingId, parseInt(selectedAmb), parseInt(selectedDriver))
      .then(() => {
        successNotification("Booking Assigned Successfully");
        close();
        fetchData();
      })
      .catch(() => errorNotification("Assignment Failed"));
  };

  const handleCancel = (id: number) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      updateBookingStatus(id, "CANCELLED")
        .then(() => {
          successNotification("Booking Cancelled");
          fetchData();
        })
        .catch(() => errorNotification("Error cancelling booking"));
    }
  };

  const rows = bookings.map((b) => (
    <Table.Tr key={b.id}>
      <Table.Td>
        {/* <Text size="xs" c="dimmed">#{b.id}</Text> */}
        <Text size="sm" fw={500} className="dark:text-gray-200">
            {formatDateApp(b.createdAt)}
        </Text>
      </Table.Td>
      
      <Table.Td>
        <Stack gap={4}>
            <Group gap={6} align="center" wrap="nowrap">
                <IconMapPin size={14} className="text-green-500 shrink-0" />
                <Text size="sm" fw={500} lineClamp={1} className="dark:text-gray-200">
                    {b.pickupLocation}
                </Text>
            </Group>
            <Group gap={6} align="center" wrap="nowrap" className="ml-1 opacity-70">
                 <IconArrowRight size={12} className="shrink-0" />
                 <Text size="xs" lineClamp={1} className="dark:text-gray-400">
                    {b.destinationLocation}
                 </Text>
            </Group>
        </Stack>
      </Table.Td>

      <Table.Td>
        <Badge
            size="sm"
            variant="dot"
            color={
                b.status === "REQUESTED" ? "orange" :
                b.status === "ACCEPTED" ? "blue" :
                b.status === "ON_THE_WAY" ? "indigo" :
                b.status === "COMPLETED" ? "green" : "red"
            }
        >
          {b.status.replace(/_/g, " ")}
        </Badge>
      </Table.Td>

      <Table.Td>
        {b.driverId ? (
            <Group gap="xs" wrap="nowrap">
                <Avatar size="sm" radius="xl" color="blue" variant="light">
                    {driverMap[b.driverId]?.[0] || "?"}
                </Avatar>
                <div>
                    <Text size="xs" fw={600} className="dark:text-gray-200">
                        {driverMap[b.driverId]}
                    </Text>
                    <Text size="10px" c="dimmed">
                        {ambulanceMap[b.ambulanceId!]?.split(" ")[0]}
                    </Text>
                </div>
            </Group>
        ) : (
            <Text c="dimmed" size="xs" fs="italic">Unassigned</Text>
        )}
      </Table.Td>

      <Table.Td>
        {b.status === "REQUESTED" && (
            <Button size="xs" variant="light" color="blue" onClick={() => openAssignModal(b.id)}>
                Assign
            </Button>
        )}
        {!["COMPLETED", "CANCELLED", "REQUESTED"].includes(b.status) && (
            <Button size="xs" color="red" variant="subtle" onClick={() => handleCancel(b.id)}>
                Cancel
            </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  if (loading) {
    return <Center h={300}><Loader type="bars" /></Center>;
  }

  return (
    <Paper shadow="xs" radius="lg" p="lg" withBorder className="bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <Group justify="space-between" mb="lg">
        <div>
            <Text size="xl" fw={700} className="dark:text-white">Booking Requests</Text>
            <Text size="xs" c="dimmed">Manage patient transport requests</Text>
        </div>
      </Group>
      
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
            <Table.Tr>
                <Table.Th>ID & Date</Table.Th>
                <Table.Th>Route</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Assignment</Table.Th>
                <Table.Th>Action</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows.length > 0 ? rows : (
                    <Table.Tr>
                        <Table.Td colSpan={5} align="center" py="xl">
                            <Text c="dimmed">No bookings found</Text>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Modal opened={opened} onClose={close} title="Dispatch Assignment" centered size="md">
        <Stack>
            <Select
                label="Select Ambulance"
                leftSection={<IconAmbulance size={16} />}
                placeholder={availAmbulances.length ? "Choose vehicle" : "No vehicles available"}
                data={availAmbulances.map(a => ({ 
                    value: String(a.id), 
                    label: `${a.vehicleNumber} [${a.vehicleType}]` 
                }))}
                value={selectedAmb}
                onChange={setSelectedAmb}
                searchable
                disabled={availAmbulances.length === 0}
            />
            
            <Select
                label="Select Driver"
                leftSection={<IconSteeringWheel size={16} />}
                placeholder={availDrivers.length ? "Choose driver" : "No drivers available"}
                data={availDrivers.map(d => ({ 
                    value: String(d.id), 
                    label: `${d.name}` 
                }))}
                value={selectedDriver}
                onChange={setSelectedDriver}
                searchable
                disabled={availDrivers.length === 0}
            />
            
            <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={close}>Cancel</Button>
                <Button onClick={handleAssign} disabled={!selectedAmb || !selectedDriver}>
                    Confirm Dispatch
                </Button>
            </Group>
        </Stack>
      </Modal>
    </Paper>
  );
};

export default BookingManager;