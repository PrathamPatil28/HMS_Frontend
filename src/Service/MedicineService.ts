import axiosInstance from "../Interceptor/AxiosInterceptor";

// ✅ UPDATED: Accepts page and size for server-side pagination
const getAllMedicines = async (page: number = 0, size: number = 10) => {
  return axiosInstance
    .get(`/pharmacy/medicines?page=${page}&size=${size}`)
    .then((res: any) => res.data) // Returns { content: [], totalElements: 100, ... }
    .catch((err: any) => {
      throw err;
    });
};

const getMedicineById = async (id: number) => {
  return axiosInstance
    .get(`/pharmacy/medicines/${id}`)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const addMedicine = async (medicine: any) => {
  return axiosInstance
    .post("/pharmacy/medicines/add", medicine)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const updateMedicine = async (medicine: any) => {
  return axiosInstance
    .put("/pharmacy/medicines/update", medicine)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const deleteMedicine = async (id: number) => {
  return axiosInstance
    .delete(`/pharmacy/medicines/delete/${id}`)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

export {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
};