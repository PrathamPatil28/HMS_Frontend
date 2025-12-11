import axiosInstance from "../Interceptor/AxiosInterceptor";

// ==========================================
// 1. ADMIN / PROFILE MANAGEMENT
// ==========================================

// Get Driver Details by ID (Admin/Public)
export const getDriver = (id: any) => {
  return axiosInstance.get(`/ambulances/drivers/${id}`).then((res) => res.data);
};

// Update Profile (Admin/Self)
export const updateDriver = (id: any, driver: any) => {
  return axiosInstance
    .put(`/ambulances/drivers/${id}`, driver)
    .then((res) => res.data);
};

// Update Status manually (Admin Side)
export const updateDriverStatus = (id: any, status: string) => {
  return axiosInstance
    .put(`/ambulances/drivers/${id}/status`, { driverStatus: status })
    .then((res) => res.data);
};

// Get Driver Profile by User ID (For Profile Page)
export const getDriverByUser = (userId: any) => {
  return axiosInstance.get(`/ambulances/drivers/by-user/${userId}`)
    .then(res => res.data);
};

// Get All (Admin List)
export const getAllDrivers = () => {
  return axiosInstance.get("/ambulances/drivers").then((res) => res.data);
};

// ==========================================
// 2. DRIVER DASHBOARD & ACTIONS (New)
// ==========================================

// Get aggregated Dashboard Data (Status + Active Trip + Today's Count)
export const getDriverDashboard = async (userId: number) => {
    return axiosInstance.get(`/ambulances/driver-dashboard/${userId}`)
        .then(res => res.data);
};

// Toggle Online/Offline (Driver Side Switch)
export const toggleDriverStatus = async (userId: number, isOnline: boolean) => {
    return axiosInstance.put(`/ambulances/driver-dashboard/${userId}/status`, null, {
        params: { online: isOnline }
    });
};

// Update Active Trip Status (ACCEPTED -> ON_THE_WAY -> COMPLETED)
export const updateTripStatus = async (bookingId: number, status: string) => {
    return axiosInstance.put(`/ambulances/bookings/${bookingId}/status`, { status })
        .then(res => res.data);
};