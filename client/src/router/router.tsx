import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/authentication/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "../pages/authentication/Signup";
import Receptionist from "../pages/Receptionist/Receptionist";
import AdminPage from "../pages/Admin/Admin";
import Cookies from "js-cookie";
import DoctorPage from "../pages/Doctor/Doctor";
import PatientPage from "../pages/Patient/Patient.jsx";
import AppointmentPage from "../pages/Appointment/Appointment.jsx";
import ReceptionistPortal from "../pages/Receptionist/receptionist-portal";


// Function to check if user is authenticated
const isAuthenticated = () => {
    // Check if the authentication cookie exists
    return (
        Cookies.get("authToken") !== undefined &&
        Cookies.get("authToken") !== ""
    );
};

// ProtectedRoute component to handle private routes
const ProtectedRoute = ({ element, path }: any) => {
    return isAuthenticated() ? (
        element
    ) : (
        <Navigate to="/login" replace state={{ from: path }} />
    );
};

const Router = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/receptionist" element={<ReceptionistPortal/>} />
            <Route path="/receptionist-add" element={<Receptionist/>} />

            <Route
                path="/admin-portal"
                element={<ProtectedRoute element={<AdminPage />} />}
            />
            <Route
                path="/doctor-portal/:doctorId"
                element={<ProtectedRoute element={<DoctorPage />} />}
            />

            <Route
                path="/patient-portal/:patientId"
                element={<ProtectedRoute element={<PatientPage />} />}
            />

            <Route
                path="/appointments/:patientId/:doctorId"
                element={<ProtectedRoute element={<AppointmentPage />} />}
            />

            <Route path="/" element={<Login />} />
        </Routes>
    );
};

export default Router;
