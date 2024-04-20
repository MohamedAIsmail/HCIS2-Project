import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import auth from "../../modules/auth/slices/auth-slice";
import slotReducer from "../../modules/dental-clinic/state/slices/slotsSlice";
import doctorSlotsReducer from "../../modules/dental-clinic/state/slices/doctorSlotsSlice";
import appointmentReducer from "../../modules/dental-clinic/state/slices/appointmentSlice";
import snackbarReducer from "../../modules/dental-clinic/state/slices/snackbarSlice";
import prescriptionReducer from "../../modules/dental-clinic/state/slices/prescriptionSlice";
import examinationReducer from "../../modules/dental-clinic/state/slices/examinationSlice";
import patientReducer from "../../modules/dental-clinic/state/slices/patientSlice";


export const store = configureStore({
  reducer: {
    auth,

    // Dental Clinic And Appointments
    slotReducer,
    appointmentReducer,
    snackbarReducer,
    prescriptionReducer,
    examinationReducer,
    patientReducer,
    doctorSlotsReducer,

  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
