import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/utils/baseQuery';
import { ApiResponse, Plan } from '@/types/plans';

interface MechanicData {
  mechanicId: string;
  shopName: string;
  distanceInMeters: number;
  place: string;
  specialised: string;
  availableWindows: { [date: string]: { start: string; end: string }[] };
  rating?: { avg: number; review: number; _id: string; };
}


export const pretripUserApi = createApi({
  reducerPath: 'pretripUserApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['MechanicShops', 'Plans'],

  endpoints: (builder) => ({

    getPretripPlans: builder.query({
      query: () => 'user/pretrip/plans',
      transformResponse: (response: ApiResponse<Plan[]>) => response.data || [],
      providesTags: ['Plans'],
    }),

    getPlanForBooking: builder.query({
      query: (id) => `user/pretrip/plan/${id}`,
      transformResponse: (response: ApiResponse<Plan>) => response.data ?? {},
    }),

    getNearbyMechanicShops: builder.query<MechanicData[], { lat: number; lng: number }>({
      query: (coordinates) => ({
        url: `user/pretrip/mechanic-shops?lat=${coordinates.lat}&lng=${coordinates.lng}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<MechanicData[]>) => response.data || [],
      providesTags: ['MechanicShops'],
    }),

    createBooking: builder.mutation<any, { planId: string; mechanicId: string, vehicleId: string, slot: { date: string, time: string }, coords: { lat: number; lng: number } }>({
      query: (data) => ({
        url: 'user/pretrip/booking',
        method: 'POST',
        body: data,
      })
    }),

    pretripDetails: builder.query<any, { id: string }>({
      query: ({ id }) => `user/pretrip/${id}/details`,
      transformResponse: (response: ApiResponse<Plan>) => response.data ?? {},
    }),

    generateInvoice: builder.mutation<void, { serviceId: string }>({
      query: ({ serviceId }) => ({
        url: `user/pretrip/invoice`,
        method: "POST",
        body: { serviceId },
        responseType: "blob",
      }),
      transformResponse: (response: Blob, meta, arg) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${arg.serviceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    }),

    generateReport: builder.mutation<void, { serviceId: string }>({
      query: ({ serviceId }) => ({
        url: `user/pretrip/report`,
        method: "POST",
        body: { serviceId },
        responseType: "blob",
      }),
      transformResponse: (response: Blob, meta, arg) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${arg.serviceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    }),

  }),
});

export const {
  useGetPretripPlansQuery,
  useGetPlanForBookingQuery,
  useGetNearbyMechanicShopsQuery,
  useCreateBookingMutation,
  usePretripDetailsQuery,
  useGenerateInvoiceMutation,
  useGenerateReportMutation
} = pretripUserApi;