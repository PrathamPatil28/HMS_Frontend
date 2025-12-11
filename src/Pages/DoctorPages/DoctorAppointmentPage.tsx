import Appointment from "../../Components/Doctor/Appointment/Appointment"
import AppointmentList from "../../Components/Doctor/Appointment/AppointmentList"



const DoctorAppointmentPage = () => {
  return (
     <div className="p-5 flex flex-col gap-5">
      <Appointment/>
      <AppointmentList/>
    </div>
  )
}

export default DoctorAppointmentPage
