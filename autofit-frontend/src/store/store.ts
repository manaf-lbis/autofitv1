import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authServices/authApi";
import { vehicleApi } from "@/services/userServices/vehicleApi";
import { passwordResetApi } from "@/services/authServices/passwordResetApi";
import { mechanicApi } from "@/services/mechanicServices/mechanicApi";
import { mapsApi } from "@/services/commonServices/mapsApi";
import { profileApi } from '@/services/userServices/profileApi'
import { userManagementApi } from "@/services/adminServices/userManagement";
import { mechananicManagementApi } from "@/services/adminServices/mechanicManagement";
import { servicesApi } from "@/services/userServices/servicesApi";
import { roadsideApi } from "@/services/mechanicServices/roadsideApi";
import { userChatApi } from "@/services/userServices/userChatApi";
import { adminChatApi } from "@/services/adminServices/adminChatApi";
import { mechanicChatApi } from "@/services/mechanicServices/mechanicChatApi";


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
    [adminChatApi.reducerPath]: adminChatApi.reducer,

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
      adminChatApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

