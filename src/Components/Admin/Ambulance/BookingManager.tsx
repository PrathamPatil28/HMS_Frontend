import { useEffect, useState } from "react";
import { Table, Badge, Button, Modal, Select, Text, Group, Loader, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  getAllBookings,
  getAvailableAmbulances,
  getAvailableDrivers,
  getAllAmbulances, // ✅ Import this
  getAllDrivers,    // ✅ Import this
  assignBooking,
  updateBookingStatus,
  BookingDTO,
  AmbulanceDTO,
  DriverDTO
} from "../../../Service/AmbulanceService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";
import { formatDateApp } from "../../../util/DateFormat";

const BookingManager = () => {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Lookup Maps for display
  const [ambulanceMap, setAmbulanceMap] = useState<Record<number, string>>({});
  const [driverMap, setDriverMap] = useState<Record<number, string>>({});

  // Modal State
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // Selection State (For Assignment Modal)
  const [availAmbulances, setAvailAmbulances] = useState<AmbulanceDTO[]>([]);
  const [availDrivers, setAvailDrivers] = useState<DriverDTO[]>([]);
  
  const [selectedAmb, setSelectedAmb] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ Fetch Bookings, All Ambulances, and All Drivers in parallel
      const [bookingsData, allAmbulances, allDrivers] = await Promise.all([
        getAllBookings(),
        getAllAmbulances(),
        getAllDrivers()
      ]);

      setBookings(bookingsData);

      // ✅ Create Lookup Maps for fast display
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

    // Only fetch AVAILABLE resources for the assignment dropdown
    Promise.all([getAvailableAmbulances(), getAvailableDrivers()])
      .then(([ambs, drvs]) => {
        setAvailAmbulances(ambs);
        setAvailDrivers(drvs);
        open();
      })
      .catch(() => errorNotification("Could not fetch available resources"));
  };

  const handleAssign = () => {
    if (!selectedBookingId || !selectedAmb || !selectedDriver) {
      errorNotification("Please select both ambulance and driver");
      return;
    }

    assignBooking(selectedBookingId, parseInt(selectedAmb), parseInt(selectedDriver))
      .then(() => {
        successNotification("Booking Assigned Successfully");
        close();
        fetchData(); // Refresh Table
      })
      .catch(() => errorNotification("Failed to assign booking"));
  };

  const handleCancel = (id: number) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      updateBookingStatus(id, "CANCELLED")
        .then(() => {
          successNotification("Booking Cancelled");
          fetchData();
        })
        .catch(() => errorNotification("Error cancelling"));
    }
  };

  const rows = bookings.map((b) => (
    <Table.Tr key={b.id}>
      <Table.Td>{b.id}</Table.Td>
      <Table.Td>{formatDateApp(b.createdAt)}</Table.Td>
      <Table.Td>
        <Text size="sm" fw={500}>{b.pickupLocation}</Text>
        <Text size="xs" c="dimmed">To: {b.destinationLocation}</Text>
      </Table.Td>
      <Table.Td>
        <Badge
          color={
            b.status === "REQUESTED" ? "orange" :
            b.status === "ACCEPTED" ? "blue" :
            b.status === "COMPLETED" ? "green" :
            b.status === "ON_THE_WAY" ? "indigo" : "red"
          }
        >
          {b.status.replace(/_/g, " ")}
        </Badge>
      </Table.Td>
      
      {/* ✅ Display Vehicle Number using Map */}
      <Table.Td>
        {b.ambulanceId ? (
          <Text size="sm" fw={500}>
            {ambulanceMap[b.ambulanceId] || `ID: ${b.ambulanceId}`}
          </Text>
        ) : (
          <Text c="dimmed">-</Text>
        )}
      </Table.Td>

      {/* ✅ Display Driver Name using Map */}
      <Table.Td>
        {b.driverId ? (
          <Text size="sm" fw={500}>
            {driverMap[b.driverId] || `ID: ${b.driverId}`}
          </Text>
        ) : (
          <Text c="dimmed">-</Text>
        )}
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          {b.status === "REQUESTED" && (
            <Button size="xs" onClick={() => openAssignModal(b.id)}>Assign</Button>
          )}
          {!["COMPLETED", "CANCELLED"].includes(b.status) && (
            <Button size="xs" color="red" variant="outline" onClick={() => handleCancel(b.id)}>Cancel</Button>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  if (loading) {
    return <Center h={300}><Loader size="lg" /></Center>;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-neutral-700 mb-4">Booking Requests</h2>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Route</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Vehicle</Table.Th>
            <Table.Th>Driver</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={7} align="center">
                <Text c="dimmed">No bookings found</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Assign Modal */}
      <Modal opened={opened} onClose={close} title="Assign Ambulance & Driver" centered>
        <Select
          label="Select Ambulance"
          placeholder={availAmbulances.length > 0 ? "Choose vehicle" : "No available ambulances"}
          data={availAmbulances.map(a => ({
            value: String(a.id),
            label: `${a.vehicleNumber} (${a.vehicleType.replace(/_/g, " ")})`
          }))}
          value={selectedAmb}
          onChange={setSelectedAmb}
          mb="md"
          searchable
          disabled={availAmbulances.length === 0}
        />

        <Select
          label="Select Driver"
          placeholder={availDrivers.length > 0 ? "Choose driver" : "No available drivers"}
          data={availDrivers.map(d => ({
            value: String(d.id),
            label: `${d.name} (${d.phone})`
          }))}
          value={selectedDriver}
          onChange={setSelectedDriver}
          mb="lg"
          searchable
          disabled={availDrivers.length === 0}
        />

        <Button fullWidth onClick={handleAssign} disabled={!selectedAmb || !selectedDriver}>
          Confirm Assignment
        </Button>
      </Modal>
    </div>
  );
};

export default BookingManager;