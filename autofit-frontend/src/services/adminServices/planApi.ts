import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/utils/baseQuery';
import type { Plan, Feature, CreatePlanRequest, ApiResponse } from '@/types/plans';

export const planApi = createApi({
  reducerPath: 'planApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Plans', 'Features'],
  endpoints: (builder) => ({
    
    getPlans: builder.query<Plan[], void>({
      query: () => 'admin/plans',
      transformResponse: (response: ApiResponse<Plan[]>) => response.data || [],
      providesTags: ['Plans'],
    }),

    createPlan: builder.mutation<Plan, CreatePlanRequest>({
      query: (data) => ({
        url: 'admin/plans',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Plan>) => response.data!,
      invalidatesTags: ['Plans'],
    }),

    updatePlan: builder.mutation<Plan, { planId: string; data: Partial<CreatePlanRequest> }>({
      query: ({ planId, data }) => ({
        url: `admin/plans/${planId}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Plan>) => response.data!,
      invalidatesTags: ['Plans'],
    }),

    deletePlan: builder.mutation<void, string>({
      query: (planId) => ({
        url: `admin/plans/${planId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Plans'],
    }),
    
    togglePlanStatus: builder.mutation<Plan, string>({
      query: (planId) => ({
        url: `admin/plans/${planId}/toggle`,
        method: 'PATCH',
      }),
      transformResponse: (response: ApiResponse<Plan>) => response.data!,
      invalidatesTags: ['Plans'],
    }),

    getFeatures: builder.query<any, void>({
      query: () => 'admin/plans/features',
      transformResponse: (response: ApiResponse<Feature[]>) => response.data || [],
      providesTags: ['Features'],
    }),

    createFeature: builder.mutation<Feature, string>({
      query: (name) => ({
        url: 'admin/plans/features',
        method: 'POST',
        body: { name },
      }),
      transformResponse: (response: ApiResponse<Feature>) => response.data!,
      invalidatesTags: ['Features'],
    }),

    updateFeature: builder.mutation<Feature, { featureId: string; name: string }>({
      query: ({ featureId, name }) => ({
        url: `admin/plans/features/${featureId}`,
        method: 'PATCH',
        body: { name },
      }),
      transformResponse: (response: ApiResponse<Feature>) => response.data!,
      invalidatesTags: ['Features'], 
    }),

    deleteFeature: builder.mutation<void, string>({
      query: (featureId) => ({
        url: `admin/plans/features/${featureId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Features', 'Plans'],
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