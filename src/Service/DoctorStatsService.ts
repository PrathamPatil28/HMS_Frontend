import axiosInstance from "../Interceptor/AxiosInterceptor";

export const getDoctorDashboardStats = async (doctorId: number) => {
    return axiosInstance.get(`/appointment/doctor/dashboard/${doctorId}`)
        .then(res => res.data);
};