import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  name: string;
  role: "mechanic" | "user" | "admin";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  mobile: string;
}

export interface LoginResponse {
  status: "success" | "error";
  data: {
    name: string;
    role: "user" | "admin" | "mechanic";
  };
}

interface AuthInput {
  code: string;
  role: "user" | "mechanic";
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query<LoginResponse, void>({
      query: () => ({
        url: "auth/user/me",
        method: "GET",
      }),
    }),
    signup: builder.mutation<any, SignupRequest>({
      query: (credentials) => ({
        url: "auth/user/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation<LoginResponse, { otp: string }>({
      query: (otp) => ({
        url: "auth/user/verify-otp",
        method: "POST",
        body: { otp },
      }),
    }),
    googleLogin: builder.mutation<LoginResponse, AuthInput>({
      query: ({ code, role }) => ({
        url: "/auth/google/callback",
        method: "POST",
        body: { code, role },
      })
    }),

    logout: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  })

});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useGoogleLoginMutation,
} = authApi;