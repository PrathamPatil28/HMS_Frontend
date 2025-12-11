import {
    Avatar, Divider, Table, Title, Text, Button,
    Input, Select, TagsInput, Modal
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DateInput } from '@mantine/dates';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDisclosure } from "@mantine/hooks";
import { getPatient, updatePatient } from "../../../Service/PatientProfileService.ts";
import { useForm } from "@mantine/form";
import { errorNotification } from "../../../util/NotificationUtil"; // ✅ Removed successNotification import
import { formatDateManually } from "../../../util/DateFormat";
import { safeParseArray } from "../../../util/OtherUtility";
import { bloodGroupMap, bloodGroupOptions } from "../../../util/Helper";
import { DropzoneButton } from "../../Utilities/Dropzone/DropzoneButton";
import useProtectedImage from "../../Utilities/hook/useProtectedImage.tsx";

const PatientProfile = () => {
    // ✅ Get user from Redux to access user.id
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
            aadharNo: "",
            bloodGroup: "",
            allergies: [],
            chronicDisease: [],
        },
        validate: {
            name: (v) => (!v ? "Name is required" : null),
            dob: (v) => (!v ? "Date of Birth is required" : null),
            phone: (v) => (!v ? "Phone Number is required" : null),
            address: (v) => (!v ? "Address is required" : null),
            aadharNo: (value) =>
                !value
                    ? "Aadhar Number is required"
                    : !/^\d{12}$/.test(value)
                        ? "Aadhar Number must be exactly 12 digits"
                        : null,
        },
    });

    useEffect(() => {
        if (!user?.profileId) return;

        getPatient(user.profileId)
            .then((data) => {
                const parsed = {
                    ...data,
                    allergies: safeParseArray(data.allergies),
                    chronicDisease: safeParseArray(data.chronicDisease),
                };
                setProfile(parsed);
                form.setValues({ ...parsed });
            })
            .catch((error) => {
                console.error(error);
                errorNotification("Failed to fetch patient profile");
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

        // ✅ CHANGE 1: Inject userId from Redux into the payload
        const payload: any = {
            ...values,
            userId: user.id, // <--- CRITICAL: Tells backend who to notify
            allergies: JSON.stringify(values.allergies),
            chronicDisease: JSON.stringify(values.chronicDisease),
        };

        updatePatientProfile(payload);
    };

    const updatePatientProfile = (payload: any) => {
        if (!user?.profileId) {
            errorNotification("Cannot update profile: Missing profile ID.");
            return;
        }

        updatePatient(payload)
            .then(() => {
                // ✅ CHANGE 2: Removed manual successNotification() 
                // to prevent seeing the alert twice. The WebSocket will handle it.
                
                setProfile((prev: any) => ({ ...prev, ...payload }));
                setEditMode(false);
            })
            .catch((error) => {
                console.error(error);
                errorNotification("Failed to update profile");
            });
    };

    const url = useProtectedImage(profile?.profilePictureId);

    const personalInfo = [
        { label: "Name", key: "name" },
        { label: "Date of Birth", key: "dob" },
        { label: "Phone", key: "phone" },
        { label: "Address", key: "address" },
        { label: "Aadhar Number", key: "aadharNo" },
        { label: "Blood Group", key: "bloodGroup" },
        { label: "Allergies", key: "allergies" },
        { label: "Chronic Disease", key: "chronicDisease" },
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
                    ) : item.key === "bloodGroup" ? (
                        <Select
                            data={bloodGroupOptions}
                            {...form.getInputProps("bloodGroup")}
                            value={form.values.bloodGroup}
                            onChange={(value) => form.setFieldValue("bloodGroup", value ?? "")}
                            placeholder="Select blood group"
                        />
                    ) : item.key === "chronicDisease" || item.key === "allergies" ? (
                        <TagsInput
                            {...form.getInputProps(item.key)}
                            value={form.values[item.key]}
                            onChange={(tags) => form.setFieldValue(item.key, tags)}
                            placeholder={`Enter ${item.label.toLowerCase()}`}
                        />
                    ) : (
                        <Input
                            {...form.getInputProps(item.key)}
                            placeholder={`Enter ${item.label.toLowerCase()}`}
                        />
                    )
                ) : item.key === "aadharNo" ? (
                    <Text>{profile.aadharNo ? "********" + profile.aadharNo.slice(-4) : "-"}</Text>
                ) : item.key === "dob" ? (
                    <Text>{profile.dob ? formatDateManually(profile.dob) : "-"}</Text>
                ) : item.key === "bloodGroup" ? (
                    <Text>{bloodGroupMap[profile.bloodGroup] || "-"}</Text>
                ) : (
                    <Text>
                        {Array.isArray(profile[item.key])
                            ? profile[item.key].join(", ")
                            : profile[item.key] || "-"}
                    </Text>
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
                            alt="patient"
                        />
                        {editMode && <Button onClick={open} size="sm">Upload</Button>}
                    </div>
                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <Title order={2} className="text-neutral-900">{form.values.name || user.name}</Title>
                        <Text size="lg" color="dimmed">{user.email}</Text>
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
                <Title order={3} className="text-neutral-900 !mb-7">Personal Information</Title>
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

export default PatientProfile;