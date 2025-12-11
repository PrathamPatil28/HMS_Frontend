import { useEffect, useState } from "react";
import { 
    Table, Button, Badge, Card, Tabs, Group, Text, 
    Modal, Select, Loader, Center, TextInput, NumberInput, Divider 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { 
    IconCashBanknote, IconHistory, IconSettings, 
    IconUser, IconStethoscope, IconAmbulance, IconMicroscope 
} from "@tabler/icons-react";

import { 
    getAllSalarySlips, 
    generateMonthlyPayroll, 
    saveSalaryStructure, 
    getSalaryStructure,
    SalarySlipDTO, 
    EmployeeRole
} from "../../../Service/PayrollService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

// Helper to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const PayrollManager = () => {
    const [activeTab, setActiveTab] = useState<string | null>("history");
    const [loading, setLoading] = useState(false);

    // Data State
    const [slips, setSlips] = useState<SalarySlipDTO[]>([]);
    
    // Form State for Salary Structure
    const [userId, setUserId] = useState<number | ''>('');
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState<string | null>(EmployeeRole.DOCTOR);
    const [baseSalary, setBaseSalary] = useState<number | ''>('');
    const [variableRate, setVariableRate] = useState<number | ''>('');

    // Modal State for Confirmation
    const [opened, { open, close }] = useDisclosure(false);

    // Initial Load
    useEffect(() => {
        if(activeTab === 'history') fetchHistory();
    }, [activeTab]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await getAllSalarySlips();
            setSlips(data);
        } catch (error) {
            errorNotification("Failed to fetch payroll history");
        } finally {
            setLoading(false);
        }
    };

    // Fetch existing structure when user ID changes (Auto-fill)
    const handleUserBlur = async () => {
        if (!userId) return;
        try {
            const data = await getSalaryStructure(Number(userId));
            if (data) {
                setUserName(data.userName);
                setRole(data.role);
                setBaseSalary(data.baseSalary);
                setVariableRate(data.variableRate);
                successNotification(`Loaded existing salary rule for ${data.userName}`);
            }
        } catch (e) {
            // Ignore 404 (New User) - No notification needed here
        }
    };

    const handleSaveStructure = async () => {
        if (!userId || !userName || !baseSalary || variableRate === '') {
            errorNotification("Please fill all fields");
            return;
        }

        try {
            await saveSalaryStructure({
                userId: Number(userId),
                userName,
                role: role as EmployeeRole,
                baseSalary: Number(baseSalary),
                variableRate: Number(variableRate)
            });
            successNotification("Salary Structure Saved Successfully!");
            // Reset Form
            setUserId(''); setUserName(''); setBaseSalary(''); setVariableRate('');
        } catch (error) {
            errorNotification("Failed to save structure");
        }
    };

    const handleGeneratePayroll = async () => {
        close(); // Close modal
        setLoading(true);
        try {
            await generateMonthlyPayroll();
            successNotification("Payroll Batch Process Initiated!");
            setTimeout(fetchHistory, 2000); // Wait a bit then refresh list
        } catch (error) {
            errorNotification("Failed to generate payroll");
            setLoading(false);
        }
    };

    // Role Badge Color Helper
    const getRoleBadgeColor = (role: string) => {
        switch(role) {
            case 'DOCTOR': return 'blue';
            case 'DRIVER': return 'orange';
            case 'TECHNICIAN': return 'grape';
            default: return 'gray';
        }
    };

    // Status Badge Helper
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'PAID': return 'green';
            case 'PROCESSING': return 'yellow';
            case 'FAILED': return 'red';
            default: return 'blue';
        }
    };

    return (
        <div className="p-5 bg-gray-50 min-h-screen">
            <Group justify="space-between" mb="lg">
                <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                    <IconCashBanknote size={32} /> Payroll Manager
                </h1>
                <Button 
                    color="indigo" 
                    variant="light" 
                    leftSection={<IconSettings size={18} />}
                    onClick={() => setActiveTab('structure')}
                >
                    Configure Rules
                </Button>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab} color="indigo" radius="md">
                <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
                    <Tabs.Tab value="history" leftSection={<IconHistory size={18}/>}>
                        Payroll History
                    </Tabs.Tab>
                    <Tabs.Tab value="structure" leftSection={<IconSettings size={18}/>}>
                        Salary Structure
                    </Tabs.Tab>
                </Tabs.List>

                {/* --- TAB 1: PAYROLL HISTORY --- */}
                <Tabs.Panel value="history">
                    <Card withBorder radius="md" p="lg" shadow="sm">
                        <Group justify="space-between" mb="md">
                            <Text fw={600} size="lg">Processed Salaries</Text>
                            <Button color="green" onClick={open} leftSection={<IconCashBanknote size={18} />}>
                                Run Monthly Payroll
                            </Button>
                        </Group>

                        {loading ? (
                            <Center h={200}><Loader size="lg" color="indigo"/></Center>
                        ) : slips.length === 0 ? (
                            <Text c="dimmed" ta="center" py="xl">No payroll records found.</Text>
                        ) : (
                            <Table striped highlightOnHover verticalSpacing="sm">
                                <Table.Thead className="bg-gray-50">
                                    <Table.Tr>
                                        <Table.Th>Employee</Table.Th>
                                        <Table.Th>Role</Table.Th>
                                        <Table.Th>Period</Table.Th>
                                        <Table.Th>Base Salary</Table.Th>
                                        <Table.Th>Variable (Commission)</Table.Th>
                                        <Table.Th>Total Payout</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {slips.map((slip) => (
                                        <Table.Tr key={slip.id}>
                                            <Table.Td>
                                                <Group gap="sm">
                                                    <IconUser size={16} className="text-gray-400"/>
                                                    <div>
                                                        <Text size="sm" fw={500}>{slip.userName}</Text>
                                                        <Text size="xs" c="dimmed">ID: {slip.userId}</Text>
                                                    </div>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge color={getRoleBadgeColor(slip.role)} variant="light">
                                                    {slip.role}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td className="uppercase font-mono text-xs">
                                                {slip.month} {slip.year}
                                            </Table.Td>
                                            <Table.Td>{formatCurrency(slip.baseAmount)}</Table.Td>
                                            <Table.Td className="text-green-600 font-medium">
                                                +{formatCurrency(slip.variableAmount)}
                                            </Table.Td>
                                            <Table.Td fw={700} className="text-indigo-700">
                                                {formatCurrency(slip.totalSalary)}
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge color={getStatusColor(slip.status)} variant="filled">
                                                    {slip.status}
                                                </Badge>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}
                    </Card>
                </Tabs.Panel>

                {/* --- TAB 2: SALARY STRUCTURE --- */}
                <Tabs.Panel value="structure">
                    <Center>
                        <Card withBorder radius="md" p="xl" shadow="sm" className="w-full max-w-2xl bg-white">
                            <Text size="xl" fw={700} mb="xs" ta="center">Define Salary Rules</Text>
                            <Text size="sm" c="dimmed" mb="xl" ta="center">
                                Set the base salary and commission rates for employees.
                            </Text>

                            <div className="grid grid-cols-2 gap-4">
                                <NumberInput
                                    label="User ID"
                                    placeholder="Enter Employee ID"
                                    value={userId}
                                    onChange={(val: any) => setUserId(val)}
                                    onBlur={handleUserBlur}
                                    required
                                    leftSection={<IconUser size={16}/>}
                                />
                                <TextInput
                                    label="User Name"
                                    placeholder="Employee Name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>

                            <Select
                                label="Role"
                                mt="md"
                                placeholder="Select Role"
                                data={[
                                    { value: 'DOCTOR', label: 'Doctor (Base + Per Patient)' },
                                    { value: 'DRIVER', label: 'Driver (Base + Per Trip)' },
                                    { value: 'TECHNICIAN', label: 'Technician (Fixed + Bonus)' }
                                ]}
                                value={role}
                                onChange={setRole}
                                leftSection={
                                    role === 'DOCTOR' ? <IconStethoscope size={16}/> : 
                                    role === 'DRIVER' ? <IconAmbulance size={16}/> : 
                                    <IconMicroscope size={16}/>
                                }
                            />

                            <Divider my="lg" label="Compensation Details" labelPosition="center" />

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <NumberInput
                                    label="Base Salary (Monthly)"
                                    placeholder="e.g. 50000"
                                    value={baseSalary}
                                    onChange={(val: any) => setBaseSalary(val)}
                                    prefix="₹ "
                                    thousandSeparator=","
                                />
                                <div>
                                    <NumberInput
                                        label="Variable Rate"
                                        placeholder="e.g. 500"
                                        value={variableRate}
                                        onChange={(val: any) => setVariableRate(val)}
                                        prefix="₹ "
                                        thousandSeparator=","
                                    />
                                    <Text size="xs" c="dimmed" mt={4}>
                                        {role === 'DOCTOR' ? 'Commission per Patient treated' :
                                         role === 'DRIVER' ? 'Allowance per Trip completed' :
                                         'Bonus if target reached'}
                                    </Text>
                                </div>
                            </div>

                            <Button fullWidth size="md" color="indigo" onClick={handleSaveStructure}>
                                Save Configuration
                            </Button>
                        </Card>
                    </Center>
                </Tabs.Panel>
            </Tabs>

            {/* --- CONFIRMATION MODAL --- */}
            <Modal opened={opened} onClose={close} title="Confirm Payroll Generation" centered>
                <Text size="sm" mb="lg">
                    Are you sure you want to run the payroll process for <b>ALL employees</b> for the previous month?
                    <br/><br/>
                    This will:
                    <ul className="list-disc pl-5 mt-2 text-gray-600">
                        <li>Calculate variable pay based on performance.</li>
                        <li>Generate salary slips for Doctors, Drivers, and Technicians.</li>
                        <li>Update the database with new records.</li>
                    </ul>
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={close}>Cancel</Button>
                    <Button color="green" onClick={handleGeneratePayroll}>Confirm & Run</Button>
                </Group>
            </Modal>
        </div>
    );
};

export default PayrollManager;