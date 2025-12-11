import axiosInstance from "../Interceptor/AxiosInterceptor";

// --- Appointment MS ---
export const getAppointmentStats = async () => {
    return axiosInstance.get("/appointment/admin/stats").then(res => res.data);
};

export const getAppointmentTrend = async () => {
    return axiosInstance.get("/appointment/admin/trend").then(res => res.data);
};

// --- Profile MS ---
export const getProfileStats = async () => {
    return axiosInstance.get("/profile/admin/stats").then(res => res.data);
};

// --- Pharmacy MS ---
export const getPharmacyStats = async () => {
    return axiosInstance.get("/pharmacy/admin/stats").then(res => res.data);
};

// --- Billing MS ---
export const getBillingStats = async () => {
    return axiosInstance.get("/bills/admin/stats").then(res => res.data);
};

// --- Blood Bank MS ---
export const getBloodStats = async () => {
    return axiosInstance.get("/blood/admin/stats").then(res => res.data);
};

// --- Lab MS ---
export const getLabStats = async () => {
    return axiosInstance.get("/lab/admin/stats").then(res => res.data);
};

// --- Ambulance MS ---
export const getAmbulanceStats = async () => {
    return axiosInstance.get("/ambulances/admin/stats").then(res => res.data);
};