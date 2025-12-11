import axiosInstance from "../Interceptor/AxiosInterceptor";

// Fetch Technician Profile by ID
export const getTechnician = async (id: any) => {
    return axiosInstance.get("/profile/technician/" + id)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });
};

// Update Technician Profile
export const updateTechnician = async (technician: any) => {
    return axiosInstance.put("/profile/technician/update", technician)
        .then((res) => res.data)
        .catch((err) => { throw err });
};

// Get Technician by User ID (Helper if needed)
export const getTechnicianByUserId = async (userId: any) => {
    return axiosInstance.get("/profile/technician/by-user/" + userId)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });

};

