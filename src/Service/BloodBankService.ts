import axiosInstance from "../Interceptor/AxiosInterceptor";

// --- Enums ---
export type BloodGroup = "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE";
export type BloodStatus = "AVAILABLE" | "USED" | "EXPIRED";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export const BloodGroupsList = [
    "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", 
    "O_POSITIVE", "O_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE"
];

// --- DTOs ---
export interface DonorDTO {
    id?: number;
    name: string;
    phone: string;
    email: string;
    age: number;
    gender: string;
    bloodGroup: BloodGroup;
    lastDonationDate?: string;
    patientId?: number;
}

export interface BloodUnitDTO { 
    id?: number;
    bloodGroup: BloodGroup;
    donorId: number; // Needed for adding
    collectedDate?: string;
    expiryDate?: string;
    status: BloodStatus;
}

export interface BloodRequestDTO {
    id?: number;
    patientId: number;
    requestedGroup: BloodGroup;
    unitsRequired: number;
    status: RequestStatus;
    requestDate?: string;
}

// --- API Calls ---

// 1. DONORS
export const addDonor = (data: DonorDTO) => {
    return axiosInstance.post("/blood/donor/add", data).then(res => res.data);
};

// NOTE: You need to add @GetMapping("/all") in DonorController
export const getAllDonors = () => {
    return axiosInstance.get("/blood/donor/all").then(res => res.data);
};

// 2. BLOOD UNITS (INVENTORY)
export const addBloodUnit = (data: BloodUnitDTO) => {
    return axiosInstance.post("/blood/unit/add", data).then(res => res.data);
};

// NOTE: You need to add @GetMapping("/all") in BloodUnitController
export const getAllBloodUnits = () => {
    return axiosInstance.get("/blood/unit/all").then(res => res.data);
};

export const markUnitAsUsed = (id: number) => {
    return axiosInstance.put(`/blood/unit/use/${id}`).then(res => res.data);
};

// 3. BLOOD REQUESTS
// NOTE: You need to add @GetMapping("/all") in BloodRequestController
export const getAllBloodRequests = () => {
    return axiosInstance.get("/blood/request/all").then(res => res.data);
};

export const approveBloodRequest = (id: number) => {
    return axiosInstance.put(`/blood/request/approve/${id}`).then(res => res.data);
};

// [NEW] Get by Patient (Doctor/Patient)
export const getBloodRequestsByPatient = (patientId: number) => {
    return axiosInstance.get(`/blood/request/patient/${patientId}`).then(res => res.data);
};

export const createBloodRequest = (data: BloodRequestDTO) => {
    return axiosInstance.post("/blood/request/create", data).then(res => res.data);
};


export const getDonorByPatientId = (patientId: number) => {
    return axiosInstance.get(`/blood/donor/patient/${patientId}`).then(res => res.data);
};

// BLOOD UNITS (History)
export const getDonationHistory = (donorId: number) => {
    return axiosInstance.get(`/blood/unit/donor/${donorId}`).then(res => res.data);
};