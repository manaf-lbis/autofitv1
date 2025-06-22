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
import { userChatApi } from "@/features/user/api/userChatApi";
import { adminChatApi } from "@/features/admin/api/adminChatApi";
import { mechanicChatApi } from "@/features/mechanic/api/mechanicChatApi";

import authReducer from "../features/auth/slices/authSlice";
import registrationReducer from '@/features/mechanic/slices/registrationSlice'
import adminReducer from "@/features/admin/slices/adminSlice";
import mechanicReducer from '@/features/mechanic/slices/mechanicSlice'
import chatReducer from '@/features/user/slices/chatSlice'
import mechanicChatReducer from '@/features/mechanic/slices/mechanicChatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mechRegistration: registrationReducer,
    adminSlice: adminReducer,
    mechanicSlice: mechanicReducer,
    chatSlice: chatReducer,
    mechanicChatSlice : mechanicChatReducer,


    [authApi.reducerPath]: authApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [passwordResetApi.reducerPath]: passwordResetApi.reducer,
    [mechanicApi.reducerPath]: mechanicApi.reducer,
    [mapsApi.reducerPath]: mapsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [userManagementApi.reducerPath]: userManagementApi.reducer,
    [mechananicManagementApi.reducerPath]: mechananicManagementApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [roadsideApi.reducerPath]: roadsideApi.reducer,
    [userChatApi.reducerPath]: userChatApi.reducer,
    [mechanicChatApi.reducerPath]: mechanicChatApi.reducer,
    [adminChatApi.reducerPath]: adminChatApi.reducer


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
      roadsideApi.middleware,
      userChatApi.middleware,
      mechanicChatApi.middleware,
      adminChatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

