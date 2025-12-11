import axiosInstance from "../Interceptor/AxiosInterceptor";

// ✅ Create a new Sale
const createSale = async (sale: any) => {
  return axiosInstance
    .post("/pharmacy/sales/create", sale)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

// ✅ Update an existing Sale
const updateSale = async (sale: any) => {
  return axiosInstance
    .put("/pharmacy/sales/update", sale)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

// ✅ Get Sale by ID
const getSaleById = async (id: number) => {
  return axiosInstance
    .get(`/pharmacy/sales/get/${id}`)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

// ✅ Get Sale Items by Sale ID
const getSaleItems = async (saleId: number) => {
  return axiosInstance
    .get(`/pharmacy/sales/getSaleItems/${saleId}`)
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
};

const getAllSales = async () => {
  return axiosInstance
    .get("/pharmacy/sales/getAll")
    .then((res: any) => res.data)
    .catch((err: any) => {
      throw err;
    });
  };

export {
  createSale,
  updateSale,
  getSaleById,
  getSaleItems,
  getAllSales
};
