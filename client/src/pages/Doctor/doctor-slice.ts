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
export interface IDoctor {
    _id?: string;
    username: string;
    email: string;
    password: string;
    name: string;
    specialization: string;
    licenseNumber: string;
    certifications?: string[];
    schedule?: Schedule[];
}

// Define the initial state
const initialState: IDoctor[] = [];

// Create the doctor slice
const doctorSlice = createSlice({
    name: "doctors",
    initialState,
    reducers: {
        addDoctors(state, action: PayloadAction<IDoctor[]>) {
            return action.payload;
        },
        addDoctor(state, action: PayloadAction<IDoctor>) {
            state.push(action.payload);
        },
        removeDoctor(state, action: PayloadAction<string>) {
            return state.filter((doctor) => doctor._id !== action.payload);
        },
        updateDoctor(
            state,
            action: PayloadAction<{ _id: string; updatedDoctorData: IDoctor }>
        ) {
            const { _id, updatedDoctorData } = action.payload;
            const doctorToUpdate = state.find((doctor) => doctor._id === _id);
            if (doctorToUpdate) {
                Object.assign(doctorToUpdate, updatedDoctorData);
            }
        },
    },
});

export const deleteDoctorThunk = (doctorId: string) => {
    return async (dispatch: Dispatch) => {
        await axios.delete(
            `http://localhost:8000/api/v1/healthcareProvider/${doctorId}`
        );
        dispatch(doctorSlice.actions.removeDoctor(doctorId));
    };
};

export const AddDoctorThunk = (doctorData: IDoctor) => {
    return async (dispatch: Dispatch) => {
        const response = await axios.post(
            "http://localhost:8000/api/v1/healthcareProvider",
            doctorData
        );
        const doctor: IDoctor = response.data.healthcareProvider;
        dispatch(doctorSlice.actions.addDoctor(doctor));
    };
};

export const fetchDoctorsDataThunk = () => {
    return async (dispatch: Dispatch) => {
        const response = await axios.get(
            "http://localhost:8000/api/v1/healthcareProvider"
        );

        const doctors: IDoctor[] = response.data.healthcareProviders;

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
