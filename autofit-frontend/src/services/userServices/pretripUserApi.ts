// import { createApi } from '@reduxjs/toolkit/query/react';
// import { baseQueryWithRefresh } from '@/utils/baseQuery';
// import { ApiResponse, Plan } from '@/types/plans';

// export const pretripUserApi = createApi({
//   reducerPath: 'pretripUserApi',
//   baseQuery: baseQueryWithRefresh,
//   tagTypes: [],
//   endpoints: (builder) => ({

//     getPretripPlans : builder.query({
//       query: () => 'user/pretrip/plans',
//       transformResponse: (response: ApiResponse<Plan[]>) => response.data || [],
//     }),

//     getPlanForBooking : builder.query({
//       query: (id) => `user/pretrip/plan/${id}`,
//       transformResponse: (response: ApiResponse<Plan>) => response.data!,
//     }),

//     getNearbyMechanicShops : builder.query<any,{ lat: number; lng: number }>({
//       query: (coordinates) =>({
//         url: 'user/pretrip/mechanic-shops',
//         method: 'GET',
//         body: coordinates,
//       }),
//       // transformResponse: (response: ApiResponse<Plan[]>) => response.data || [],
//     }),



//   })

// });

// export const {
//   useGetPretripPlansQuery,
//   useGetPlanForBookingQuery,
//   useGetNearbyMechanicShopsQuery
// } = pretripUserApi;



import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/utils/baseQuery';
import { ApiResponse, Plan } from '@/types/plans';


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

    getNearbyMechanicShops: builder.query<any, { lat: number; lng: number }>({
      query: (coordinates) => ({
        url: `user/pretrip/mechanic-shops?lat=${coordinates.lat}&lng=${coordinates.lng}`,
        method: 'GET',
      }),
      providesTags: ['MechanicShops'],
    }),

  }),
});

export const {
  useGetPretripPlansQuery,
  useGetPlanForBookingQuery,
  useGetNearbyMechanicShopsQuery,
} = pretripUserApi;