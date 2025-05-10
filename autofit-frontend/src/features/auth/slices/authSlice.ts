// import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// interface AuthState {
//   user: { name: string; role: "mechanic" | "user" | "admin"; accessToken?: string } | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
    
//     setUser: (state, action: PayloadAction<{ name: string; role: "mechanic" | "user" | "admin"}>) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },

//     clearUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setUser, clearUser } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { name: string; role: "mechanic" | "user" | "admin" } | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; role: "mechanic" | "user" | "admin" }>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setError } = authSlice.actions;
export default authSlice.reducer;