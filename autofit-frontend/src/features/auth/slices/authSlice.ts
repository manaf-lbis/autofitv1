// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../api/authApi";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;