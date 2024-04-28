import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";

import axios from "axios";

// Define the interface for the schedule data
interface Schedule {
    appointmentReason: "ROUTINE" | "WALKIN" | "FOLLOWUP" | "EMERGENCY";
    appointmentTime: string;
    appointmentDuration: string;
    requestedStartDateTimeRange: string;
    priorityARQ: "Stat" | "ASAP" | "Routine" | "Timing critical";
    repeatingInterval: string;
    repeatingIntervalDuration: string;
    placerContactPerson: string;
    PlacerContactPhoneNumber: string;
}

// Define the interface for the doctor data
interface Doctor {
    _id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    specialization: string;
    licenseNumber: string;
    certifications: string[];
    schedule: Schedule[];
}

// Define the initial state
const initialState: Doctor[] = [];

// Create the doctor slice
const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {
        addDoctors(state, action: PayloadAction<Doctor[]>) {
            return action.payload;
        },
        addDoctor(state, action: PayloadAction<Doctor>) {
            state.push(action.payload);
        },
        removeDoctor(state, action: PayloadAction<string>) {
            return state.filter((doctor) => doctor._id !== action.payload);
        },
        updateDoctor(
            state,
            action: PayloadAction<{ _id: string; updatedDoctorData: Doctor }>
        ) {
            const { _id, updatedDoctorData } = action.payload;
            const doctorToUpdate = state.find((doctor) => doctor._id === _id);
            if (doctorToUpdate) {
                Object.assign(doctorToUpdate, updatedDoctorData);
            }
        },
    },
});

export const fetchDoctorsDataThunk = () => {
    console.log("fetchDoctorsDataThunk");
    return async (dispatch: Dispatch) => {
        const response = await axios.get(
            "http://localhost:8000/api/v1/healthcareProvider"
        );
        console.log(response);
        const doctors: Doctor[] = response.data.healthcareProviders;

        if (!doctors) {
            return;
        }

        dispatch(doctorSlice.actions.addDoctors(doctors));
    };
};

// Export actions
export const { addDoctor, removeDoctor, updateDoctor } = doctorSlice.actions;

// Export reducer
export default doctorSlice;
