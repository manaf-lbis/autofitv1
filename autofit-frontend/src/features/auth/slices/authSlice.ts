import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../api/authApi";

interface AuthState {
  user: { name: string; role: "mechanic" | "user" | "admin"; accessToken?: string } | null;
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
    setUser: (state, action: PayloadAction<{ name: string; role: "mechanic" | "user" | "admin"; accessToken?: string }>) => {
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