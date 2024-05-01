import { configureStore } from "@reduxjs/toolkit";
import doctorSlice from "../pages/Doctor/doctor-slice";
import appointmentReducer  from '../pages/Doctor/appointment-slice';

// Configure a single Redux store with multiple reducers
const store = configureStore({
    reducer: {
      doctors: doctorSlice.reducer,        
      appointments: appointmentReducer,   
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type TAppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.dispatch>;

export default store;