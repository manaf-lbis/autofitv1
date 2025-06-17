import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import { vehicleApi } from "@/features/user/api/vehicleApi";
import { passwordResetApi } from "@/features/auth/api/passwordResetApi";
import { mechanicApi } from "@/features/mechanic/api/mechanicApi";
import { mapsApi } from "@/api/mapsApi";
import { profileApi } from '@/features/user/api/profileApi'
import { userManagementApi } from "@/features/admin/api/userManagement";
import { mechananicManagementApi } from "@/features/admin/api/mechanicManagement";
import { servicesApi } from "@/features/user/api/servicesApi";
import { roadsideApi } from "@/features/mechanic/api/roadsideApi";

import authReducer from "../features/auth/slices/authSlice";
import registrationReducer from '@/features/mechanic/slices/registrationSlice'
import adminReducer  from "@/features/admin/slices/adminSlice";
import mechanicReducer from '@/features/mechanic/slices/mechanicSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mechRegistration: registrationReducer,
    adminSlice : adminReducer,
    mechanicSlice : mechanicReducer,
    

    [authApi.reducerPath]: authApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [passwordResetApi.reducerPath]: passwordResetApi.reducer,
    [mechanicApi.reducerPath]: mechanicApi.reducer,
    [mapsApi.reducerPath]: mapsApi.reducer,
    [profileApi.reducerPath] : profileApi.reducer,
    [userManagementApi.reducerPath] : userManagementApi.reducer,
    [mechananicManagementApi.reducerPath] : mechananicManagementApi.reducer,
    [servicesApi.reducerPath] : servicesApi.reducer,
    [roadsideApi.reducerPath] :roadsideApi.reducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      vehicleApi.middleware,
      passwordResetApi.middleware,
      mechanicApi.middleware,
      mapsApi.middleware,
      profileApi.middleware,
      userManagementApi.middleware,
      mechananicManagementApi.middleware,
      servicesApi.middleware,
      roadsideApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

