import axiosInstance from "../Interceptor/AxiosInterceptor";

const getAllStocks = async () => {
  return axiosInstance
    .get("/pharmacy/inventory/all")
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const  getStockById = async (id: number) => {
  return axiosInstance
    .get(`/pharmacy/inventory/${id}`)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const addStock = async (inventory: any) => {
  return axiosInstance
    .post("/pharmacy/inventory/add", inventory)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const updateStock = async (inventory: any) => {
  return axiosInstance
    .put("/pharmacy/inventory/update", inventory)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const deleteStock = async (id: number) => {
  return axiosInstance
    .delete(`/pharmacy/inventory/delete/${id}`)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

export {
  getAllStocks,
  getStockById,
  addStock,
  updateStock,
  deleteStock,
};
