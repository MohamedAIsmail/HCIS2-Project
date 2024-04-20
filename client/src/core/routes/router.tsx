import RouteModel from "./RouteModel";
import AppRoutes from "./AppRoutes";
import { ReactElement } from "react";
import React from "react";
import { Route } from "react-router-dom";

import PatientPortal from "../../modules/patient-portal/pages/profile-page";
import Login from "../../modules/auth/pages";
import AppointmentsPage from "../../modules/patient-portal/pages/appointments-page";
import PreviousAppointments from "../../modules/patient-portal/pages/appointments";
import Signup from "../../modules/user/pages/signup/SignUp";
import UpcomingAppointments from "../../modules/patient-portal/pages/appointments/upcoming";
import DentalExaminationPage from "../../modules/dental-clinic/pages/DentalExaminationPage";
import DentalClinicPortal from "../../modules/dental-clinic/pages/DentalClinicPortal";

class Router {
    static readonly routes: RouteModel[] = [
        {
            path: AppRoutes.clinicDental,
            element: <DentalClinicPortal />,
        },
        {
            path: AppRoutes.clinicDentalExamination,
            element: <DentalExaminationPage />,
        },
        {
            path: AppRoutes.clinicDental,
            element: <DentalClinicPortal />,
        },
        {
            path: AppRoutes.patientPortalProfile,
            element: <PatientPortal />,
        },
        {
            path: AppRoutes.patientPortalAppointments,
            element: <AppointmentsPage />,
        },
        {
            path: AppRoutes.patientPortalPreviousAppointments,
            element: <PreviousAppointments />,
        },
        {
            path: AppRoutes.patientPortalUpcomingAppointments,
            element: <UpcomingAppointments />,
        },
        {
            path: AppRoutes.login,
            element: <Login />,
        },
        {
            path: AppRoutes.signup,
            element: <Signup />,
        },
    ];

    static getRoutes(): ReactElement[] {
        return Router.routes.map((route: RouteModel) => {
            return Router.handelRoutes(route);
        });
    }

    private static handelRoutes(route: RouteModel): ReactElement {
        // check if route has children
        if (route.children) {
            return (
                // return route with children
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                >
                    {route.children.map((child: RouteModel) => {
                        // check if child has children
                        return Router.handelRoutes(child);
                    })}
                </Route>
            );
        } else {
            return (
                // return route without children
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                />
            );
        }
    }
}

export default Router;
