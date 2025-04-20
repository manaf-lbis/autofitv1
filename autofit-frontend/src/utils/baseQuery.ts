import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { setUser, clearUser } from "../features/auth/slices/authSlice";
import { LoginResponse } from "@/features/auth/api/authApi";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { user } = (getState() as RootState).auth;
    if (user?.accessToken) {
      headers.set("Authorization", `Bearer ${user.accessToken}`);
    }
    return headers;
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
export const baseQueryWithRefresh = async (args:any, api:any, extraOptions:any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      const refresh = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);

        if (refresh.data) {

            result = await baseQuery(args, api, extraOptions);
        } else {

            console.error("Refresh failed:", refresh.error);
        }
    }

    return result;
};