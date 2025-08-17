import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/utils/baseQuery';


export const liveAssistanceApi = createApi({
  reducerPath: 'liveAssistanceApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [],

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
      transformErrorResponse: (res) => res.data
    }),

    getCallSessionId: builder.query({
      query:(id: string) => ({
        url: `user/live-assistance/session/${id}/details`,
        method: 'GET',
      }),
      transformErrorResponse: (res) => res.data
    })

    
  }),

});

export const {
  useCreateBookingMutation,
  useLiveBookingDetailsQuery,
  useGetCallSessionIdQuery
} = liveAssistanceApi;