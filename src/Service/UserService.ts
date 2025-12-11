import axiosInstance from "../Interceptor/AxiosInterceptor"


// REGISTER
export const registerUserOtp = async (user: any) => {
    return axiosInstance.post("/user/register/otp", user);
};

export const verifyRegisterOtp = async (email: string, otp: string) => {
    return axiosInstance.post(`/user/register/verify?email=${email}&otp=${otp}`);
};

// LOGIN
export const loginUserOtp = async (loginDTO: any) => {
    return axiosInstance.post("/user/login/otp", loginDTO);
};

export const verifyLoginOtp = async (email: string, otp: string) => {
    // Returns JWT string
    return axiosInstance.post(`/user/login/verify?email=${email}&otp=${otp}`).then(res => res.data);
};


const registerUser = async (user : any)=>{
      return axiosInstance.post("/user/register" , user)
      .then((res:any)=>res.data)
      .catch((err:any)=>{throw err})
}

const loginUser = async (user : any)=>{
    return axiosInstance.post("/user/login" , user)
    .then((res:any)=>res.data)
    .catch((err:any)=>{throw err})
}

const getUserProfile = async (id: any) => {
    return axiosInstance.get(`/user/getProfile/${id}`)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });
};



export {registerUser , loginUser,getUserProfile};