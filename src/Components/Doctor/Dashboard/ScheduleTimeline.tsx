import { Timeline, Text, Avatar, Group, Badge, Paper, Button } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";


const ScheduleTimeline = ({ schedule }: { schedule: any[] }) => {
    const navigate = useNavigate();

    if (!schedule || schedule.length === 0) {
        return (
            <Paper p="xl" withBorder className="text-center h-full flex flex-col justify-center items-center bg-white border-dashed">
                <IconClock size={40} className="text-gray-300 mb-2"/>
                <Text c="dimmed">No appointments scheduled for today.</Text>
            </Paper>
        );
    }

    return (
        <Paper p="lg" radius="md" className="h-full border-none bg-white shadow-sm">
            <Text fw={700} size="lg" mb="lg">Today's Schedule</Text>
            <Timeline active={1} bulletSize={24} lineWidth={2}>
                {schedule.map((appt, index) => {
                    // Extract time string HH:mm
                    const time = new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const isCompleted = appt.status === 'COMPLETED';

                    return (
                        <Timeline.Item 
                            key={appt.id} 
                            bullet={
                                <Avatar size={24} radius="xl" color={isCompleted ? "green" : "blue"}>
                                    {index + 1}
                                </Avatar>
                            }
                            lineVariant={isCompleted ? "solid" : "dashed"}
                        >
                            <Group justify="space-between" align="start">
                                <div>
                                    <Text c="dimmed" size="xs" fw={700}>{time}</Text>
                                    <Text size="sm" fw={600} mt={2}>{appt.patientName}</Text>
                                    <Text size="xs" c="dimmed" lineClamp={1}>{appt.reason}</Text>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge size="sm" variant="light" color={isCompleted ? "green" : "blue"}>
                                        {appt.status}
                                    </Badge>
                                    {appt.status === 'SCHEDULED' && (
                                        <Button 
                                            size="compact-xs" 
                                            variant="subtle" 
                                            onClick={() => navigate(`/doctor/appointment/${appt.id}`)}
                                        >
                                            Start
                                        </Button>
                                    )}
                                </div>
                            </Group>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </Paper>
    );
};

export default ScheduleTimeline;