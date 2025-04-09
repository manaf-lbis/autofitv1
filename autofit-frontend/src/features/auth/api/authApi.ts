import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface User {
    id: string;
    name: string;
    email: string;
    role: 'meachnic' | 'user' | 'admin';
};

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest extends LoginRequest {
    password: string
}

export interface loginresponse{
    status:string,
    data: User
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_API_URL,
        credentials:'include'
    }),
    endpoints: (builder) => ({

        login: builder.mutation<loginresponse,LoginRequest>({
            query: (credentials) => ({
                url: 'auth/user/login',
                method: 'POST',
                body: credentials

            })
        }),
        signup : builder.mutation({
            query : (credentials )=>({
                url :  'auth/user/signup',
                method : 'POST',
                body : credentials
            })
        }),
        verifyOtp : builder.mutation({
            query : (otp) =>({
                url : 'auth/user/verify-otp',
                method : 'POST',
                body: {otp,message:'good'}
            })
        })
    })

})

export const {useLoginMutation ,useSignupMutation ,useVerifyOtpMutation} = authApi