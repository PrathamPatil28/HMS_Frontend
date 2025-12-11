import axiosInstance from "../Interceptor/AxiosInterceptor";

// --- Interfaces ---
export interface BillItemDTO {
    id: number;
    description: string;
    amount: number;
    // ✅ Updated to include new microservices
    sourceService: "AMBULANCE_MS" | "PHARMACY_MS" | "APPOINTMENT_MS" | "BLOODBANK_MS" | "ROOM_MS" | "LAB_MS";
    sourceItemId: number;
}

export interface PatientBillDTO {
    id: number;
    patientId: number;
    totalAmount: number;
    billDate: string;
    status: "PENDING" | "PAID" | "CANCELLED";
    items: BillItemDTO[];
}

export interface GenerateBillRequest {
    patientId: number;
    ambulanceBookingIds?: number[];
    pharmacySaleIds?: number[];
    // ✅ Added new fields for other services
    appointmentIds?: number[];
    bloodRequestIds?: number[];
    roomAllotmentIds?: number[]; // ✅ Added Room IDs
     labRequestIds?: number[];
}

// --- API Calls ---

// 1. Generate Bill (Admin)
export const generateBill = (data: GenerateBillRequest) => {
    return axiosInstance.post("/bills/generate", data).then((res) => res.data);
};

// 2. Get All Bills (Admin History)
export const getAllBills = () => {
    return axiosInstance.get("/bills/all").then((res) => res.data);
};

// 3. Get Bills for Patient (Patient Dashboard)
export const getMyBills = (patientId: number) => {
    return axiosInstance.get(`/bills/patient/${patientId}`).then((res) => res.data);
};

// 4. Create Payment Order (Razorpay)
export const createPaymentOrder = (billId: number, amount: number) => {
    return axiosInstance.post(`/payment/create/${billId}/${amount}`).then((res) => res.data);
};

// 5. Verify Payment (Razorpay Callback)
export const verifyPayment = (data: any) => {
    return axiosInstance.post("/payment/verify", data).then((res) => res.data);
};

// --- Fetch Unbilled Items (For Admin Billing Manager) ---

// 6. Get Pending Ambulance Trips
export const getCompletedAmbulanceTrips = () => {
    return axiosInstance.get("/ambulances/bookings/completed").then((res) => res.data);
};

// 7. Get Unbilled Pharmacy Sales [NEW]
export const getUnbilledPharmacySales = (patientId: number) => {
    return axiosInstance.get(`/pharmacy/sales/unbilled/patient/${patientId}`).then((res) => res.data);
};

// 8. Get Unbilled Appointments [NEW]
export const getUnbilledAppointments = (patientId: number) => {
    return axiosInstance.get(`/appointment/completed/unbilled/patient/${patientId}`).then((res) => res.data);
};

// 9. Get Unbilled Blood Bank Requests [NEW]
export const getUnbilledBloodRequests = (patientId: number) => {
    return axiosInstance.get(`/blood/request/approved/unbilled/patient/${patientId}`).then((res) => res.data);
};

// 10. Get Unbilled Room Charges [NEW]
export const getUnbilledRoomCharges = (patientId: number) => {
    return axiosInstance.get(`/rooms/discharged/unbilled/patient/${patientId}`).then((res) => res.data);
};

// [NEW] Get Payment Details (Transaction ID)
export const getPaymentDetails = (billId: number) => {
    return axiosInstance.get(`/payment/bill/${billId}`).then((res) => res.data);
}