import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import { profileApi } from "@/features/user/profile/api/profileApi";
import { passwordResetApi } from "@/features/auth/api/passwordResetApi";

import authReducer from "../features/auth/slices/authSlice";

export const store = configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [passwordResetApi.reducerPath] : passwordResetApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat( 
        authApi.middleware,
        profileApi.middleware,
        passwordResetApi.middleware 
      ),
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;

