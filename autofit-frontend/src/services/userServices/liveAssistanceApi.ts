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
    })

    
  }),

});

export const {
  useCreateBookingMutation
} = liveAssistanceApi;