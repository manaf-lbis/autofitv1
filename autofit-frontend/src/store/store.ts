import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import { profileApi } from "@/features/user/profile/api/profileApi";
import { passwordResetApi } from "@/features/auth/api/passwordResetApi";
import { registrationApi } from "@/features/mechanic/mechanicRegistration/api/registrationApi";
import { mapsApi } from "@/api/mapsApi";

import authReducer from "../features/auth/slices/authSlice";
import registrationReducer from '@/features/mechanic/mechanicRegistration/registrationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mechRegistration: registrationReducer,

    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [passwordResetApi.reducerPath]: passwordResetApi.reducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [mapsApi.reducerPath]: mapsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      profileApi.middleware,
      passwordResetApi.middleware,
      registrationApi.middleware,
      mapsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

