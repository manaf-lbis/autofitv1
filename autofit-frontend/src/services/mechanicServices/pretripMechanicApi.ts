import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { PretripStatus } from "@/types/pretrip";


interface PretripResponse {
  status: string;
  message: string;
  data: {
    serviceId: string;
    status: PretripStatus;
    schedule: { start: string; end: string };
    user: { _id: string; name: string; email: string; mobile: string };
    vehicle: { registration: string; brand: string; model: string; owner: string };
    service: { paymentId: string; method: string; status: string; amount: number };
    plan: {
      servicePlan: { name: string; description: string; originalPrice: number; price: number };
      reportItems: { feature: string; _id: string }[];
    };
    serviceLocation: [number, number]
  };
}

interface Report {
  _id: string,
  name: string,
  condition: string,
  remarks: string | null,
  needsAction: boolean
}



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

    updatePretripStatus: builder.mutation<any, { serviceId: string, status: PretripStatus }>({
      query: ({ serviceId, status }) => ({
        url: "/mechanic/pretrip/update-status",
        method: "PATCH",
        body: { serviceId, status },
      }),
      invalidatesTags: ["Work"],
      transformResponse: (response: any) => response.data,
    }),

    pretripDetails: builder.query<PretripResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/mechanic/pretrip/${id}/details`,
        method: "GET",
      }),
      providesTags: ["Work"],
      transformErrorResponse: (res) => res.data
    }),

    createReport: builder.mutation<any, { serviceId: string, report: Report[], mechanicNotes: string }>({
      query: ({ serviceId, report, mechanicNotes }) => ({
        url: `/mechanic/pretrip/create-report`,
        method: "POST",
        body: { serviceId, report, mechanicNotes },
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
  useUpdatePretripStatusMutation,
  usePretripDetailsQuery,
  useCreateReportMutation
} = pretripMechanicApi;