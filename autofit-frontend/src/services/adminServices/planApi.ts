import { createApi } from '@reduxjs/toolkit/query/react';
import type { Plan, Feature, CreatePlanRequest, ApiResponse } from '@/types/plans';
import { baseQueryWithRefresh } from '@/utils/baseQuery';

export const planApi = createApi({
  reducerPath: 'planApi',
  baseQuery: baseQueryWithRefresh,

  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], void>({
      query: () => '/plans',
      transformResponse: (response: ApiResponse<Plan[]>) => response.data || [],
    }),

    createPlan: builder.mutation<Plan, CreatePlanRequest>({
      query: (data) => ({
        url: '/plans',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Plan>) => response.data!,
    }),

    updatePlan: builder.mutation<Plan, { id: string; data: Partial<CreatePlanRequest> }>({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Plan>) => response.data!,
    }),

    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'DELETE',
      }),
    }),

    togglePlanStatus: builder.mutation<Plan, string>({
      query: (id) => ({
        url: `/plans/${id}/toggle`,
        method: 'PATCH',
      }),
      transformResponse: (response: ApiResponse<Plan>) => response.data!,
    }),

    getFeatures: builder.query<Feature[], void>({
      query: () => '/features',
      transformResponse: (response: ApiResponse<Feature[]>) => response.data || [],
    }),

    createFeature: builder.mutation<Feature, string>({
      query: (name) => ({
        url: '/features',
        method: 'POST',
        body: { name },
      }),
      transformResponse: (response: ApiResponse<Feature>) => response.data!,
    }),

    updateFeature: builder.mutation<Feature, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/features/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      transformResponse: (response: ApiResponse<Feature>) => response.data!,
    }),

    deleteFeature: builder.mutation<void, string>({
      query: (id) => ({
        url: `/features/${id}`,
        method: 'DELETE',
      }),
    }),

  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useTogglePlanStatusMutation,
  useGetFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = planApi;