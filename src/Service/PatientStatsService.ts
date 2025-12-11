import axiosInstance from "../Interceptor/AxiosInterceptor";

// 1. Appointment, Prescription & History (Bundled)
export const getPatientDashboardData = async (patientId: number) => {
    return axiosInstance.get(`/appointment/patient/dashboard/${patientId}`)
        .then(res => res.data);
};

// 2. Billing (Unpaid Due)
export const getPatientUnpaidDue = async (patientId: number) => {
    return axiosInstance.get(`/bills/patient/due/${patientId}`)
        .then(res => res.data);
};

// 3. Lab (Recent Requests)
export const getRecentLabRequests = async (patientId: number) => {
    return axiosInstance.get(`/lab/request/patient/${patientId}/recent`)
        .then(res => res.data);
};

// 4. Blood Bank (Recent Requests)
export const getRecentBloodRequests = async (patientId: number) => {
    return axiosInstance.get(`/blood/request/patient/${patientId}/recent`)
        .then(res => res.data);
};

// 5. Ambulance (Active Booking)
export const getActiveAmbulanceBooking = async (patientId: number) => {
    return axiosInstance.get(`/ambulances/bookings/active/patient/${patientId}`)
        .then(res => res.data)
        .catch(() => null); // Return null if 204 No Content
};