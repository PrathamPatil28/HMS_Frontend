import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPatientsByDoctor } from "../../../Service/AppointmentService.ts";
import { capitalizeFirstLetter } from "../../../util/OtherUtility.tsx";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";


import {
    IconMail,
    IconPhone,
    IconCalendar,
    IconMapPin,

} from "@tabler/icons-react";

const PatientDetails = () => {
    const user = useSelector((state: any) => state.user);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");

    useEffect(() => {
        if (!user?.profileId) return;

        setLoading(true);
        getPatientsByDoctor(user.profileId)
            .then((data) => {
                setPatients(data);
                setLoading(false);
            })
            .catch((err: any) => {
                console.error("Error fetching patients:", err);
                setError("Failed to load patient data.");
                setLoading(false);
            });
    }, [user]);

    const dobBodyTemplate = (rowData: any) => (
        <span>
      <IconCalendar size={16} className="inline mr-1 text-gray-500" />
            {rowData.dob}
    </span>
    );

    const contactBodyTemplate = (rowData: any) => (
        <div className="flex flex-col gap-1">
      <span>
        <IconMail size={16} className="inline mr-1 text-gray-500" />
          {rowData.email}
      </span>
            <span>
        <IconPhone size={16} className="inline mr-1 text-gray-500" />
                {rowData.phone}
      </span>
        </div>
    );

    const addressBodyTemplate = (rowData: any) => (
        <span>
      <IconMapPin size={16} className="inline mr-1 text-gray-500" />
            {rowData.address}
    </span>
    );

    const bloodGroupBodyTemplate = (rowData: any) => (
        <Badge value={rowData.bloodGroup ? capitalizeFirstLetter(rowData.bloodGroup.replace("_", " ")) : "N/A"} severity="info" />
    );

    const allergiesBodyTemplate = (rowData: any) => {
        const allergies = rowData.allergies && JSON.parse(rowData.allergies).length > 0 ? JSON.parse(rowData.allergies) : ["None"];
        return allergies.map((a: string, idx: number) => (
            <Badge key={idx} value={a} severity="warning" className="mr-1 mb-1" />
        ));
    };

    const chronicBodyTemplate = (rowData: any) => {
        const diseases = rowData.chronicDisease && JSON.parse(rowData.chronicDisease).length > 0 ? JSON.parse(rowData.chronicDisease) : ["None"];
        return diseases.map((d: string, idx: number) => (
            <Badge key={idx} value={d} severity="danger" className="mr-1 mb-1" />
        ));
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <span className="pi pi-spin pi-spinner text-4xl"></span>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <span className="text-red-600">{error}</span>
            </div>
        );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Patients</h2>

            <div className="mb-4 flex items-center gap-2">
                <i className="pi pi-search text-gray-500 text-xl" />
                <InputText
                    placeholder="Search patients..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="flex-1"
                />
            </div>

               <DataTable
                value={patients}
                paginator
                rows={10}
                className="p-datatable-striped shadow-md"
                globalFilter={globalFilter}
                emptyMessage="No patients found."
            >
                <Column field="name" header="Name" sortable />
                <Column header="DOB" body={dobBodyTemplate} sortable />
                <Column header="Contact" body={contactBodyTemplate} />
                <Column header="Address" body={addressBodyTemplate} />
                <Column header="Blood Group" body={bloodGroupBodyTemplate} />
                <Column header="Allergies" body={allergiesBodyTemplate} />
                <Column header="Chronic Diseases" body={chronicBodyTemplate} />
            </DataTable>
        </div>
    );
};

export default PatientDetails;
