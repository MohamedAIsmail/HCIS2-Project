import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "sub-admin";
    passwordChangedAt?: Date;
    passwordResetCode?: string;
    passwordResetExpiration?: Date;
    passwordResetVerification?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AdminState {
    admins: Admin[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    admins: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        // Define your reducers here
        // For example, adding an admin
        addAdmin(state, action: PayloadAction<Admin>) {
            state.admins.push(action.payload);
        },
        // Add other reducers like removeAdmin, updateAdmin, etc.
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { addAdmin, setLoading, setError } = adminSlice.actions;

export default adminSlice.reducer;
