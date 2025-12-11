import axiosInstance from "../Interceptor/AxiosInterceptor"

const getPatient = async (id : any)=>{
      return axiosInstance.get("/profile/patient/get/" + id)
      .then((res:any)=>res.data)
      .catch((err:any)=>{throw err})
}

export const updatePatient = async (patient: any) => {
  return axiosInstance.put("/profile/patient/update", patient)
    .then((res) => res.data)
    .catch((err) => { throw err });
};

const getAllPatient = async ()=>{
      return axiosInstance.get("/profile/patient/all" )
      .then((res:any)=>res.data)
      .catch((err:any)=>{throw err})
}


export { getPatient,getAllPatient };