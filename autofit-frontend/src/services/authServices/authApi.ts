import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { Role } from "../../features/auth/components/Layouts/AuthLayout";
import { clearUser } from "../../features/auth/slices/authSlice";

export interface UserData {
  name : string;
  email : string;
  mobile : string;
  role : Role;
  avatar?: string
  profileStatus? : 'pending' | 'approved' | 'rejected' | null
}

export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}
export interface SignupRequest extends UserData {
  password: string;
  role: Exclude<Role, 'admin'>;
}

export interface LoginResponse {
  status: "success" | "error";
  data: UserData
}

interface AuthInput {
  code: string;
  role: Role;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password, role }) => ({
        url: `auth/${role}/login`,
        method: 'POST',
        body: { email, password }
      })
    }),
    signup: builder.mutation<any, SignupRequest>({
      query: ({ name, email, password, mobile, role }) => ({
        url: `auth/${role}/signup`,
        method: 'POST',
        body: { name, email, password, mobile }
      })
    }),
    getCurrentUser: builder.query<LoginResponse, void>({
      query: () => {
        const role = localStorage.getItem('userRole') || 'user';
        return `auth/${role}/me`;
      },
    }),
    googleLogin: builder.mutation<LoginResponse, AuthInput>({
      query: ({ code, role }) => ({
        url: `auth/${role}/google/callback`,
        method: 'POST',
        body: { code },
      }),
    }),
    verifyOtp: builder.mutation<LoginResponse, { otp: string; role: Role }>({
      query: ({otp,role}) => ({
        url: `auth/${role}/verify-otp`,
        method: "POST",
        body: { otp },
      }),
    }),
    resentOtp: builder.mutation<any, { role: Role }>({
      query: ({role}) => ({
        url: `auth/${role}/resent-otp`,
        method: "POST",
      }),
    }),
    logout: builder.mutation<LoginResponse, void>({
      query: () => {
        const role = localStorage.getItem('userRole') || 'user';
        return {
          url: `auth/${role}/logout`,
          method: 'POST',
          credentials: 'include',
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(clearUser());
          localStorage.clear();
          document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useSignupMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useVerifyOtpMutation,
  useResentOtpMutation
} = authApi;