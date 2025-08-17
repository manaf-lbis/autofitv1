import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

export const mechanicLiveAssistanceApi = createApi({
  reducerPath: "mechanicLiveAssistanceApi",
  baseQuery: baseQueryWithRefresh,

  endpoints: (builder) => ({

    getActiveCalls: builder.query({
      query: () => ({
        url: `/mechanic/live-assistance/`,
        method: "GET"
      }),
      transformErrorResponse: (res) => res.data
    }),



  }),

});

export const {
  useGetActiveCallsQuery
} = mechanicLiveAssistanceApi;