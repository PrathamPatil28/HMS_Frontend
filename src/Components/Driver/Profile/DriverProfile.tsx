import React, { useEffect, useState } from "react";
import {
  Avatar,
  Divider,
  Table,
  Title,
  Text,
  Button,
  Input,
  Select,
  Modal,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

import {
  getDriverByUser,
  updateDriver,
  updateDriverStatus,
} from "../../../Service/DriverService";

import { errorNotification } from "../../../util/NotificationUtil";
import { DropzoneButton } from "../../Utilities/Dropzone/DropzoneButton";
import useProtectedImage from "../../Utilities/hook/useProtectedImage";

// ----------------------------------

interface UserType {
  id: number | string;
  name: string;
  email: string;
}

interface DriverProfileType {
  id?: number;
  userId?: number;
  name: string;
  phone: string;
  address: string;
  licenseNumber: string;
  status?: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";
  profilePictureId?: string | null;
}

// ----------------------------------

const DriverProfile: React.FC = () => {
  const user = useSelector((state: any) => state.user) as UserType;

  const [profile, setProfile] = useState<DriverProfileType | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<DriverProfileType>({
    initialValues: {
      id: 0,
      userId: 0,
      name: "",
      phone: "",
      address: "",
      licenseNumber: "",
      status: "OFF_DUTY",
      profilePictureId: "",
    },
    validate: {
      name: (v) => (!v ? "Name is required" : null),
      phone: (v) => (!v ? "Phone is required" : null),
      address: (v) => (!v ? "Address is required" : null),
      licenseNumber: (v) => (!v ? "License number is required" : null),
    },
  });

  // -------------------------------
  // LOAD DRIVER PROFILE USING user.id
  // -------------------------------
useEffect(() => {
  if (!user?.id) return;

  getDriverByUser(user.id)
    .then((data) => {
      setProfile(data);
      form.setValues({ ...data });
    })
    .catch(() => errorNotification("Failed to fetch driver profile"));
}, [user?.id]);


  // -------------------------------
  // HANDLE UPDATE DETAILS
  // -------------------------------
  const handleSubmit = () => {
    form.validate();
    if (!form.isValid()) return;

    updateDriver(profile?.id, form.values)
      .then((updated) => {
        setProfile(updated);
        setEditMode(false);
      })
      .catch(() => errorNotification("Failed to update driver profile"));
  };

  // -------------------------------
  // HANDLE STATUS UPDATE
  // -------------------------------
 const handleStatusUpdate = (status: string | null) => {
  if (!status) return;

  // Narrow to the allowed union type
  const newStatus = status as "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";

  updateDriverStatus(profile?.id, newStatus)
    .then((updated) => {
      setProfile(updated);
      form.setFieldValue("status", newStatus);
    })
    .catch(() => errorNotification("Failed to update status"));
};


  const url = useProtectedImage(profile?.profilePictureId);

  const infoRows = [
    { label: "Name", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Address", key: "address" },
    { label: "License Number", key: "licenseNumber" },
    { label: "Status", key: "status" },
  ];

  const rows = infoRows.map((item, i) => (
    <Table.Tr key={i}>
      <Table.Td className="font-semibold text-lg text-neutral-900">{item.label}</Table.Td>

      <Table.Td className="text-lg">
        {editMode ? (
          item.key === "status" ? (
            <Select
              data={[
                { value: "AVAILABLE", label: "AVAILABLE" },
                { value: "ON_TRIP", label: "ON_TRIP" },
                { value: "OFF_DUTY", label: "OFF_DUTY" },
              ]}
              value={form.values.status}
              onChange={handleStatusUpdate}
            />
          ) : (
            <Input {...form.getInputProps(item.key as keyof DriverProfileType)} />
          )
        ) : (
          <Text>{profile?.[item.key as keyof DriverProfileType] || "-"}</Text>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="p-10 space-y-8">
      {/* HEADER + PROFILE PIC */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <div className="flex flex-col gap-3">
            <Avatar variant="filled" src={url} size={150} alt="driver" />
            {editMode && <Button onClick={open} size="sm">Upload</Button>}
          </div>

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <Title order={2} className="text-neutral-900">
              {form.values.name || user.name}
            </Title>
            <Text size="lg" color="dimmed">{user.email}</Text>
          </div>
        </div>

        {!editMode ? (
          <Button onClick={() => setEditMode(true)} size="md" leftSection={<IconEdit />}>
            Edit
          </Button>
        ) : (
          <Button onClick={handleSubmit} size="md">
            Submit
          </Button>
        )}
      </div>

      <Divider my="xl" />

      {/* TABLE SECTION */}
      <div className="space-y-4">
        <Title order={3} className="text-neutral-900 !mb-7">Driver Information</Title>

        <Table striped stripedColor="blue.1" verticalSpacing="xs" withRowBorders withColumnBorders>
          <Table.Tbody className="[&_td]:!w-1/2">{rows}</Table.Tbody>
        </Table>
      </div>

      {/* UPLOAD MODAL */}
      <Modal centered opened={opened} onClose={close} title={<span className="text-xl font-medium">Upload Profile Picture</span>}>
        <DropzoneButton close={close} form={form} fieldName="profilePictureId" />
      </Modal>
    </div>
  );
};

export default DriverProfile;
