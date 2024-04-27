import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "../pages/Signup";
import Registerer from "../pages/RegistererPortal";
import AddDoctor from "../pages/AddDoctor";         
import AdminLogin from "../pages/AdminLogin";      
import AdminPage from "../pages/AdminPage";      
const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/registererportal",
        element: <Registerer />,
    },
    {
        path: "/adddoctor",                       
        element: <AddDoctor />,
    },
    {
        path: "/adminlogin",                     
        element: <AdminLogin />,
    },
    {
        path: "/adminpage",                       
        element: <AdminPage />,
    },
]);

export default router;
