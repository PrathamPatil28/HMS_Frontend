import { 
  Badge, 
  Box, 
  Breadcrumbs, 
  Button, 

  Divider, 
  Grid, 
  Group, 
  Stack, 
  Tabs, 
  Text, 
  ThemeIcon, 
  Avatar,
  Paper
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAppointmentDetails, completeAppointment } from "../../../Service/AppointmentService";
import { 
  IconCalendar, 
  IconCheck, 
  IconClipboardText, 
  IconFileText, 
  IconMail, 
  IconNotes, 
  IconPhone, 
  IconPill, 
  IconTimeline, 

  IconActivity,
  IconTestPipe2
} from "@tabler/icons-react";
import { formatDateApp } from "../../../util/DateFormat";
import ApReport from "./ApReport";
import Prescription from "./Prescription";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string | null>("medical");

  useEffect(() => {
    if (id) {
      getAppointmentDetails(Number(id))
        .then((res: any) => setAppointment(res))
        .catch((err: any) => console.error("Error fetching appointment details: ", err));
    }
  }, [id]);

  // ✅ Handle Completion
  const handleComplete = () => {
    completeAppointment(id)
      .then(() => {
        successNotification("Appointment marked as Completed");
        setAppointment((prev: any) => ({ ...prev, status: 'COMPLETED' }));
      })
      .catch((err: any) => {
        console.error(err);
        errorNotification("Failed to complete appointment");
      });
  };

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      case 'SCHEDULED': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="p-2">
      {/* BREADCRUMBS */}
      <Breadcrumbs mb="lg" separator="→" className="text-sm text-gray-500">
        <Link className="hover:text-blue-600 transition-colors" to="/doctor/dashboard">Dashboard</Link>
        <Link className="hover:text-blue-600 transition-colors" to="/doctor/appointment">Appointments</Link>
        <Text c="blue" fw={500}>Details</Text>
      </Breadcrumbs>

      {/* MAIN INFO CARD */}
      <Paper shadow="sm" radius="md" withBorder className="bg-white overflow-hidden mb-6">
        <div className="p-6">
          <Group justify="space-between" align="start">
            
            {/* Patient Profile */}
            <Group>
              <Avatar 
                src={null} 
                alt={appointment.patientName} 
                color="blue" 
                radius="xl" 
                size="lg"
              >
                {appointment.patientName?.charAt(0)}
              </Avatar>
              <div>
                <Text size="xl" fw={700} className="text-slate-800">{appointment.patientName}</Text>
                <Group gap="xs" className="text-gray-500">
                  <IconMail size={14} />
                  <Text size="sm" c="dimmed">{appointment.patientEmail}</Text>
                  <Divider orientation="vertical" />
                  <IconPhone size={14} />
                  <Text size="sm" c="dimmed">{appointment.patientPhone}</Text>
                </Group>
              </div>
            </Group>

            {/* Status & Action */}
            <Stack align="flex-end" gap="xs">
              <Badge 
                size="lg" 
                variant="light" 
                color={getStatusColor(appointment.status)}
                radius="sm"
              >
                {appointment.status}
              </Badge>
              
              {/* Show Button ONLY if Scheduled */}
              {appointment.status === 'SCHEDULED' && (
                <Button 
                  size="xs" 
                  color="green" 
                  variant="filled"
                  leftSection={<IconCheck size={14} stroke={3}/>}
                  onClick={handleComplete}
                  className="transition-transform active:scale-95"
                >
                  Mark Completed
                </Button>
              )}
            </Stack>
          </Group>

          <Divider my="lg" />

          {/* Details Grid */}
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Group align="start" gap="sm">
                <ThemeIcon color="indigo" variant="light" size="md" radius="md">
                   <IconCalendar size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Date & Time</Text>
                  <Text fw={500} size="sm">
                    {appointment.appointmentTime ? formatDateApp(appointment.appointmentTime) : "N/A"}
                  </Text>
                </div>
              </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
               <Group align="start" gap="sm">
                <ThemeIcon color="orange" variant="light" size="md" radius="md">
                   <IconClipboardText size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Reason</Text>
                  <Text fw={500} size="sm">{appointment.reason || "General Checkup"}</Text>
                </div>
              </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
               <Group align="start" gap="sm">
                <ThemeIcon color="teal" variant="light" size="md" radius="md">
                   <IconNotes size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Patient Notes</Text>
                  <Text fw={500} size="sm" className="italic">
                    {appointment.notes || "No additional notes provided."}
                  </Text>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </div>
      </Paper>

      {/* TABS SECTION */}
      <Tabs 
        value={activeTab} 
        onChange={setActiveTab} 
        variant="outline" 
        radius="md" 
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <Tabs.List className="bg-gray-50 p-1">
          <Tabs.Tab 
            value="medical" 
            leftSection={<IconTimeline size={18} />}
            className="font-medium"
          >
            Medical History
          </Tabs.Tab>
          <Tabs.Tab 
            value="prescription" 
            leftSection={<IconPill size={18} />}
            className="font-medium"
          >
            Prescription
          </Tabs.Tab>
          <Tabs.Tab 
            value="report" 
            leftSection={<IconFileText size={18} />}
            className="font-medium"
          >
            Report & Diagnosis
          </Tabs.Tab>

             <Tabs.Tab 
            value="lab" 
            leftSection={<IconTestPipe2 size={18} />}
            className="font-medium"
          >
            Lab Tests
          </Tabs.Tab>


        </Tabs.List>

        <div className="p-4 min-h-[300px]">
            <Tabs.Panel value="medical">
               {/* Placeholder for Medical History */}
               <Box className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <IconActivity size={48} stroke={1.5} className="mb-3 text-gray-300"/>
                  <Text size="lg" fw={500}>No previous medical history found.</Text>
                  <Text size="sm">Past records for this patient will appear here.</Text>
               </Box>
            </Tabs.Panel>

            <Tabs.Panel value="prescription">
               <Prescription appointment={appointment}/>
            </Tabs.Panel>

            <Tabs.Panel value="report">
                <ApReport appointment={appointment} />
            </Tabs.Panel>

            
        </div>
      </Tabs>
    </div>
  )
}

export default AppointmentDetails;