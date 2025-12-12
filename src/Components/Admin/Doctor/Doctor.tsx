import { useEffect, useState } from "react";
import { getAllDoctor } from "../../../Service/DoctorProfileService";
import { Breadcrumbs, Text, Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";
import DoctorCard from "./DoctorCard";

const Doctor = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAllDoctor()
            .then((data: any) => {
                console.log("Doctor Data", data);
                setDoctors(data);
            })
            .catch((err: any) => {
                console.log("Error in fetching doctor data", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-full min-h-screen">
            {/* Breadcrumbs */}
            <Breadcrumbs mb="lg" separator="→">
                {/* <Link className="text-primary-400 hover:underline dark:text-primary-300" to="/admin/patients">Patient</Link> */}
                <Link 
                    className="text-primary-400 hover:underline font-medium dark:text-blue-300 transition-colors" 
                    to="/admin/doctor"
                >
                    Doctor
                </Link>
                <Text className="!text-primary-400 dark:!text-blue-300 font-bold">Details</Text>
            </Breadcrumbs>

            {/* Content Area */}
            {loading ? (
                // LOADING SKELETON GRID
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} height={400} radius="lg" className="dark:opacity-20" />
                    ))}
                </div>
            ) : (
                // ACTUAL DATA GRID
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {doctors.length > 0 ? (
                        doctors.map((doc) => (
                            <DoctorCard key={doc.id} {...doc} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                            No doctors found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Doctor;