import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { PretripStatus } from "@/types/pretrip";

export const pretripMechanicApi = createApi({
  reducerPath: "pretripMechanicApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Schedule", "Work"],
  endpoints: (builder) => ({

    weeklySchedules: builder.query<any, void>({
      query: () => ({
        url: "/mechanic/pretrip/weekly-schedules",
        method: "GET",
      }),
      providesTags: ["Schedule"],
      transformErrorResponse: (res) => res.data
    }),

    blockSchedule: builder.mutation<any, any>({
      query: (slotData) => ({
        url: "/mechanic/profile/block-schedule",
        method: "POST",
        body: slotData,
      }),
      invalidatesTags: ["Schedule"],
      transformResponse: (response: any) => response.data,
    }),

    unblockSchedule: builder.mutation<any, { id: string }>({
      query: (slotData) => ({
        url: "/mechanic/profile/unblock-schedule",
        method: "DELETE",
        body: slotData,
      }),
      invalidatesTags: ["Schedule"],
      transformResponse: (response: any) => response.data,
    }),

    updatePretripStatus: builder.mutation<any, { id: string; status: PretripStatus }>({
      query: (slotData) => ({
        url: "/mechanic/pretrip/update-pretrip-status",
        method: "POST",
        body: slotData,
      }),
      invalidatesTags: ["Work"],
      transformResponse: (response: any) => response.data,
    }),




  })

});

export const {
  useWeeklySchedulesQuery,
  useBlockScheduleMutation,
  useUnblockScheduleMutation,
} = pretripMechanicApi;