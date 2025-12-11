import { Breadcrumbs, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import {  Link } from "react-router-dom"
import { getAllPatient } from "../../../Service/PatientProfileService"

import PatientTable from "./PatientCard"


const Patient = () => {
     
    const [patient, setPatient] = useState<any[]>([]);
    
      useEffect (()=>{
           getAllPatient()
           .then((data:any)=>{
                console.log("Patient Data",data);   
                setPatient(data);
           }).catch((err:any)=>{
               console.log("Error in fetching patient data", err)
           })
      },[])

    return (
        <div>
            <Breadcrumbs mb="md">
                {/* <Link className="text-primary-400 hover:underline" to="/admin/patients">Patient</Link> */}
                <Link className="text-primary-400 hover:underline" to="/admin/patients">Patient</Link>
                <Text className="!text-primary-400">Details</Text>
            </Breadcrumbs>
             <div className="grid grid-cols-3 gap-5 ">
               {
                patient.map((patient)=>(
                        <PatientTable key={patient.id} {...patient}/>
                ))              
             }   
             </div>
        </div>
    )
}

export default Patient
