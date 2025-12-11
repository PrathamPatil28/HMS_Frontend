

import React, { useEffect, useState } from "react";
import {
    Avatar,
    Divider,
    Table,
    Title,
    Text,
    Button,
    Input,
    Modal,
    NumberInput,
    Select,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { DateInput } from "@mantine/dates";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDisclosure } from "@mantine/hooks";

import { getDocotor, updateDoctor } from "../../../Service/DoctorProfileService";
import { useForm } from "@mantine/form";
import { errorNotification} from "../../../util/NotificationUtil";
import { departments, specializationOptions } from "../../../Data/DoctorData";
import { DropzoneButton } from "../../Utilities/Dropzone/DropzoneButton";
import useProtectedImage from "../../Utilities/hook/useProtectedImage";

// ✅ CHANGE 1: Add userId to the Interface
interface DoctorProfileType {
    id: string;
    userId?: string | number; // <--- Added this field
    name: string;
    dob: string;
    profilePictureId?: string | null;
    phone: string;
    address: string;
    licenceNo: string;
    specialization: string;
    department: string;
    totalExp: number;
}

interface UserType {
    id: string | number; // <--- Ensure ID is defined here
    name: string;
    email: string;
    profileId?: string;
}

const DoctorProfile: React.FC = () => {
    const user = useSelector((state: any) => state.user) as UserType;
    const [opened, { open, close }] = useDisclosure(false);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState<DoctorProfileType | null>(null);

    const form = useForm<DoctorProfileType>({
        initialValues: {
            id: "",
            userId: "", // Initialize empty
            name: "",
            dob: "",
            profilePictureId: "",
            phone: "",
            address: "",
            licenceNo: "",
            specialization: "",
            department: "",
            totalExp: 0,
        },
        validate: {
            name: (v) => (!v ? "Name is required" : null),
            dob: (v) => (!v ? "Date of Birth is required" : null),
            phone: (v) => (!v ? "Phone number is required" : null),
            address: (v) => (!v ? "Address is required" : null),
            licenceNo: (v) => (!v ? "Licence Number is required" : null),
            specialization: (v) => (!v ? "Specialization is required" : null),
            department: (v) => (!v ? "Department is required" : null),
            totalExp: (v) => (v <= 0 ? "Experience must be greater than 0" : null),
        },
    });

    useEffect(() => {
        if (!user?.profileId) return;

        getDocotor(user.profileId)
            .then((data: DoctorProfileType) => {
                setProfile(data);
                form.setValues({ ...data });
            })
            .catch((error) => {
                console.error(error);
                errorNotification("Failed to fetch doctor profile");
            });
    }, [user?.profileId]);

    const handleSubmit = () => {
        form.validate();
        if (!form.isValid()) return;

        const updatedValues = form.getValues();
        if (!profile) return;

        // ✅ CHANGE 2: Explicitly inject the userId from Redux into the payload
        // This ensures that even if the DB column was null, we force the ID now.
        const payload: DoctorProfileType = {
            ...profile,
            ...updatedValues,
            userId: user.id, // <--- CRITICAL: This tells Backend who to notify (User 4)
        };

        updateDoctorProfile(payload);
    };

    const updateDoctorProfile = (payload: DoctorProfileType) => {
        updateDoctor(payload)
            .then((_updatedData) => {
                // Update local state
                setProfile(payload);
                setEditMode(false);
                // successNotification("Profile updated successfully!");
            })
            .catch((error) => {
                console.error(error);
                errorNotification("Failed to update profile");
            });
    };

    // ... rest of your rendering logic (JSX) remains exactly the same ...
    const personalInfo = [
        { label: "Name", key: "name" },
        { label: "Date of Birth", key: "dob" },
        { label: "Phone", key: "phone" },
        { label: "Address", key: "address" },
        { label: "Licence Number", key: "licenceNo" },
        { label: "Specialization", key: "specialization" },
        { label: "Department", key: "department" },
        { label: "Total Experience", key: "totalExp" },
    ];

    const url = useProtectedImage(profile?.profilePictureId);

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
                    ) : item.key === "specialization" ? (
                        <Select
                            data={specializationOptions}
                            {...form.getInputProps("specialization")}
                            value={form.values.specialization}
                            onChange={(value) => form.setFieldValue("specialization", value || "")}
                            placeholder="Select specialization"
                        />
                    ) : item.key === "department" ? (
                        <Select
                            data={departments}
                            {...form.getInputProps("department")}
                            value={form.values.department}
                            onChange={(value) => form.setFieldValue("department", value || "")}
                            placeholder="Select department"
                        />
                    ) : item.key === "totalExp" ? (
                        <NumberInput
                            {...form.getInputProps("totalExp")}
                            value={form.values.totalExp}
                            onChange={(val) => form.setFieldValue("totalExp", val as number)}
                            placeholder="Years of experience"
                            min={0}
                            max={50}
                        />
                    ) : (
                        <Input
                            {...form.getInputProps(item.key as keyof DoctorProfileType)}
                            placeholder={`Enter ${item.label.toLowerCase()}`}
                        />
                    )
                ) : (
                    <Text>{profile?.[item.key as keyof DoctorProfileType] || "-"}</Text>
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="p-10 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <div className="flex flex-col gap-3">
                        <Avatar variant="filled" src={url} size={150} alt="doctor" />
                        {editMode && <Button onClick={open} size="sm">Upload</Button>}
                    </div>
                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <Title order={2} className="text-neutral-900">{form.values.name || user.name}</Title>
                        <Text size="lg" color="dimmed">{user.email}</Text>
                    </div>
                </div>
                {!editMode ? (
                    <Button onClick={() => setEditMode(true)} size="md" leftSection={<IconEdit />}>Edit</Button>
                ) : (
                    <Button onClick={handleSubmit} size="md">Submit</Button>
                )}
            </div>

            <Divider my="xl" />

            <div className="space-y-4">
                <Title order={3} className="text-neutral-900 !mb-7">Personal Information</Title>
                <Table striped stripedColor="red.1" verticalSpacing={"xs"} withRowBorders withColumnBorders>
                    <Table.Tbody className="[&_td]:!w-1/2">{rows}</Table.Tbody>
                </Table>
            </div>

            <Modal centered opened={opened} onClose={close} title={<span className="text-xl font-medium">Upload Profile Picture</span>}>
                <DropzoneButton close={close} form={form} fieldName="profilePictureId" />
            </Modal>
        </div>
    );
};

export default DoctorProfile;