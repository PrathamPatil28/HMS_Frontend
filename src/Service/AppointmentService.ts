import axiosInstance from "../Interceptor/AxiosInterceptor"

const scheduleAppointment = async (data: any) => {
    return axiosInstance.post("/appointment/schedule", data)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const cancelAppointment = async (id: any) => {
    return axiosInstance.put("/appointment/cancel/" + id)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getAppointment = async (id: any) => {
    return axiosInstance.get("/appointment/get/" + id)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getAppointmentDetails = async (id: any) => {
    return axiosInstance.get("/appointment/get/details/" + id)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getAllApointmentByPatient = async (patientId: any) => {
    return axiosInstance.get("/appointment/getAllByPatient/" + patientId)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getAllApointmentByDoctor = async (doctortId: any) => {
    return axiosInstance.get("/appointment/getAllByDoctor/" + doctortId)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const createAppointmentReport = (data: any) => {
    return axiosInstance.post("/appointment/report/create", data)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const isReportExists = async (appointmentId: any) => {
    return axiosInstance.get("/appointment/report/isRecordExist/" + appointmentId)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getReportByPatientId = async (patientId: any) => {
    return axiosInstance.get("/appointment/report/getRecordsByPatientId/" + patientId)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getPrescriptionByPatientId = async (patientId: any) => {
    return axiosInstance.get("/appointment/report/getPrescriptionByPatientId/" + patientId)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}


const rescheduleAppointment = async (appointmentId: any, newDateTime: any) => {
    return axiosInstance.put(`/appointment/reschedule/${appointmentId}?newDateTime=${encodeURIComponent(newDateTime)}`)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });
};

const completeAppointment = async (id: any) => {
    return axiosInstance.put("/appointment/complete/" + id)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err });
}


const getAllPrescription = async () => {
    return axiosInstance.get("/appointment/report/getAllPrescription")
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getMedicineByPrescriptionId = async (prescriptionId: any) => {
    return axiosInstance.get("/appointment/report/getMedicineByPrescriptionId/" + prescriptionId)
        .then((res: any) => res.data)
        .catch((err: any) => { throw err })
}

const getPatientsByDoctor = async (doctorId: any) => {
    return axiosInstance
        .get(`/appointment/getPatientsByDoctor/${doctorId}`)
        .then((res: any) => res.data)
        .catch((err: any) => {
            throw err;
        });
};


export {
    scheduleAppointment, cancelAppointment, getAppointment, getAppointmentDetails,
    getAllApointmentByPatient, getAllApointmentByDoctor, createAppointmentReport, isReportExists, getReportByPatientId, getPrescriptionByPatientId
    , rescheduleAppointment, getAllPrescription, getMedicineByPrescriptionId, getPatientsByDoctor,completeAppointment
}; 