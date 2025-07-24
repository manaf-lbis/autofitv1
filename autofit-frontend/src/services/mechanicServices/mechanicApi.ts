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

    //pages
    getDashboard: builder.query<any, void>({
      query: () => ({
        url: "/mechanic/pages/dashboard",
        method: "GET",
      }),
    }),

    getInfo: builder.query<any, void>({
      query: () => ({
        url: "/mechanic/pages/info",
        method: "GET",
      }),
    }),

    setAvailability : builder.mutation<any, 'available' | 'notAvailable' | 'busy' >({
      query: (availability) => ({
        url: "/mechanic/profile/availability",
        method: "POST",
        body : {availability}
      }),
    }),

    notificationRead: builder.mutation({
      query: () => ({
        url: "/mechanic/profile/updateNotification",
        method: "POST"
      }),
    }),


  }),

});

export const {
  useRegisterMechanicMutation,
  useGetMechanicQuery,
  useGetInfoQuery,
  useResubmitRequestMutation,
  useGetDashboardQuery,
  useSetAvailabilityMutation,
  useNotificationReadMutation,
} = mechanicApi;