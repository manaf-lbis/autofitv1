import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

export interface ProfileData {
    name:string,
    mobile:string
    email:string
};

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithRefresh,
  
  endpoints: (builder) => ({
    updateProfile :builder.mutation({
        query :(data : ProfileData)=>({
            url : 'user/profile/update',
            method:'PATCH',
            body : data
        })
    }),
  }),



});

export const {
    useUpdateProfileMutation,
} = profileApi;