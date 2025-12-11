import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
    Text, Group, Badge, Timeline, ThemeIcon, 
    Title, SimpleGrid, Loader, Button, Modal, Select, LoadingOverlay, Paper, Stack, Avatar 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { 
    IconBed, IconCalendarTime, IconCash, IconStethoscope, 
    IconPlus, IconBuildingHospital, IconClock
} from "@tabler/icons-react";
import { getAllRoomData, bookRoomByPatient } from "../../../Service/RoomService";
import { formatDateDDMMYYYY } from "../../../util/DateFormat";
import { successNotification, errorNotification } from "../../../util/NotificationUtil";

const PatientRoomBooking = () => {
    const user = useSelector((state: any) => state.user);
    const [history, setHistory] = useState<any[]>([]);
    const [activeRoom, setActiveRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Booking Modal State
    const [opened, { open, close }] = useDisclosure(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const form = useForm({
        initialValues: { roomType: "" },
        validate: { roomType: (v) => (!v ? "Please select a room type" : null) }
    });

    const fetchRooms = () => {
        setLoading(true);
        getAllRoomData().then((allRooms: any[]) => {
            const myRooms = allRooms.filter(r => r.patientName === user.name); 

            const current = myRooms.find(r => r.status === "Reserved");
            const past = myRooms.filter(r => r.status === "Discharged");

            setActiveRoom(current);
            setHistory(past);
        }).catch(err => console.error(err))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (user?.profileId) fetchRooms();
    }, [user]);

    const handleBooking = (values: any) => {
        setBookingLoading(true);
        const payload = {
            patientId: user.profileId,
            roomType: values.roomType
        };

        bookRoomByPatient(payload)
            .then(() => {
                successNotification("Room Booked Successfully!");
                close();
                form.reset();
                fetchRooms(); 
            })
            .catch((err) => {
                errorNotification(err.response?.data?.message || "Booking Failed. No beds available?");
            })
            .finally(() => setBookingLoading(false));
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader size="lg" type="dots" /></div>;

    // Calculate totals for Summary
    const totalSpent = history.reduce((acc, curr) => acc + (curr.amountCharged || 0), 0);
    const totalVisits = history.length;

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-6">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <Title order={2} className="text-slate-800">Hospital Stays</Title>
                    <Text c="dimmed">Manage your room allocations and view history</Text>
                </div>
                {!activeRoom && (
                    <Button 
                        size="md" 
                        leftSection={<IconPlus size={18}/>} 
                        onClick={open} 
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
                        radius="md"
                    >
                        Request Admission
                    </Button>
                )}
            </div>

            {/* --- STATS SUMMARY --- */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                <Paper shadow="xs" p="lg" radius="md" className="flex items-center gap-4 border-l-4 border-indigo-500">
                    <ThemeIcon size={50} radius="xl" variant="light" color="indigo"><IconBuildingHospital size={28}/></ThemeIcon>
                    <div>
                        <Text c="dimmed" size="xs" fw={700} tt="uppercase">Total Admissions</Text>
                        <Text fw={700} size="xl">{totalVisits}</Text>
                    </div>
                </Paper>
                <Paper shadow="xs" p="lg" radius="md" className="flex items-center gap-4 border-l-4 border-emerald-500">
                    <ThemeIcon size={50} radius="xl" variant="light" color="emerald"><IconCash size={28}/></ThemeIcon>
                    <div>
                        <Text c="dimmed" size="xs" fw={700} tt="uppercase">Total Billed</Text>
                        <Text fw={700} size="xl">₹{totalSpent.toLocaleString()}</Text>
                    </div>
                </Paper>
                <Paper shadow="xs" p="lg" radius="md" className="flex items-center gap-4 border-l-4 border-blue-500">
                     <ThemeIcon size={50} radius="xl" variant="light" color="blue"><IconBed size={28}/></ThemeIcon>
                    <div>
                        <Text c="dimmed" size="xs" fw={700} tt="uppercase">Current Status</Text>
                        <Badge size="lg" color={activeRoom ? "green" : "gray"}>{activeRoom ? "Admitted" : "Discharged"}</Badge>
                    </div>
                </Paper>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                
                {/* --- LEFT: ACTIVE ADMISSION CARD --- */}
                <Stack>
                    <Title order={4} className="text-slate-600">Current Allocation</Title>
                    {activeRoom ? (
                        <Paper shadow="md" radius="lg" className="overflow-hidden border-t-4 border-blue-500 relative">
                            {/* Header Stripe */}
                            <div className="bg-blue-50 p-6 border-b border-blue-100 flex justify-between items-center">
                                <Group>
                                    <Avatar color="blue" radius="xl"><IconBed/></Avatar>
                                    <div>
                                        <Text fw={700} size="lg" c="blue.9">Room {activeRoom.roomNo}</Text>
                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">{activeRoom.roomType} Suite</Text>
                                    </div>
                                </Group>
                                <Badge size="lg" color="green" className="shadow-sm">Active</Badge>
                            </div>
                            
                            {/* Details Body */}
                            <div className="p-6 grid grid-cols-2 gap-y-6">
                                <div>
                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">Bed Number</Text>
                                    <Text fw={600} size="md">{activeRoom.bedNo}</Text>
                                </div>
                                <div>
                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">Admitted On</Text>
                                    <Group gap={6}>
                                        <IconCalendarTime size={16} className="text-gray-400"/>
                                        <Text fw={600} size="md">{formatDateDDMMYYYY(activeRoom.admissionDate)}</Text>
                                    </Group>
                                </div>
                                <div className="col-span-2">
                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">Attending Doctor</Text>
                                    <Group gap={8} mt={4}>
                                        <ThemeIcon variant="light" size="sm" radius="xl"><IconStethoscope size={12}/></ThemeIcon>
                                        <Text fw={600} size="md">{activeRoom.doctorAssigned}</Text>
                                    </Group>
                                </div>
                            </div>
                            
                            {/* Decorative Background Icon */}
                            <IconBed size={150} className="absolute -bottom-6 -right-6 text-gray-100 -z-10 opacity-50"/>
                        </Paper>
                    ) : (
                        <Paper shadow="sm" radius="lg" p="xl" className="text-center bg-white border border-dashed border-gray-300 h-64 flex flex-col items-center justify-center">
                            <ThemeIcon size={60} radius="100%" color="gray" variant="light" className="mb-4">
                                <IconBed size={32} />
                            </ThemeIcon>
                            <Text fw={600} size="lg" c="gray.7">No Active Admission</Text>
                            <Text c="dimmed" size="sm" mb="md">You are not currently admitted to any room.</Text>
                            <Button variant="light" onClick={open}>Request Room</Button>
                        </Paper>
                    )}
                </Stack>

                {/* --- RIGHT: HISTORY TIMELINE --- */}
                <Stack>
                    <Title order={4} className="text-slate-600">Discharge History</Title>
                    <Paper shadow="sm" radius="lg" p="lg" className="h-full min-h-[300px] bg-white">
                        {history.length > 0 ? (
                            <Timeline active={history.length} bulletSize={30} lineWidth={2}>
                                {history.map((record, index) => (
                                    <Timeline.Item 
                                        key={index} 
                                        bullet={<IconClock size={16}/>} 
                                        title={<Text fw={600}>Room {record.roomNo} <span className="font-normal text-gray-500 text-sm">({record.roomType})</span></Text>}
                                    >
                                        <Text c="dimmed" size="sm" mt={4}>
                                            Admitted: {formatDateDDMMYYYY(record.admissionDate)}
                                        </Text>
                                        <Group gap="xs" mt={8}>
                                            <Badge variant="dot" color="gray" size="sm">Doctor: {record.doctorAssigned}</Badge>
                                            <Badge variant="outline" color="green" size="sm">Billed: ₹{record.amountCharged}</Badge>
                                        </Group>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <IconHistoryIcon size={40} className="mb-2"/>
                                <Text>No past history found.</Text>
                            </div>
                        )}
                    </Paper>
                </Stack>
            </SimpleGrid>

            {/* --- BOOKING MODAL --- */}
            <Modal 
                opened={opened} 
                onClose={close} 
                title={<Title order={4}>Request Admission</Title>} 
                centered 
                overlayProps={{ blur: 3 }}
                radius="md"
            >
                <LoadingOverlay visible={bookingLoading} />
                <form onSubmit={form.onSubmit(handleBooking)}>
                    <Stack>
                        <Select
                            label="Preferred Room Type"
                            placeholder="Select room class"
                            data={[
                                { value: 'General', label: 'General Ward' },
                                { value: 'Standard', label: 'Standard Room' },
                                { value: 'Delux', label: 'Deluxe Suite' },
                                { value: 'ICU', label: 'ICU (Emergency)' },
                                { value: 'Private', label: 'Private Room' }
                            ]} 
                            {...form.getInputProps('roomType')}
                            withAsterisk
                            size="md"
                            leftSection={<IconBed size={18}/>}
                        />
                        <Text size="xs" c="dimmed" className="bg-blue-50 p-2 rounded text-blue-700">
                            ℹ️ A bed will be automatically assigned based on availability in the selected category.
                        </Text>
                        <Group justify="end" mt="md">
                            <Button variant="default" onClick={close}>Cancel</Button>
                            <Button type="submit" color="indigo" className="bg-indigo-600">Confirm Booking</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </div>
    );
};

// Helper icon for empty state
const IconHistoryIcon = ({size, className}:any) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 8l0 4l2 2" />
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
);

export default PatientRoomBooking;