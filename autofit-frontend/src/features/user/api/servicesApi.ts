import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";



export const servicesApi = createApi({
    reducerPath: "servicesApi",
    baseQuery: baseQueryWithRefresh,

    endpoints: (builder) => ({

        getNearByMechanic: builder.query<any, { lat: number; lng: number }>({
            query: ({ lat, lng }) => ({
                url: 'user/services/mechanic-near-me',
                method: 'GET',
                params: { lat, lng }
            })
        }),

        bookEmergencyAssistance: builder.mutation<any, { mechanicId: string, vehicleId: string, issue: string, description: string ,coordinates:{lat:number,lng:number}}>({
            query: ({ mechanicId, vehicleId, issue, description, coordinates}) => ({
                url: 'user/services/roadside-assistance',
                method: 'POST',
                body: { mechanicId, vehicleId, issue, description,coordinates}


            })
        }),




    }),



});

export const {
    useGetNearByMechanicQuery,
    useBookEmergencyAssistanceMutation
} = servicesApi;