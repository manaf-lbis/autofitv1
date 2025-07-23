import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/utils/baseQuery';
import { ApiResponse, Plan } from '@/types/plans';

export const pretripUserApi = createApi({
  reducerPath: 'pretripUserApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [],
  endpoints: (builder) => ({

    getPretripPlans : builder.query({
      query: () => 'user/pretrip/plans',
      transformResponse: (response: ApiResponse<Plan[]>) => response.data || [],
    }),

    


  })

});

export const {useGetPretripPlansQuery} = pretripUserApi;