import {
    Avatar, Divider, Table, Title, Text, Button,
    Input, Modal
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DateInput } from '@mantine/dates';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { getTechnician, updateTechnician } from "../../../Service/LabTechnicianProfileService";
import { errorNotification } from "../../../util/NotificationUtil";
import useProtectedImage from "../../Utilities/hook/useProtectedImage";
import { formatDateManually } from "../../../util/DateFormat";
import { DropzoneButton } from "../../Utilities/Dropzone/DropzoneButton";


const LabTechnicianProfile = () => {
    const user = useSelector((state: any) => state.user);
    const [opened, { open, close }] = useDisclosure(false);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState<any>({});

    const form = useForm({
        initialValues: {
            name: "",
            dob: "",
            profilePictureId: "",
            phone: "",
            address: "",
            qualification: "", // Specific to Technician
        },
        validate: {
            name: (v) => (!v ? "Name is required" : null),
            dob: (v) => (!v ? "Date of Birth is required" : null),
            phone: (v) => (!v ? "Phone Number is required" : null),
            address: (v) => (!v ? "Address is required" : null),
            qualification: (v) => (!v ? "Qualification is required" : null),
        },
    });

    // Fetch Profile on Load
    useEffect(() => {
        if (!user?.profileId) return;

        getTechnician(user.profileId)
            .then((data) => {
                setProfile(data);
                form.setValues({ ...data });
            })
            .catch((error) => {
                console.error(error);
                errorNotification("Failed to fetch technician profile");
            });
    }, [user?.profileId]);

    const handleEdit = () => {
        form.setValues({
            ...profile,
            dob: profile.dob ? new Date(profile.dob) : "",
        });
        setEditMode(true);
    };

    const handleSubmit = () => {
        form.validate();
        if (!form.isValid()) return;

        const values = form.getValues();

        // Inject userId for WebSocket notification targeting
        const payload: any = {
            ...values,
            userId: user.id,
        };

        submitUpdate(payload);
    };

    const submitUpdate = (payload: any) => {
        if (!user?.profileId) {
            errorNotification("Cannot update profile: Missing profile ID.");
            return;
        }

        updateTechnician(payload)
            .then(() => {
                // We rely on WebSocket for success notification, or add it here if needed
                setProfile((prev: any) => ({ ...prev, ...payload }));
                setEditMode(false);
            })
            .catch((error) => {
                console.error(error);
                errorNotification("Failed to update profile");
            });
    };

    const url = useProtectedImage(profile?.profilePictureId);

    // Fields definition
    const personalInfo = [
        { label: "Name", key: "name" },
        { label: "Date of Birth", key: "dob" },
        { label: "Phone", key: "phone" },
        { label: "Address", key: "address" },
        { label: "Qualification", key: "qualification" },
    ];

    const rows = personalInfo.map((item, index) => (
        <Table.Tr key={index}>
            <Table.Td className="font-semibold text-lg text-neutral-900">{item.label}</Table.Td>
            <Table.Td className="text-lg">
                {editMode ? (
                    item.key === "dob" ? (
                        <DateInput
                            {...form.getInputProps("dob")}
                            value={form.values.dob ? new Date(form.values.dob) : null}
                            onChange={(date) =>
                                form.setFieldValue("dob", date?.toISOString().split("T")[0] || "")
                            }
                            placeholder="Select date"
                        />
                    ) : item.key === "phone" ? (
                        <PhoneInput
                            country={"in"}
                            value={form.values.phone}
                            onChange={(phone) => form.setFieldValue("phone", phone)}
                            inputProps={{ required: true }}
                        />
                    ) : (
                        <Input
                            {...form.getInputProps(item.key)}
                            placeholder={`Enter ${item.label.toLowerCase()}`}
                        />
                    )
                ) : item.key === "dob" ? (
                    <Text>{profile.dob ? formatDateManually(profile.dob) : "-"}</Text>
                ) : (
                    <Text>{profile[item.key] || "-"}</Text>
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="p-10 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <div className="flex flex-col gap-3">
                        <Avatar
                            variant="filled"
                            src={url}
                            size={150}
                            alt="technician"
                        />
                        {editMode && <Button onClick={open} size="sm">Upload</Button>}
                    </div>
                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <Title order={2} className="text-neutral-900">{form.values.name || user.name}</Title>
                        <Text size="lg" color="dimmed">{user.email}</Text>
                        <Text size="sm" className="bg-blue-100 text-blue-800 px-2 py-1 rounded w-fit">Lab Technician</Text>
                    </div>
                </div>
                {!editMode ? (
                    <Button onClick={handleEdit} size="md" leftSection={<IconEdit />}>Edit</Button>
                ) : (
                    <Button onClick={handleSubmit} size="md">Submit</Button>
                )}
            </div>

            <Divider my="xl" />

            <div className="space-y-4">
                <Title order={3} className="text-neutral-900 !mb-7">Professional Information</Title>
                <Table striped stripedColor="blue.1" verticalSpacing={"xs"} withRowBorders withColumnBorders>
                    <Table.Tbody className="[&_td]:!w-1/2">{rows}</Table.Tbody>
                </Table>
            </div>

            <Modal
                centered
                opened={opened}
                onClose={close}
                title={<span className="text-xl font-medium">Upload Profile Picture</span>}
            >
                <DropzoneButton close={close} form={form} fieldName="profilePictureId"/>
            </Modal>
        </div>
    );
};

export default LabTechnicianProfile;