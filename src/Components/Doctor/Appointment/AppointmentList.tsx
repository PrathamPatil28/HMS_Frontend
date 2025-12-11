import { useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import {
  Text,
  TextInput,
  Badge,
  Card,
  Group,
  Title,
  ActionIcon
} from "@mantine/core";
import { IconSearch, IconEye, IconCalendarTime } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllApointmentByDoctor } from "../../../Service/AppointmentService";
import { formatDateApp } from "../../../util/DateFormat";

const AppointmentList = () => {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    if (user?.profileId) {
      setLoading(true);
      getAllApointmentByDoctor(user.profileId)
        .then((data) => {
          // Sort by Date Descending (Newest First)
          const sorted = data.sort((a: any, b: any) => 
            new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime()
          );
          setAppointments(sorted);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user?.profileId]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // --- Templates ---

  const statusBodyTemplate = (rowData: any) => {
    const colorMap: Record<string, string> = {
      CANCELLED: "red",
      COMPLETED: "green",
      SCHEDULED: "blue",
      default: "gray",
    };
    return (
      <Badge 
        color={colorMap[rowData.status] || colorMap.default} 
        variant="light"
        size="sm"
      >
        {rowData.status}
      </Badge>
    );
  };

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex justify-center">
      <ActionIcon 
        variant="subtle" 
        color="blue" 
        onClick={() => navigate(`/doctor/appointment/${rowData.id}`)}
        title="View Details"
      >
        <IconEye size={18} stroke={1.5} />
      </ActionIcon>
    </div>
  );

  const dateBodyTemplate = (rowData: any) => {
     // Parse array [yyyy, mm, dd, hh, mm] or string
     let dateObj;
     if(Array.isArray(rowData.appointmentTime)) {
         const [y, m, d, h, min] = rowData.appointmentTime;
         dateObj = new Date(y, m-1, d, h, min);
     } else {
         dateObj = new Date(rowData.appointmentTime);
     }
     return <Text size="sm">{formatDateApp(dateObj)}</Text>;
  };

  // --- Render ---

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
            <IconCalendarTime size={24} className="text-blue-600"/>
            <Title order={4} className="text-slate-700">Appointment History</Title>
        </Group>
        
        <TextInput
          placeholder="Search patient..."
          leftSection={<IconSearch size={16} />}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          radius="md"
          size="sm"
        />
      </Group>

      <DataTable
        value={appointments}
        paginator
        rows={10}
        loading={loading}
        stripedRows
        size="small"
        dataKey="id"
        filters={filters}
        globalFilterFields={["patientName", "status"]}
        emptyMessage="No appointments found."
        className="text-sm"
      >
        <Column field="patientName" header="Patient Name" sortable style={{ minWidth: '12rem', fontWeight: 600 }} />
        <Column field="patientPhone" header="Phone" style={{ minWidth: '10rem' }} />
        <Column 
            field="appointmentTime" 
            header="Date & Time" 
            body={dateBodyTemplate} 
            sortable 
            style={{ minWidth: '14rem' }} 
        />
        <Column 
            field="status" 
            header="Status" 
            body={statusBodyTemplate} 
            sortable 
            style={{ minWidth: '10rem' }} 
        />
        <Column 
            header="Action" 
            body={actionBodyTemplate} 
            style={{ width: '5rem', textAlign: 'center' }} 
        />
      </DataTable>
    </Card>
  );
};

export default AppointmentList;