import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "../pages/Signup";
import Registerer from "../pages/RegistererPortal";

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
]);

export default router;
