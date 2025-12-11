import { useEffect, useState } from "react";
import { Table, Button, Modal, TextInput, Select, NumberInput, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPlus, IconDroplet } from "@tabler/icons-react";
import { getAllDonors, addDonor, DonorDTO, BloodGroupsList } from "../../../Service/BloodBankService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const DonorManager = () => {
    const [donors, setDonors] = useState<DonorDTO[]>([]);
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm<DonorDTO>({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            age: 18,
            gender: "Male",
            bloodGroup: "O_POSITIVE"
        },
        validate: {
            name: (value) => (value.length < 2 ? "Name is required" : null),
            phone: (value) => (value.length < 10 ? "Valid phone required" : null),
            age: (value) => (value < 18 ? "Donor must be 18+" : null),
        },
    });

    const fetchData = () => {
        getAllDonors().then(setDonors).catch(console.error);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (values: DonorDTO) => {
        addDonor(values).then(() => {
            successNotification("Donor Registered Successfully");
            close();
            form.reset();
            fetchData();
        }).catch(() => errorNotification("Failed to add donor"));
    };

    const rows = donors.map((donor) => (
        <Table.Tr key={donor.id}>
            <Table.Td>{donor.id}</Table.Td>
            <Table.Td fw={500}>{donor.name}</Table.Td>
            <Table.Td>{donor.phone}</Table.Td>
            <Table.Td>{donor.age} / {donor.gender}</Table.Td>
            <Table.Td>
                <span className="font-bold text-red-600">{donor.bloodGroup}</span>
            </Table.Td>
            <Table.Td>{donor.lastDonationDate || "New Donor"}</Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <Group justify="space-between" mb="md">
                <h2 className="text-xl font-bold text-neutral-700">Donor Registry</h2>
                <Button leftSection={<IconPlus size={16} />} onClick={open} color="red">
                    Register Donor
                </Button>
            </Group>

            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Contact</Table.Th>
                        <Table.Th>Age/Gender</Table.Th>
                        <Table.Th>Blood Group</Table.Th>
                        <Table.Th>Last Donation</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal opened={opened} onClose={close} title="Register New Donor" centered>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput label="Full Name" {...form.getInputProps("name")} mb="sm" />
                    <Group grow mb="sm">
                        <TextInput label="Phone" {...form.getInputProps("phone")} />
                        <TextInput label="Email" {...form.getInputProps("email")} />
                    </Group>
                    <Group grow mb="sm">
                        <NumberInput label="Age" {...form.getInputProps("age")} min={18} max={65} />
                        <Select 
                            label="Gender" 
                            data={["Male", "Female", "Other"]} 
                            {...form.getInputProps("gender")} 
                        />
                    </Group>
                    <Select 
                        label="Blood Group" 
                        data={BloodGroupsList} 
                        {...form.getInputProps("bloodGroup")}
                        leftSection={<IconDroplet size={16} color="red"/>}
                        mb="lg" 
                    />
                    <Button type="submit" fullWidth color="red">Register</Button>
                </form>
            </Modal>
        </div>
    );
};

export default DonorManager;