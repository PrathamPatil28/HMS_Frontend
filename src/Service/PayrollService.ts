import axiosInstance from "../Interceptor/AxiosInterceptor";

// --- Enums ---
export enum EmployeeRole {
    DOCTOR = "DOCTOR",
    DRIVER = "DRIVER",
    TECHNICIAN = "LAB_TECHNICIAN",
    ADMIN = "ADMIN"
}

export enum PaymentStatus {
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED", // Waiting for approval
    PAID = "PAID",
    FAILED = "FAILED"
}

// --- Interfaces ---
export interface SalaryStructureDTO {
    id?: number;
    userId: number;
    userName: string;
    role: EmployeeRole;
    baseSalary: number;
    variableRate: number; // Commission per patient/trip
}

export interface SalarySlipDTO {
    id: number;
    userId: number;
    userName: string;
    role: EmployeeRole;
    month: string;
    year: number;
    baseAmount: number;
    variableAmount: number;
    totalSalary: number;
    status: PaymentStatus;
    generatedDate: string;
}

// --- API Calls ---

// 1. [ADMIN] Upsert Salary Structure (Define Rules)
export const saveSalaryStructure = (data: SalaryStructureDTO) => {
    return axiosInstance.post("/payroll/structure", data).then((res) => res.data);
};

// 2. [ADMIN] Get Structure for specific user
export const getSalaryStructure = (userId: number) => {
    return axiosInstance.get(`/payroll/structure/${userId}`).then((res) => res.data);
};

// 3. [ADMIN] Manual Trigger for Monthly Payroll
export const generateMonthlyPayroll = () => {
    return axiosInstance.post("/payroll/generate-all").then((res) => res.data);
};

// 4. [ADMIN] Get All Generated Slips (History)
export const getAllSalarySlips = () => {
    return axiosInstance.get("/payroll/history/all").then((res) => res.data);
};

// 5. [EMPLOYEE] Get My Salary History
export const getMySalaryHistory = (userId: number) => {
    return axiosInstance.get(`/payroll/history/${userId}`).then((res) => res.data);
};

// 6. [EMPLOYEE] Get Specific Slip Detail
export const getSlipDetails = (slipId: number) => {
    return axiosInstance.get(`/payroll/slip/${slipId}`).then((res) => res.data);
};