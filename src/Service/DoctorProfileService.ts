import axiosInstance from "../Interceptor/AxiosInterceptor"

const getDocotor = async (id:any)=>{
    return axiosInstance.get("/profile/doctor/get/" + id)
    .then((res:any)=>res.data)
    .catch((err:any)=>{throw err})
}

const updateDoctor = async (doctor : any)=>{
    return axiosInstance.put("/profile/doctor/update" ,doctor)
    .then((res:any)=>res.data)
    .catch((err:any)=>{throw err})
}

const getDoctorDropdown = async ()=>{
    return axiosInstance.get("/profile/doctor/dropdown")
    .then((res:any)=>res.data)
    .catch((err:any)=>{throw err})
}

const getAllDoctor = async ()=>{
      return axiosInstance.get("/profile/doctor/all" )
      .then((res:any)=>res.data)
      .catch((err:any)=>{throw err})
}

export {getDocotor , updateDoctor, getDoctorDropdown,getAllDoctor}; 