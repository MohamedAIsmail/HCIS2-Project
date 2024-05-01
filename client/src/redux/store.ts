import { configureStore } from "@reduxjs/toolkit";
import doctorSlice from "../pages/Doctor/doctor-slice";
import appointmentReducer  from '../pages/Doctor/appointment-slice';  // Update the path to where your appointment slice is located

// Configure a single Redux store with multiple reducers
const store = configureStore({
    reducer: {
      doctors: doctorSlice.reducer,        
      appointments: appointmentReducer,   
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type TAppDispatch = typeof store.dispatch;

export default store;