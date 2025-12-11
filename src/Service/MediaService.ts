import axiosInstance from "../Interceptor/AxiosInterceptor"

const uploadFile = async (file : any)=>{
      const formData = new FormData();
    formData.append('file', file)
      return axiosInstance.post("/media/upload" , formData ,{
         headers : {
            "Content-Type":'multipart/form-data'
         }
      })
      .then((res:any)=>res.data)
      .catch((err:any)=>{throw err})
}

const getFile = async (id : any)=>{
    return axiosInstance.get("/media" , id)
    .then((res:any)=>res.data)
    .catch((err:any)=>{throw err})
}

export {uploadFile , getFile};


