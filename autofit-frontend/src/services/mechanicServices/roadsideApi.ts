import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

export type RoadsideStatusMech = 'on_the_way' | 'analysing' | 'quotation_sent' | 'completed'
export interface ServiceHistory {
  totalDocuments: number
  hasMore: boolean
  history: {
    _id: string
    userId: { _id: string; name: string; email: string; mobile: string }
    issue: string
    description: string
    vehicle: { regNo: string; brand: string; modelName: string; owner: string }
    serviceLocation: { coordinates: [number, number] }
    status: string
    startedAt: string | null
    endedAt: string | null
  }[]
}

export const roadsideApi = createApi({
  reducerPath: "roadsideApi",
  baseQuery: baseQueryWithRefresh,

  endpoints: (builder) => ({

    roadsideServiceDetails: builder.query({
      query: (id) => ({
        url: `/mechanic/services/roadside-assistance/${id}/details`,
        method: "GET"
      }),
    }),

    roadsideStatusUpdate: builder.mutation<any, { bookingId: string, status: RoadsideStatusMech }>({
      query: ({ bookingId, status }) => ({
        url: '/mechanic/services/roadside-assistance/status',
        method: "POST",
        body: { status, bookingId }
      }),
    }),

    generateQuotation: builder.mutation({
      query: ({ bookingId, items, notes, total }) => ({
        url: '/mechanic/services/roadside-assistance/quotation',
        method: "POST",
        body: { bookingId, items, notes, total }
      }),
    }),

    roadsideServiceHistory: builder.query<ServiceHistory, { page: number; search?: string }>({
      query: ({ page, search }) => ({
        url: "/mechanic/services/service-history",
        method: "GET",
        params: { page, search },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs.search || ""}-${queryArgs.page}`,
      merge: (currentCache, newCache, { arg }) => {
        if (arg.page === 1) {
          currentCache.history = newCache.history
        } else {
          currentCache.history.push(...newCache.history)
        }
        currentCache.hasMore = newCache.hasMore
        currentCache.totalDocuments = newCache.totalDocuments
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.search !== previousArg?.search
      },
      transformResponse: (response: { status: string; message: string; data: ServiceHistory }) => response.data,
    }),





  }),

});

export const {
  useRoadsideServiceDetailsQuery,
  useRoadsideStatusUpdateMutation,
  useGenerateQuotationMutation,
  useRoadsideServiceHistoryQuery
} = roadsideApi;