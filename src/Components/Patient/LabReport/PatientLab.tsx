import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Badge, Group, Text, Button, Timeline, ThemeIcon, Pagination, Loader } from "@mantine/core";
import { IconTestPipe, IconFileText, IconCheck, IconClock } from "@tabler/icons-react";
import { getPatientLabRequests } from "../../../Service/LabService";
import { formatDateAppShort } from "../../../util/DateFormat";


const PatientLab = () => {
    const user = useSelector((state: any) => state.user);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 8; // Show 8 cards per page

    useEffect(() => {
        if(user?.profileId) {
            setLoading(true);
            getPatientLabRequests(user.profileId, activePage - 1, pageSize)
                .then((res: any) => {
                    setRequests(res.content); // ✅ Extract content
                    setTotalPages(res.totalPages);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user, activePage]);

    if(loading && requests.length === 0) return <div className="flex justify-center mt-10"><Loader type="dots"/></div>;

    return (
        <div className="p-6">
            <Group justify="space-between" mb="lg">
                <h1 className="text-2xl font-bold text-slate-700">My Lab Reports</h1>
                {/* Pagination Top Right */}
                {totalPages > 1 && (
                    <Pagination total={totalPages} value={activePage} onChange={setActivePage} size="sm" />
                )}
            </Group>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {requests.length === 0 && !loading && <Text c="dimmed">No lab records found.</Text>}
                
                {requests.map((req) => (
                    <Card key={req.id} shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Group gap="xs">
                                <ThemeIcon color="blue" variant="light"><IconTestPipe size={18}/></ThemeIcon>
                                <Text fw={700}>{req.testName}</Text>
                            </Group>
                            <Badge color={req.status === 'COMPLETED' ? 'green' : 'orange'}>
                                {req.status}
                            </Badge>
                        </Group>

                        <Text size="xs" c="dimmed" mb="md">
                            Requested on: {formatDateAppShort(req.requestDate)}
                        </Text>

                        {req.status === 'COMPLETED' ? (
                            <div className="bg-green-50 p-3 rounded-md border border-green-100">
                                <Text size="sm" fw={600} c="green.8">Result:</Text>
                                <Text size="sm" c="dark">{req.resultValue}</Text>
                                
                                {req.reportUrl && (
                                    <Button 
                                        component="a" 
                                        href={req.reportUrl} 
                                        target="_blank"
                                        variant="subtle" 
                                        size="xs" 
                                        leftSection={<IconFileText size={14}/>}
                                        mt="xs"
                                    >
                                        View PDF Report
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Timeline active={req.status === 'PENDING' ? 0 : 1} bulletSize={14} lineWidth={2}>
                                <Timeline.Item bullet={<IconClock size={10}/>} title="Test Booked">
                                    <Text c="dimmed" size="xs">Doctor prescribed test</Text>
                                </Timeline.Item>
                                <Timeline.Item bullet={<IconTestPipe size={10}/>} title="Processing">
                                    <Text c="dimmed" size="xs">Sample collection & analysis</Text>
                                </Timeline.Item>
                                <Timeline.Item bullet={<IconCheck size={10}/>} title="Result Ready">
                                    <Text c="dimmed" size="xs">Waiting for technician</Text>
                                </Timeline.Item>
                            </Timeline>
                        )}
                    </Card>
                ))}
            </div>
             
             {/* Pagination Bottom (if lists are long) */}
             {totalPages > 1 && (
                <Group justify="center">
                     <Pagination total={totalPages} value={activePage} onChange={setActivePage} />
                </Group>
             )}
        </div>
    );
};

export default PatientLab;