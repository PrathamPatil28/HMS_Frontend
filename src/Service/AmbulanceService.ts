import axiosInstance from "../Interceptor/AxiosInterceptor";

// --- Enums ---

export type VehicleType = "ICU" | "BASIC_LIFE_SUPPORT" | "ADVANCED_LIFE_SUPPORT" | "MORTUARY";

// Helper for UI mapping if needed, but API sends the keys above
export const VehicleTypeMap: Record<string, VehicleType> = {
  BASIC: "BASIC_LIFE_SUPPORT",
  ADVANCED: "ADVANCED_LIFE_SUPPORT",
  ICU: "ICU",
  MORTUARY: "MORTUARY",
};

export type AmbulanceStatus = "AVAILABLE" | "BOOKED" | "OUT_OF_SERVICE";
export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";
export type BookingStatus = "REQUESTED" | "ACCEPTED" | "ON_THE_WAY" | "COMPLETED" | "CANCELLED";
export type BookingType = "EMERGENCY" | "NORMAL";
export type RequestedBy = "PATIENT" | "DOCTOR" | "ADMIN";

// --- Interfaces (DTOs) ---

export interface AmbulanceDTO {
  id?: number;
  vehicleNumber: string;
  vehicleType: VehicleType;
  capacity?: number; // Added based on Backend
  status: AmbulanceStatus;
  driverId?: number;
  location?: string; // Added based on Backend
}

export interface DriverDTO {
  id: number;
  userId?: number;
  name: string;
  email?: string;        // Added
  address?: string;      // Added
  profilePictureId?: number; // Added
  phone: string;
  licenseNumber: string;
  experienceYears?: number; // Added
  status: DriverStatus;
  currentLat?: number;
  currentLng?: number;
  lastLocationUpdate?: string; // LocalDateTime string
}

export interface BookingDTO {
  id: number;
  patientId: number;
  requestedBy?: RequestedBy;

  // Location Details
  pickupLocation: string;
  pickupLat?: number;
  pickupLng?: number;

  destinationLocation: string; // Renamed from dropLocation to match Backend
  dropLat?: number;
  dropLng?: number;

  // Trip Details
  routeGeometry?: string;
  totalDistanceKm?: number;
  estimatedDurationMin?: number;

  // Status & Meta
  status: BookingStatus;
  bookingType: BookingType;
  ambulanceId?: number;
  driverId?: number;
  driverUserId?: number;

  // Financials & Time
  totalCharge?: number; // BigDecimal becomes number in JS
  startTime?: string;
  endTime?: string;

  createdAt: string;
  // createdAt is managed by JPA, usually returned in response if needed, 
  // but DTO implies 'startTime' is the key time field here.
}

export interface BookingRequestDTO {
  patientId: number;
  requestedBy: RequestedBy;
  pickupLocation: string;
  destinationLocation: string; // Matches Backend DTO
  bookingType: BookingType;

  // Optional: Include coords if your FE Geocodes them
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
}

// --- AMBULANCE API ---

export const getAllAmbulances = (): Promise<AmbulanceDTO[]> =>
  axiosInstance.get("/ambulances").then((res) => res.data);

export const getAvailableAmbulances = (): Promise<AmbulanceDTO[]> =>
  axiosInstance.get("/ambulances/available").then((res) => res.data);

export const addAmbulance = (data: any) => {
  const payload = {
    ...data,
    // Ensure the enum string matches exactly what BE expects
    vehicleType: VehicleTypeMap[data.vehicleType] || data.vehicleType,
  };
  return axiosInstance.post("/ambulances", payload).then((res) => res.data);
};

export const updateAmbulanceStatus = (id: number, status: AmbulanceStatus) =>
  axiosInstance.put(`/ambulances/${id}/status`, { status }).then((res) => res.data);

// --- DRIVER API (Admin Context) ---

export const getAllDrivers = (): Promise<DriverDTO[]> =>
  axiosInstance.get("/ambulances/drivers").then((res) => res.data);

export const getAvailableDrivers = (): Promise<DriverDTO[]> =>
  axiosInstance.get("/ambulances/drivers/available").then((res) => res.data);

export const updateDriverStatus = (id: number, status: DriverStatus) =>
  axiosInstance.put(`/ambulances/drivers/${id}/status`, { driverStatus: status }).then((res) => res.data);

// Location Update
export const updateDriverLocation = (driverId: number, lat: number, lng: number) => {
  return axiosInstance.put(`/ambulances/drivers/${driverId}/location?lat=${lat}&lng=${lng}`).then(res => res.data);
};

// --- BOOKING API ---

export const getAllBookings = (): Promise<BookingDTO[]> =>
  axiosInstance.get("/ambulances/bookings").then((res) => res.data);

export const createBooking = (data: BookingRequestDTO) => {
  return axiosInstance.post("/ambulances/bookings", data).then((res) => res.data);
};

export const getBookingsByPatient = (patientId: number | string): Promise<BookingDTO[]> => {
  return axiosInstance.get(`/ambulances/bookings/patient/${patientId}`).then((res) => res.data);
};

export const assignBooking = (bookingId: number, ambulanceId: number, driverId: number) =>
  // Matches AssignBookingDTO: { ambulanceId, driverId }
  axiosInstance.put(`/ambulances/bookings/${bookingId}/assign`, { ambulanceId, driverId }).then((res) => res.data);

export const updateBookingStatus = (bookingId: number, status: BookingStatus) =>
  axiosInstance.put(`/ambulances/bookings/${bookingId}/status`, { status }).then((res) => res.data);

export const getCompletedAmbulanceTrips = (): Promise<BookingDTO[]> => {
  return axiosInstance.get("/ambulances/bookings/completed").then(res => res.data);
};

export const geocodeAddress = (address: string) => {
  return axiosInstance.get(`/ambulances/map/geocode?address=${encodeURIComponent(address)}`)
    .then(res => res.data);
};