import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  ActionIcon,
  Button,
  LoadingOverlay,
  Modal,
  SegmentedControl,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCalendar, IconEdit, IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from "react-router-dom";

//import { getDoctorDropdown } from "../../../Service/DoctorProfileService"; // You might not need this if you are the doctor
import {
  cancelAppointment,
  getAllApointmentByDoctor,
  rescheduleAppointment,
  scheduleAppointment,
} from "../../../Service/AppointmentService";
import { appointmentReasons } from "../../../Data/DoctorData";
import { successNotification, errorNotification } from "../../../util/NotificationUtil";
import { formatDateApp } from "../../../util/DateFormat";
import { getAllPatient } from "../../../Service/PatientProfileService"; // You need to fetch patients to schedule for them

const Appointment = () => {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  // Data State
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("Today");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Modal State
  const [opened, { open, close }] = useDisclosure(false);
  const [rescheduleOpened, { open: openReschedule, close: closeReschedule }] = useDisclosure(false);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    reason: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    notes: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  });

  useEffect(() => {
    if (user?.profileId) {
      fetchAppointments();
      fetchPatients();
    }
  }, [user?.profileId]);

  // Fetch Patients for Dropdown (Doctor schedules for Patient)
  const fetchPatients = () => {
    getAllPatient()
      .then((data) => {
        setPatients(
          data.map((p: any) => ({
            value: String(p.id),
            label: `${p.name} (ID: ${p.id})`,
          }))
        );
      })
      .catch((error) => console.error("Error fetching patients:", error));
  };

  const fetchAppointments = () => {
    getAllApointmentByDoctor(user.profileId)
      .then((data) => setAppointments(data))
      .catch((error) => console.error(error));
  };

  // --- Helper to Parse Date safely ---
  const parseAppointmentTime = (arr: number[] | string | Date): Date => {
    if (!arr) return new Date();
    if (Array.isArray(arr)) {
      const [year, month, day, hour = 0, minute = 0, second = 0, ms = 0] = arr;
      return new Date(year, month - 1, day, hour, minute, second, ms / 1000000);
    } else if (typeof arr === "string") {
      const d = new Date(arr);
      return isNaN(d.getTime()) ? new Date() : d;
    } else if (arr instanceof Date) {
      return arr;
    }
    return new Date();
  };

  // --- Filter Logic ---
  const filteredAppointments = appointments.filter((a) => {
    const date = parseAppointmentTime(a.appointmentTime);
    const today = new Date();
    const apptDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (tab === "Today") return apptDate.getTime() === todayDate.getTime();
    if (tab === "Upcoming") return apptDate.getTime() > todayDate.getTime();
    if (tab === "Past") return apptDate.getTime() < todayDate.getTime();
    return true;
  });

  // --- Actions ---
  const handleEdit = (rowData: any) => {
    setSelectedAppointment(rowData);
    const validDate = parseAppointmentTime(rowData.appointmentTime);
    rescheduleForm.setValues({
      appointmentTime: validDate,
    });
    openReschedule();
  };

  const handleDelete = (rowData: any) => {
    modals.openConfirmModal({
      title: <span className="text-xl font-serif font-semibold">Cancel Appointment?</span>,
      centered: true,
      children: <Text size="sm">Are you sure you want to cancel this appointment with <b>{rowData.patientName}</b>? This action cannot be undone.</Text>,
      labels: { confirm: "Yes, Cancel", cancel: "No, Go Back" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        cancelAppointment(rowData.id)
          .then(() => {
            successNotification("Appointment Cancelled Successfully");
            fetchAppointments();
          })
          .catch((error) => {
            errorNotification(error.response?.data?.errorMessage || "Failed To Cancel Appointment");
          });
      },
    });
  };

  // --- Templates ---
  const actionBodyTemplate = (rowData: any) => (
    <div className="flex gap-2 justify-center">
      <ActionIcon 
        variant="subtle" 
        color="blue" 
        onClick={() => navigate(`/doctor/appointment/${rowData.id}`)} 
        title="View Details"
      >
        <IconEye size={20} stroke={1.5} />
      </ActionIcon>

      {rowData.status === 'SCHEDULED' && (
        <>
          <ActionIcon
            variant="subtle"
            color="orange"
            onClick={() => handleEdit(rowData)}
            title="Reschedule"
          >
            <IconEdit size={20} stroke={1.5} />
          </ActionIcon>

          <ActionIcon 
            variant="subtle" 
            color="red" 
            onClick={() => handleDelete(rowData)}
            title="Cancel"
          >
            <IconTrash size={20} stroke={1.5} />
          </ActionIcon>
        </>
      )}
    </div>
  );

  const statusBodyTemplate = (rowData: any) => {
    const colorMap: Record<string, string> = {
      CANCELLED: "bg-red-100 text-red-800",
      COMPLETED: "bg-green-100 text-green-800",
      SCHEDULED: "bg-blue-100 text-blue-800",
      default: "bg-gray-200 text-gray-800",
    };
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorMap[rowData.status] || colorMap.default}`}>
        {rowData.status}
      </span>
    );
  };

  const timeTemplate = (rowData: any) => {
    const date = parseAppointmentTime(rowData.appointmentTime);
    return <span className="text-slate-600">{formatDateApp(date)}</span>;
  };

  // --- Forms ---
  const scheduleForm = useForm({
    initialValues: {
      doctorId: user.profileId, // Doctor is self
      patientId: "",
      appointmentTime: new Date(),
      reason: "",
      notes: "",
    },
    validate: {
      patientId: (v) => (!v ? "Patient is required" : null),
      appointmentTime: (v) => (!v ? "Time is required" : null),
      reason: (v) => (!v ? "Reason is required" : null),
    },
  });

  const rescheduleForm = useForm({
    initialValues: {
      appointmentTime: new Date(),
    },
    validate: {
      appointmentTime: (v) => (!v ? "New time is required" : null),
    },
  });

  const handleScheduleSubmit = (values: any) => {
    setLoading(true);
    scheduleAppointment(values)
      .then(() => {
        close();
        scheduleForm.reset();
        fetchAppointments();
        successNotification("Appointment Scheduled Successfully");
      })
      .catch((error) => {
        errorNotification(error.response?.data?.message || "Error scheduling appointment");
      })
      .finally(() => setLoading(false));
  };

  const handleRescheduleSubmit = (values: any) => {
    if (!selectedAppointment) return;
    setLoading(true);
    const newDateTime = values.appointmentTime.toISOString();

    rescheduleAppointment(selectedAppointment.id, newDateTime)
      .then(() => {
        successNotification("Appointment Rescheduled Successfully");
        closeReschedule();
        fetchAppointments();
      })
      .catch((error) => {
        errorNotification(error.response?.data?.errorMessage || "Failed to Reschedule");
      })
      .finally(() => setLoading(false));
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <Toolbar
        className="mb-4 border-0"
        start={
            <Button
              leftSection={<IconCalendar size={18} />}
              onClick={open}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book Appointment
            </Button>
        }
        center={
            <SegmentedControl
              value={tab}
              onChange={setTab}
              data={["Today", "Upcoming", "Past"]}
              radius="xl"
            />
        }
        end={
            <TextInput
              leftSection={<IconSearch size={16} />}
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search..."
              radius="md"
            />
        }
      />

      <DataTable
        stripedRows
        value={filteredAppointments}
        size="small"
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={["patientName", "appointmentTime", "reason", "notes", "status"]}
        emptyMessage="No appointments found."
        className="text-sm"
      >
        <Column field="patientName" header="Patient" sortable filter style={{ minWidth: "12rem" }} />
        <Column field="patientPhone" header="Contact" style={{ minWidth: "10rem" }} />
        <Column field="appointmentTime" header="Date & Time" sortable body={timeTemplate} style={{ minWidth: "14rem" }} />
        <Column field="reason" header="Reason" sortable filter style={{ minWidth: "12rem" }} />
        <Column field="notes" header="Notes" sortable filter style={{ minWidth: "12rem" }} />
        <Column field="status" header="Status" sortable body={statusBodyTemplate} style={{ minWidth: "10rem" }} />
        <Column header="Actions" body={actionBodyTemplate} style={{ textAlign: 'center', width: '10rem' }} />
      </DataTable>

      {/* Schedule Modal */}
      <Modal opened={opened} onClose={close} title="Book Appointment for Patient" centered overlayProps={{ blur: 3 }}>
        <LoadingOverlay visible={loading} />
        <form onSubmit={scheduleForm.onSubmit(handleScheduleSubmit)} className="flex flex-col gap-4">
          <Select
            {...scheduleForm.getInputProps("patientId")}
            data={patients}
            label="Select Patient"
            placeholder="Search patient..."
            withAsterisk
            searchable
            nothingFoundMessage="No patients found"
          />
          <DateTimePicker
            {...scheduleForm.getInputProps("appointmentTime")}
            minDate={new Date()}
            label="Appointment Time"
            placeholder="Pick date and time"
            withAsterisk
          />
          <Select
            {...scheduleForm.getInputProps("reason")}
            data={appointmentReasons}
            label="Reason"
            placeholder="Select reason"
            withAsterisk
          />
          <Textarea {...scheduleForm.getInputProps("notes")} label="Notes" placeholder="Any additional details" />
          <Button type="submit" fullWidth color="blue">Confirm Booking</Button>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal opened={rescheduleOpened} onClose={closeReschedule} title="Reschedule Appointment" centered overlayProps={{ blur: 3 }}>
        <LoadingOverlay visible={loading} />
        <form onSubmit={rescheduleForm.onSubmit(handleRescheduleSubmit)} className="flex flex-col gap-4">
            <Text size="sm" c="dimmed">Select a new date and time for this appointment.</Text>
          <DateTimePicker
            {...rescheduleForm.getInputProps("appointmentTime")}
            minDate={new Date()}
            label="New Time"
            placeholder="Pick new date and time"
            withAsterisk
          />
          <Button type="submit" fullWidth color="blue">Update Appointment</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointment;