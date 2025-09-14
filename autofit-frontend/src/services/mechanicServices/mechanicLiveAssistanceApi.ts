import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";


export const mechanicLiveAssistanceApi = createApi({
  reducerPath: "mechanicLiveAssistanceApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['LiveAssistance'],

  endpoints: (builder) => ({

    getActiveCalls: builder.query({
      query: () => ({
        url: `/mechanic/live-assistance/`,
        method: "GET"
      }),
      providesTags: ['LiveAssistance'],
      transformErrorResponse: (res) => res.data
    }),

    liveAssistanceHistory: builder.query<any, { page: number }>({
      query: (page) => ({
        url: `/mechanic/live-assistance/service-history`,
        method: "GET",
        params: page ,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,

      merge: (currentCache, newCache) => {
        currentCache.history.push(...newCache.history);
        currentCache.hasMore = newCache.hasMore;
        currentCache.totalDocuments = newCache.totalDocuments;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      transformResponse: (response: { data: { totalDocuments: number; hasMore: boolean; history: any[] } }) => ({
        totalDocuments: response.data.totalDocuments,
        hasMore: response.data.hasMore,
        history: response.data.history.map((item) => ({
          _id: item._id,
          user: {
            name: item.userId.name,
            email: item.userId.email,
          },
          issue: item.issue,
          description: item.description,
          status: item.status,
          price: item.price,
          startedAt: item.startTime,
          endedAt: item.endTime,
          payment: {
            amount: item.paymentId?.amount ?? 299,
            status: item.paymentId?.status,
            paymentId: item.paymentId?.paymentId,
            receipt: item.paymentId?.receipt,
          },
        })),
      }),
      providesTags: ['LiveAssistance']
    }),


    markAsCompleted : builder.mutation<void , {serviceId:string}>({
      query: ({serviceId}) => ({
        url: `/mechanic/live-assistance/update-status`,
        method: "POST",
        body: {serviceId},
      }),
      invalidatesTags: ['LiveAssistance']
    })





  }),

});

export const {
  useGetActiveCallsQuery,
  useLiveAssistanceHistoryQuery,
  useMarkAsCompletedMutation
} = mechanicLiveAssistanceApi;