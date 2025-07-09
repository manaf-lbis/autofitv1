import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { Role } from "../../features/auth/components/Layouts/AuthLayout";


export interface VerifyEmail {
  email: string;
  role:Role
}

export interface VerifyOtp {
  otp:string
  role:Role
}

export interface UpdatePassword {
    password:string
    role:Role
}

export interface LoginResponse {
  status: "success" | "error";
  data: {
    name: string;
    role: Role;
  };
}


export const passwordResetApi = createApi({
  reducerPath: "passwordResetApi",
  baseQuery: baseQueryWithRefresh,

  endpoints: (builder) => ({

    verifyEmail: builder.mutation<LoginResponse, VerifyEmail>({
      query: ({ email, role }) => ({
        url: `auth/${role}/reset-password/verify-email`,
        method: 'POST',
        body: { email }
      })
    }),
    verifyOtp: builder.mutation<any, VerifyOtp>({
      query: ({ otp, role }) => ({
        url: `auth/${role}/reset-password/verify-otp`,
        method: 'POST',
        body: {otp}
      })
    }),
    resentOtp: builder.mutation({
      query: ({ role }:{role:Role}) => ({
        url: `auth/${role}/reset-password/resent-otp`,
        method: 'POST',
      })
    }),
    setNewPassword :builder.mutation<any,UpdatePassword>({
       query:({password,role})=>({
        url:`auth/${role}/reset-password/updatePassword`,
        method: 'POST',
        body:{password}
      }) 
    })
  }),
});

export const {
    useSetNewPasswordMutation,
    useVerifyEmailMutation,
    useVerifyOtpMutation,
    useResentOtpMutation
} = passwordResetApi;