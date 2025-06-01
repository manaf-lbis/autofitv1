import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import { vehicleApi } from "@/features/user/api/vehicleApi";
import { passwordResetApi } from "@/features/auth/api/passwordResetApi";
import { registrationApi } from "@/features/mechanic/mechanicRegistration/api/registrationApi";
import { mapsApi } from "@/api/mapsApi";
import { profileApi } from '@/features/user/api/profileApi'

import authReducer from "../features/auth/slices/authSlice";
import registrationReducer from '@/features/mechanic/mechanicRegistration/registrationSlice'
import  adminReducer  from "@/features/admin/slice/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mechRegistration: registrationReducer,
    adminSlice : adminReducer,

    [authApi.reducerPath]: authApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [passwordResetApi.reducerPath]: passwordResetApi.reducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [mapsApi.reducerPath]: mapsApi.reducer,
    [profileApi.reducerPath] : profileApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      vehicleApi.middleware,
      passwordResetApi.middleware,
      registrationApi.middleware,
      mapsApi.middleware,
      profileApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

