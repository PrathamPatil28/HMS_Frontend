import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';

import PublicRoute from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoute";

// --- Eager Load Landing & Auth ---
import LandingPage from '../Pages/LandingPage';
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import NotFoundPage from '../Pages/PageNotFound/NotFoundPage';

// --- Lazy Load layouts ---
const AdminLayoutPage = lazy(() => import("../Components/layouts/AdminLayoutPage"));
const PatientLayoutPage = lazy(() => import("../Components/layouts/PatientLayoutPage"));
const DoctorLayoutPage = lazy(() => import("../Components/layouts/DoctorLayoutPage"));
const DriverLayoutPage = lazy(() => import("../Components/layouts/DriverLayoutPage"));
const LabTechnisionLayoutPage = lazy(() => import('../Components/layouts/LabTechnisionLayoutPage'));

// --- Lazy Load Inner Components (Admin) ---
// const Random = lazy(() => import("../Components/Random/Random"));
const AdminDashboardPage = lazy(() => import('../Pages/AdminPages/AdminDashboardPage'));
const AdminDoctorPage = lazy(() => import('../Pages/AdminPages/AdminDoctorPage'));
const AdminPatientPage = lazy(() => import('../Pages/AdminPages/AdminPatientPage'));
const AdminAmbulancePage = lazy(() => import('../Pages/AdminPages/AdminAmbulancePage'));
const AdminMedicinePage = lazy(() => import("../Pages/AdminPages/AdminMedicinePage"));
const AdminInventoryPage = lazy(() => import("../Pages/AdminPages/AdminInventoryPage"));
const AdminSalesPage = lazy(() => import("../Pages/AdminPages/AdminSalesPage"));
const AdminBloodBankPage = lazy(() => import('../Pages/AdminPages/AdminBloodBankPage'));
const AdminBillingPage = lazy(() => import('../Pages/AdminPages/AdminBillingPage'));
const AdminLabManagerPages = lazy(() => import('../Pages/AdminPages/AdminLabManagerPages'));
const AdminRoomPage = lazy(() => import('../Pages/AdminPages/AdminRoomPage'));
const AdminPayrollPage = lazy(() => import('../Pages/AdminPages/AdminPayrollPage'));

// --- Lazy Load Inner Components (Patient) ---
const PatientProfilePage = lazy(() => import("../Pages/PatientPages/PatientProfilePage"));
const PatientDashboardPage = lazy(() => import('../Pages/PatientPages/PatientDashboardPage'));
const PatientAppointmentPage = lazy(() => import("../Pages/PatientPages/PatientAppointmentPage"));
const PatientAmbulancePage = lazy(() => import('../Pages/PatientPages/PatientAmbulancePage'));
const PatientPrescriptionPage = lazy(() => import("../Pages/PatientPages/PatientPrescriptionPage"));
const PatientBloodPage = lazy(() => import('../Pages/PatientPages/PatientBloodPage'));
const PatientBllingPage = lazy(() => import('../Pages/PatientPages/PatientBllingPage'));
const PatientLabPage = lazy(() => import('../Pages/PatientPages/PatientLabPage'));
const PatientRoomBookPage  = lazy(() => import('../Pages/PatientPages/PatientRoomBookPage'));

// --- Lazy Load Inner Components (Doctor) ---
const DoctorProfilePage = lazy(() => import("../Pages/DoctorPages/DoctorProfilePage"));
const DoctorDashboardPage = lazy(() => import('../Pages/DoctorPages/DoctorDashboardPage'));
const DoctorAmbulancePage = lazy(() => import('../Pages/DoctorPages/DoctorAmbulancePage'));
const DoctorAppointmentPage = lazy(() => import("../Pages/DoctorPages/DoctorAppointmentPage"));
const DoctorAppointmentDetailsPage = lazy(() => import("../Pages/DoctorPages/DoctorAppointmentDetailsPage"));
const DoctorPatientsPage = lazy(() => import("../Pages/DoctorPages/DoctorPatientsPage"));
const DoctorPharmacyPage = lazy(() => import("../Pages/DoctorPages/DoctorPharmacyPage"));
const DoctorBloodPage = lazy(() => import('../Pages/DoctorPages/DoctorBloodBankPage'));
const DoctorSalaryPage= lazy(() => import( '../Pages/DoctorPages/DoctorSalaryPage'));

// --- Lazy Load Inner Components (Driver) ---
const DriverProfilePage = lazy(() => import('../Pages/DriverPages/DriverProfilePage'));
const DriverDashboardPage = lazy(() => import('../Pages/DriverPages/DriverDashboardPage'));
const DriverBookingPage = lazy(() => import('../Pages/DriverPages/DriverBookingPage'));
const DriverSalaryPage = lazy(() => import('../Pages/DriverPages/DriverSalaryPage'));


// --- Lazy Load Lab Technician Pages ---
const LabTechnisionProfilePage = lazy(() => import('../Pages/LabTechnicianPage/LabTechnicianProfilePage'));
const LabTechnicianDashboardPage = lazy(() => import('../Pages/LabTechnicianPage/LabTechnicianDashboardPage'));
const LabTechnicianRequestPage = lazy(() => import('../Pages/LabTechnicianPage/LabTechnicianRequestPage'));
const LabTechnicianSalaryPage = lazy(() => import('../Pages/LabTechnicianPage/LabTechnicianSalaryPage'));

// Global Loader Component
const PageLoader = () => (
  <Center h="100vh" w="100vw">
    <Loader size="xl" type="bars" />
  </Center>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayoutPage /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="doctor" element={<AdminDoctorPage />} />
            <Route path="patients" element={<AdminPatientPage />} />
            <Route path="ambulance" element={<AdminAmbulancePage />} />
            <Route path="medicine" element={<AdminMedicinePage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="sales" element={<AdminSalesPage />} />
            <Route path="blood-bank" element={<AdminBloodBankPage />} />
            <Route path="billing" element={<AdminBillingPage />} />
            <Route path="lab-tests" element={<AdminLabManagerPages />} />
            <Route path="room-allotment" element={<AdminRoomPage />} />
            <Route path="payroll" element={<AdminPayrollPage />} />
          </Route>

          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute><PatientLayoutPage /></ProtectedRoute>}>
            <Route path="dashboard" element={<PatientDashboardPage />} />
            <Route path="profile" element={<PatientProfilePage />} />
            <Route path="appointment" element={<PatientAppointmentPage />} />
            <Route path="ambulance" element={<PatientAmbulancePage />} />
            <Route path="prescription" element={<PatientPrescriptionPage />} />
            <Route path="blood-bank" element={<PatientBloodPage />} />
            <Route path="lab-reports" element={<PatientLabPage />} />
            <Route path="billing" element={<PatientBllingPage />} />
            <Route path="room-booking" element={<PatientRoomBookPage />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute><DoctorLayoutPage /></ProtectedRoute>}>
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            <Route path="profile" element={<DoctorProfilePage />} />
            <Route path="ambulance" element={<DoctorAmbulancePage />} />
            <Route path="appointment" element={<DoctorAppointmentPage />} />
            <Route path="appointment/:id" element={<DoctorAppointmentDetailsPage />} />
            <Route path="patients" element={<DoctorPatientsPage />} />
            <Route path="pharmacy" element={<DoctorPharmacyPage />} />
            <Route path="blood-bank" element={<DoctorBloodPage />} />
            <Route path="salary" element={<DoctorSalaryPage/>} />
          </Route>

          {/* Driver Routes */}
          <Route path="/driver" element={<ProtectedRoute><DriverLayoutPage /></ProtectedRoute>}>
            <Route path="dashboard" element={<DriverDashboardPage />} />
            <Route path="profile" element={<DriverProfilePage />} />
            <Route path="bookings" element={<DriverBookingPage />} />
            <Route path="salary" element={<DriverSalaryPage/>} />
          </Route>

          {/* Technician Routes */}
          <Route path="/lab_technician" element={<ProtectedRoute><LabTechnisionLayoutPage /></ProtectedRoute>}>
            <Route path="dashboard" element={<LabTechnicianDashboardPage />} />
            <Route path="profile" element={<LabTechnisionProfilePage />} />
            <Route path="requests" element={<LabTechnicianRequestPage />} />
            <Route path="salary" element={<LabTechnicianSalaryPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
