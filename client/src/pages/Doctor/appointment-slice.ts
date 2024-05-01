import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';

interface HL7Segment {
    segment: string;
    fields: { [key: string]: any };
}

interface HL7Appointment {
    "1": HL7Segment;
    "2": HL7Segment;
    "3": HL7Segment;
}

const initialState: HL7Appointment[] = [];

const appointmentSlice = createSlice({
    name: "hl7Appointments",
    initialState,
    reducers: {
        addHL7Appointments(state, action: PayloadAction<HL7Appointment[]>) {
            return action.payload;
        },
        addHL7Appointment(state, action: PayloadAction<HL7Appointment>) {
            state.push(action.payload);
        },
        removeHL7Appointment(state, action: PayloadAction<number>) {
            return state.filter((_, index) => index !== action.payload);
        },
        updateHL7Appointment(
            state,
            action: PayloadAction<{ index: number; updatedHL7AppointmentData: HL7Appointment }>
        ) {
            const { index, updatedHL7AppointmentData } = action.payload;
            state[index] = updatedHL7AppointmentData;
        },
    },
});

// Thunk to add an HL7 appointment
export const addHL7AppointmentThunk = (appointmentData: string, doctorId: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const parsedData = JSON.parse(appointmentData); // Parsing the JSON string to an object
            const response = await axios.post(
                `http://localhost:8000/api/v1/appointment/${doctorId}`,
                parsedData
            );
            const hl7Appointment: HL7Appointment = response.data;
            dispatch(appointmentSlice.actions.addHL7Appointment(hl7Appointment));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log('Error response:', error.response.data);
            } else {
                console.log('Unexpected error:', error);
            }
        }
    };
};


export const fetchHL7AppointmentsDataThunk = (doctorId: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/healthcareProvider`);
            const data=response.data
            const healthcareProviders = response.data.healthcareProviders;

            // Find the doctor object with the given ID
            const doctor = healthcareProviders.find((provider: { _id: string; role: string; }) => provider._id === doctorId && provider.role === 'doctor');
            if (doctor) {

                dispatch(appointmentSlice.actions.addHL7Appointments(doctor.schedule));
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };
};


// Export actions
export const { addHL7Appointment, removeHL7Appointment, updateHL7Appointment } = appointmentSlice.actions;

// Export reducer
export default appointmentSlice.reducer;
