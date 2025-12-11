import axiosInstance from "../Interceptor/AxiosInterceptor";

// Get All Data (Beds + Allotments + History)
export const getAllRoomData = async () => {
    return axiosInstance.get("/rooms/allotment-list")
        .then(res => res.data);
};

// Admin: Add New Room Inventory
export const addRoomInventory = async (data: any) => {
    return axiosInstance.post("/rooms/add", data)
        .then(res => res.data);
};

// Admin: Admit Patient
export const admitPatient = async (data: { patientId: number, bedId: number }) => {
    return axiosInstance.post("/rooms/admit", data)
        .then(res => res.data);
};

// Admin: Discharge Patient
export const dischargePatient = async (allotmentId: number) => {
    return axiosInstance.put(`/rooms/discharge/${allotmentId}`)
        .then(res => res.data);
};

// Patient: Book a room by Type
export const bookRoomByPatient = async (data: { patientId: number, roomType: string }) => {
    return axiosInstance.post("/rooms/book", data)
        .then(res => res.data);
};

// ... existing imports

// Admin: Get Room Stats
export const getRoomStats = async () => {
    return axiosInstance.get("/rooms/admin/stats")
        .then(res => res.data);
};

