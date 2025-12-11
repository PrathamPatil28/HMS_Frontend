import { useState, useEffect } from "react";
import { Button, Select, Textarea, Card, Title, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { BookingRequestDTO, createBooking } from "../../../Service/AmbulanceService";
import { getPatientsByDoctor } from "../../../Service/AppointmentService"; 
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

interface PatientSelect {
    value: string;
    label: string;
}

const RequestAmbulance = () => {
    const user = useSelector((state: any) => state.user);
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<PatientSelect[]>([]);

    // Form setup
    const form = useForm({
        initialValues: {
            patientId: "",
            pickupLocation: "",
            dropLocation: "",
            bookingType: "EMERGENCY"
        },
        validate: {
            patientId: (value) => (value ? null : "Please select a patient"),
            pickupLocation: (value) => (value.length > 3 ? null : "Pickup location is required"),
            dropLocation: (value) => (value.length > 3 ? null : "Drop location is required"),
        },
    });

    // Fetch patients assigned to this doctor for the dropdown
    useEffect(() => {
        // ✅ FIX: Changed from user.id to user.profileId
        if (user?.profileId) {
            getPatientsByDoctor(user.profileId)
                .then((data: any[]) => {
                    console.log("patient data fetched:", data);
                    
                    const formatted = data.map(p => ({
                        // Storing ID and Name in value string to parse later
                        value: JSON.stringify({ id: p.patientId, name: p.name }),
                        label: `${p.name}`
                    }));
                    setPatients(formatted);
                })
                .catch((err) => console.error("Failed to load patients", err));
        }
    }, [user?.profileId]); // ✅ FIX: dependency changed to profileId

const handleSubmit = (values: typeof form.values) => {
    setLoading(true);

    let selectedPatient;
    try {
        selectedPatient = JSON.parse(values.patientId);
    } catch (e) {
        errorNotification("Invalid Patient Selection");
        setLoading(false);
        return;
    }

    const payload: BookingRequestDTO = {
        patientId: selectedPatient.id,
        requestedBy: "DOCTOR", // REQUIRED by backend
        pickupLocation: values.pickupLocation,
        destinationLocation: values.dropLocation, // FIXED
        bookingType: values.bookingType === "EMERGENCY" ? "EMERGENCY" : "NORMAL",
    };

    createBooking(payload)
        .then(() => {
            successNotification("Ambulance Requested Successfully");
            form.reset();
        })
        .catch((err) =>
            errorNotification(err.response?.data?.message || "Request Failed")
        )
        .finally(() => setLoading(false));
};


    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="max-w-2xl mx-auto mt-5">
            <Title order={3} mb="md" className="text-neutral-700">Request Ambulance</Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Select
                    label="Select Patient"
                    placeholder="Search patient by name"
                    data={patients}
                    searchable
                    nothingFoundMessage="No patients found"
                    {...form.getInputProps("patientId")}
                    mb="md"
                />

                <Select
                    label="Booking Type"
                    data={["EMERGENCY", "NON_EMERGENCY"]}
                    {...form.getInputProps("bookingType")}
                    mb="md"
                />

                <Group grow mb="md">
                    <Textarea
                        label="Pickup Location"
                        placeholder="Enter complete address"
                        {...form.getInputProps("pickupLocation")}
                        rows={3}
                    />
                    <Textarea
                        label="Drop Location"
                        placeholder="Hospital Name / Address"
                        {...form.getInputProps("dropLocation")}
                        rows={3}
                    />
                </Group>

                <Button type="submit" fullWidth loading={loading} color="red">
                    Submit Request
                </Button>
            </form>
        </Card>
    );
};

export default RequestAmbulance;