import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

type SuccessResponse = {
  message: string;
  data?: any;
};


export const mechanicApi = createApi({
  reducerPath: "mechanicApi",
  baseQuery: baseQueryWithRefresh,

  endpoints: (builder) => ({

    //registration
    registerMechanic: builder.mutation<SuccessResponse, FormData>({
      query: (formData) => ({
        url: "/mechanic/profile/register",
        method: "POST",
        body: formData,
      }),
    }),
  
    resubmitRequest: builder.mutation({
      query: () => ({
        url: `/mechanic/profile/resubmit-request`,
        method: "POST",
      }),
    }),

    //fetch profile
    getMechanic: builder.query<any, void>({
      query: () => ({
        url: "/mechanic/profile/me",
        method: "GET",
      }),
    }),

    getDashboard: builder.query<any, void>({
      query: () => ({
        url: "/mechanic/details",
        method: "GET",
      }),
    }),


  }),
});

export const {
  useRegisterMechanicMutation,
  useGetMechanicQuery,
  useResubmitRequestMutation
} = mechanicApi;