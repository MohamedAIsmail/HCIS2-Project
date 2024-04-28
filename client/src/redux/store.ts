import { configureStore } from "@reduxjs/toolkit";
import doctorSlice from "../pages/Doctor/doctor-slice";

const store = configureStore({
    reducer: { doctor: doctorSlice.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type TAppDispatch = typeof store.dispatch;

export default store;
