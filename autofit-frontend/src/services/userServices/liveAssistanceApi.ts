import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/utils/baseQuery';


export const liveAssistanceApi = createApi({
  reducerPath: 'liveAssistanceApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Details'],

  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: 'user/live-assistance/booking',
        method: 'POST',
        body: data,
      }),
      transformErrorResponse: (res) => res.data
    }),

    liveBookingDetails: builder.query({
      query: (id: string) => ({
        url: `user/live-assistance/booking/${id}/details`,
        method: 'GET',
      }),
      transformErrorResponse: (res) => res.data,
      providesTags: ['Details']
    }),

    getCallSessionId: builder.query({
      query: (id: string) => ({
        url: `user/live-assistance/session/${id}/details`,
        method: 'GET',
      }),
      transformErrorResponse: (res) => res.data
    }),


    generateInvoice: builder.mutation<void, { serviceId: string }>({
      query: ({ serviceId }) => ({
        url: `user/live-assistance/invoice`,
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


    markAsCompleted: builder.mutation<void, { serviceId: string }>({
      query: ({ serviceId }) => ({
        url: `user/live-assistance/update-status`,
        method: "POST",
        body: { serviceId },
      }),
      invalidatesTags: ['Details']
    })



  }),

});

export const {
  useCreateBookingMutation,
  useLiveBookingDetailsQuery,
  useGetCallSessionIdQuery,
  useGenerateInvoiceMutation,
  useMarkAsCompletedMutation
} = liveAssistanceApi;