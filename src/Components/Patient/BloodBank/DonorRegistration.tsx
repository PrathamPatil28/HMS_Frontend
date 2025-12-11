import { useEffect, useState } from "react";
import { Card, Button, TextInput, Select, NumberInput, Group, Text, Badge, Avatar } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { IconDroplet, IconId } from "@tabler/icons-react";
import { addDonor, getDonorByPatientId, DonorDTO, BloodGroupsList } from "../../../Service/BloodBankService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const DonorRegistration = ({ onDonorRegistered }: { onDonorRegistered: (id: number) => void }) => {
    const user = useSelector((state: any) => state.user);
    const [existingDonor, setExistingDonor] = useState<DonorDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.profileId) {
            getDonorByPatientId(user.profileId)
                .then((data) => {
                    setExistingDonor(data);
                    onDonorRegistered(data.id!); // Notify parent component
                })
                .catch(() => { /* Not registered yet */ })
                .finally(() => setLoading(false));
        }
    }, [user?.profileId]);

    const form = useForm<DonorDTO>({
        initialValues: {
            name: user?.name || "",
            phone: "",
            email: user?.email || "",
            age: 18,
            gender: "Male",
            bloodGroup: "O_POSITIVE"
        },
        validate: {
            phone: (val) => (val.length < 10 ? "Valid phone required" : null),
            age: (val) => (val < 18 ? "Must be 18+" : null),
        }
    });

    const handleRegister = (values: DonorDTO) => {
        const payload = { ...values, patientId: user.profileId };
        addDonor(payload).then((_id) => {
            successNotification("Registered as Donor!");
            // Fetch the new profile immediately
            getDonorByPatientId(user.profileId).then(data => {
                setExistingDonor(data);
                onDonorRegistered(data.id!);
            });
        }).catch(() => errorNotification("Registration Failed"));
    };

    if (loading) return <Text>Checking records...</Text>;

    // --- VIEW: ALREADY A DONOR ---
    if (existingDonor) {
        return (
            <Card padding="xl" radius="md" withBorder className="bg-gradient-to-br from-red-50 to-white border-red-100">
                <Group>
                    <Avatar size="xl" radius="xl" color="red"><IconDroplet size={40}/></Avatar>
                    <div>
                        <Text size="lg" fw={700} className="uppercase">Digital Donor Card</Text>
                        <Text c="dimmed">ID: #{existingDonor.id}</Text>
                    </div>
                </Group>
                <Group mt="lg" grow>
                    <div>
                        <Text size="xs" c="dimmed">Name</Text>
                        <Text fw={500}>{existingDonor.name}</Text>
                    </div>
                    <div>
                        <Text size="xs" c="dimmed">Blood Group</Text>
                        <Badge size="xl" color="red">{existingDonor.bloodGroup.replace("_", " ")}</Badge>
                    </div>
                </Group>
                <Group mt="md" grow>
                     <div>
                        <Text size="xs" c="dimmed">Last Donation</Text>
                        <Text fw={500}>{existingDonor.lastDonationDate || "Not donated yet"}</Text>
                    </div>
                    <div>
                        <Text size="xs" c="dimmed">Status</Text>
                        <Badge color="green">ACTIVE</Badge>
                    </div>
                </Group>
            </Card>
        );
    }

    // --- VIEW: REGISTRATION FORM ---
    return (
        <Card padding="lg" radius="md" withBorder>
            <Group mb="md">
                <IconId size={24} className="text-red-500" />
                <Text size="lg" fw={700}>Become a Blood Donor</Text>
            </Group>
            <Text size="sm" c="dimmed" mb="lg">
                Join our community of lifesavers. Please ensure you meet the eligibility criteria.
            </Text>

            <form onSubmit={form.onSubmit(handleRegister)}>
                <TextInput label="Full Name" {...form.getInputProps("name")} mb="sm" readOnly />
                <Group grow mb="sm">
                    <TextInput label="Phone" placeholder="9876543210" {...form.getInputProps("phone")} />
                    <TextInput label="Email" {...form.getInputProps("email")} readOnly />
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
                    mb="lg" 
                />
                <Button type="submit" fullWidth color="red" size="md">Register Now</Button>
            </form>
        </Card>
    );
};

export default DonorRegistration;
