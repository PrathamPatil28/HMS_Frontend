import axiosInstance from "../Interceptor/AxiosInterceptor";

// =========================================================
// 1. MASTER DATA (Test Types)
// =========================================================

// ✅ Updated to support Pagination
export const getAllTestTypes = async (page = 0, size = 10) => {
    return axiosInstance.get("/lab/test-types", {
        params: { page, size }
    })
    .then((res: any) => res.data)
    .catch((err: any) => { throw err });
};

export const addTestType = async (testType: { testName: string, price: number, description?: string }) => {
    return axiosInstance.post("/lab/test-types/add", testType)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });
};

// =========================================================
// 2. REQUESTS (Doctor/Patient)
// =========================================================

export const createLabRequest = async (labRequest: any) => {
    return axiosInstance.post("/lab/request/create", labRequest)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });
};

// ✅ Updated to support Pagination
export const getPatientLabRequests = async (patientId: number, page = 0, size = 10) => {
    return axiosInstance.get(`/lab/request/patient/${patientId}`, {
        params: { page, size }
    })
    .then((res: any) => res.data)
    .catch((err: any) => { throw err });
};

// =========================================================
// 3. TECHNICIAN ACTIONS
// =========================================================

export const updateLabRequestStatus = async (id: number, status: string) => {
    return axiosInstance.put(`/lab/request/${id}/status`, null, {
        params: { status }
    })
    .then((res: any) => res.data)
    .catch((err: any) => { throw err });
};

export const addLabResult = async (resultDTO: { requestId: number, resultValue: string, reportUrl: string }) => {
    return axiosInstance.post("/lab/result/add", resultDTO)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });
};

// ✅ Updated to support Pagination
export const getAllLabRequests = async (page = 0, size = 10) => {
    return axiosInstance.get("/lab/request/all", {
        params: { page, size }
    })
    .then((res: any) => res.data)
    .catch((err: any) => { throw err });
};



// ✅ NEW: Get Technician Dashboard Stats
export const getLabDashboardStats = async () => {
    return axiosInstance.get("/lab/technician/dashboard")
        .then((res: any) => res.data);
};