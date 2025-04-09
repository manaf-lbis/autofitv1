import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import authReducer from '@/features/auth/slices/authSlice'



export const store = configureStore({
    reducer:{
        authApi :authApi.reducer,
        auth : authReducer
    },

    middleware:(getDefaultMiddleware)=>{
       return getDefaultMiddleware().concat(authApi.middleware)
    }
    
})