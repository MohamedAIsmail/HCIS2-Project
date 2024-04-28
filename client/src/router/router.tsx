import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/authentication/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "../pages/authentication/Signup";
import Registerer from "../pages/Registerer/RegistererPortal";
import AdminPage from "../pages/Admin/Admin";
import Cookies from "js-cookie";

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
            <Route path="/registerpatient" element={<Registerer />} />
            <Route
                path="/admin-portal"
                element={<ProtectedRoute element={<AdminPage />} />}
            />
            <Route path="/" element={<Login />} />
        </Routes>
    );
};

export default Router;
