import { useEffect, useState } from "react";
import { getAllDoctor } from "../../../Service/DoctorProfileService";
import { Breadcrumbs, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import DoctorCard from "./DoctorCard";


const Doctor = () => {
     const [doctor, setDoctor] = useState<any[]>([]);
   useEffect (()=>{
           getAllDoctor()
           .then((data:any)=>{
                console.log("Doctor Data",data);   
                setDoctor(data);
           }).catch((err:any)=>{
               console.log("Error in fetching patient data", err)
           })
      },[])

    return (
        <div>
            <Breadcrumbs mb="md">
                {/* <Link className="text-primary-400 hover:underline" to="/admin/patients">Patient</Link> */}
                <Link className="text-primary-400 hover:underline" to="/admin/doctor">Doctor</Link>
                <Text className="!text-primary-400">Details</Text>
            </Breadcrumbs>

              <div className="grid grid-cols-3 gap-5 ">
               {
                doctor.map((doctor)=>(
                        <DoctorCard key={doctor.id} {...doctor}/>
                ))              
             }   
             </div>
        </div>
    )
}

export default Doctor
