import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { IPretripSlot, } from "@/types/pretrip";

export const pretripMechanicApi = createApi({
  reducerPath: "pretripMechanicApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Slots"],
  endpoints: (builder) => ({
    getSlots: builder.query<IPretripSlot[], void>({
      query: () => ({
        url: "mechanic/pretrip/slots",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data || [],
      providesTags: ["Slots"],
    }),
    createSlots: builder.mutation<IPretripSlot[], { slots: { date: string }[] }>({
      query: (slotData) => ({
        url: "mechanic/pretrip/slots",
        method: "POST",
        body: slotData,
      }),
      invalidatesTags: ["Slots"],
    }),
    deleteSlot: builder.mutation<void, string>({
      query: (slotId) => ({
        url: `mechanic/pretrip/slots/${slotId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Slots"],
    }),

    
  }),
});

export const { useGetSlotsQuery, useCreateSlotsMutation, useDeleteSlotMutation } = pretripMechanicApi;