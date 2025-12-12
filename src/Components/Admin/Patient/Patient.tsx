import { Breadcrumbs, Text, Skeleton } from "@mantine/core"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllPatient } from "../../../Service/PatientProfileService"
import PatientCard from "./PatientCard"

const Patient = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAllPatient()
            .then((data: any) => {
                console.log("Patient Data", data);
                setPatients(data);
            })
            .catch((err: any) => {
                console.log("Error in fetching patient data", err)
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])

    return (
        <div className="w-full min-h-screen">
            {/* Breadcrumbs */}
            <Breadcrumbs mb="lg" separator="→">
                <Link 
                    className="text-primary-400 hover:underline font-medium dark:text-blue-300 transition-colors" 
                    to="/admin/patients"
                >
                    Patient
                </Link>
                <Text className="!text-primary-400 dark:!text-blue-300 font-bold">Details</Text>
            </Breadcrumbs>

            {/* Content Area */}
            {loading ? (
                // SKELETON LOADER
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                         <Skeleton key={i} height={420} radius="lg" className="dark:opacity-20" />
                    ))}
                </div>
            ) : (
                // DATA GRID
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <PatientCard key={patient.id} {...patient} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                            No patients found.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Patient