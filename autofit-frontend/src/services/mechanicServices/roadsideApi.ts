import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

export type RoadsideStatusMech ='on_the_way'|'analysing' | 'quotation_sent'| 'completed' 

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

    roadsideStatusUpdate: builder.mutation<any,{bookingId:string,status:RoadsideStatusMech}>({
      query: ({bookingId,status}) => ({
        url: '/mechanic/services/roadside-assistance/status',
        method: "POST",
        body: {status,bookingId}
      }),
    }),

    generateQuotation: builder.mutation({
      query: ({bookingId,items,notes,total}) => ({
        url: '/mechanic/services/roadside-assistance/quotation',
        method: "POST",
        body: {bookingId,items,notes,total}
      }),
    }),

     








  }),

});

export const {
  useRoadsideServiceDetailsQuery,
  useRoadsideStatusUpdateMutation,
  useGenerateQuotationMutation
} = roadsideApi;